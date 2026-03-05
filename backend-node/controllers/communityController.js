const asyncHandler = require('../utils/asyncHandler');
const CommunityPost = require('../models/CommunityPost');
const CommunityComment = require('../models/CommunityComment');
const User = require('../models/User');

// Helper: calculate feed score
function calcFeedScore(post) {
  const engagement = (post.likesCount || 0) + (post.commentsCount || 0) * 2;
  const ageHours = (Date.now() - new Date(post.createdAt).getTime()) / 3600000;
  const recency = Math.max(0, 1 - ageHours / 168); // decay over 1 week
  return Math.round((engagement * 0.4 + recency * 30 * 0.3) * 100) / 100;
}

// Gamification point values
const POINTS = {
  CREATE_POST: 5,
  LIKE_RECEIVED: 2,
  HELPFUL_ANSWER: 10,
  ACCEPTED_ANSWER: 15,
  PROJECT_SHOWCASE: 20
};

// ═══════════════════════════════════════════════════════════════════
//  PUBLIC ENDPOINTS (no auth required)
// ═══════════════════════════════════════════════════════════════════

// GET /api/community/public — Public feed
exports.getPublicFeed = asyncHandler(async (req, res) => {
  const { domain, type, tag, page = 1, limit = 20 } = req.query;
  const filter = { visibility: 'Public' };

  if (domain) filter.domainTag = domain;
  if (type) filter.postType = type;
  if (tag) filter.tags = tag;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const posts = await CommunityPost.find(filter)
    .populate('authorId', 'name avatar primaryDomain communityScore year')
    .sort({ feedScore: -1, createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .lean();

  const total = await CommunityPost.countDocuments(filter);

  // Get trending tags
  const trendingTags = await CommunityPost.aggregate([
    { $match: { visibility: 'Public', createdAt: { $gte: new Date(Date.now() - 7 * 24 * 3600000) } } },
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  // Sanitize: hide emails and internal data
  const safePosts = posts.map(p => ({
    _id: p._id,
    content: p.content,
    images: p.images,
    tags: p.tags,
    domainTag: p.domainTag,
    postType: p.postType,
    githubLink: p.githubLink,
    demoLink: p.demoLink,
    likesCount: p.likesCount,
    commentsCount: p.commentsCount,
    createdAt: p.createdAt,
    author: {
      name: p.authorId?.name,
      avatar: p.authorId?.avatar,
      domain: p.authorId?.primaryDomain,
      score: p.authorId?.communityScore || 0,
      year: p.authorId?.year
    }
  }));

  res.json({
    success: true,
    posts: safePosts,
    trendingTags: trendingTags.map(t => ({ tag: t._id, count: t.count })),
    pagination: { page: parseInt(page), total, pages: Math.ceil(total / parseInt(limit)) }
  });
});

// GET /api/community/leaderboard — Public leaderboard
exports.getPublicLeaderboard = asyncHandler(async (req, res) => {
  const { domain } = req.query;
  const filter = { communityScore: { $gt: 0 } };
  if (domain) filter.primaryDomain = domain;

  const leaders = await User.find(filter)
    .select('name avatar primaryDomain communityScore year')
    .sort({ communityScore: -1 })
    .limit(25)
    .lean();

  res.json({ success: true, leaderboard: leaders });
});

// ═══════════════════════════════════════════════════════════════════
//  PRIVATE ENDPOINTS (auth required)
// ═══════════════════════════════════════════════════════════════════

// GET /api/community/feed — Authenticated feed (includes private posts)
exports.getAuthFeed = asyncHandler(async (req, res) => {
  const { domain, type, tag, page = 1, limit = 20 } = req.query;
  const filter = {};

  if (domain) filter.domainTag = domain;
  if (type) filter.postType = type;
  if (tag) filter.tags = tag;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const posts = await CommunityPost.find(filter)
    .populate('authorId', 'name avatar primaryDomain communityScore year domainLevel')
    .sort({ feedScore: -1, createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .lean();

  const total = await CommunityPost.countDocuments(filter);
  const userId = req.user.id;

  // Enrich with user interaction state
  const enriched = posts.map(p => ({
    ...p,
    isLiked: p.likes?.some(id => id.toString() === userId),
    isSaved: p.saves?.some(id => id.toString() === userId),
    isOwner: p.authorId?._id?.toString() === userId
  }));

  // Trending tags
  const trendingTags = await CommunityPost.aggregate([
    { $match: { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 3600000) } } },
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  res.json({
    success: true,
    posts: enriched,
    trendingTags: trendingTags.map(t => ({ tag: t._id, count: t.count })),
    pagination: { page: parseInt(page), total, pages: Math.ceil(total / parseInt(limit)) }
  });
});

// POST /api/community/create — Create post
exports.createPost = asyncHandler(async (req, res) => {
  const { content, images, tags, domainTag, postType, githubLink, demoLink, visibility } = req.body;

  if (!content) return res.status(400).json({ success: false, message: 'Content is required' });

  const post = await CommunityPost.create({
    authorId: req.user.id,
    content,
    images: images || [],
    tags: tags || [],
    domainTag: domainTag || req.user.primaryDomain || 'General',
    postType: postType || 'Discussion',
    githubLink: githubLink || '',
    demoLink: demoLink || '',
    visibility: visibility || 'Public',
    collegeId: req.user.collegeId
  });

  // Award points
  let points = POINTS.CREATE_POST;
  if (postType === 'Project') points += POINTS.PROJECT_SHOWCASE;

  await User.findByIdAndUpdate(req.user.id, {
    $inc: { communityScore: points }
  });

  // Update feed score
  post.feedScore = calcFeedScore(post);
  await post.save();

  const populated = await CommunityPost.findById(post._id)
    .populate('authorId', 'name avatar primaryDomain communityScore year');

  res.status(201).json({ success: true, post: populated });
});

// POST /api/community/like/:postId — Toggle like
exports.toggleLike = asyncHandler(async (req, res) => {
  const post = await CommunityPost.findById(req.params.postId);
  if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

  const userId = req.user.id;
  const alreadyLiked = post.likes.includes(userId);

  if (alreadyLiked) {
    post.likes.pull(userId);
    post.likesCount = Math.max(0, post.likesCount - 1);
    // Remove points from author
    if (post.authorId.toString() !== userId) {
      await User.findByIdAndUpdate(post.authorId, { $inc: { communityScore: -POINTS.LIKE_RECEIVED } });
    }
  } else {
    post.likes.push(userId);
    post.likesCount += 1;
    // Award points to author
    if (post.authorId.toString() !== userId) {
      await User.findByIdAndUpdate(post.authorId, { $inc: { communityScore: POINTS.LIKE_RECEIVED } });
    }
  }

  post.feedScore = calcFeedScore(post);
  await post.save();

  res.json({ success: true, liked: !alreadyLiked, likesCount: post.likesCount });
});

// POST /api/community/save/:postId — Toggle save
exports.toggleSave = asyncHandler(async (req, res) => {
  const post = await CommunityPost.findById(req.params.postId);
  if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

  const userId = req.user.id;
  const alreadySaved = post.saves.includes(userId);

  if (alreadySaved) {
    post.saves.pull(userId);
  } else {
    post.saves.push(userId);
  }
  await post.save();

  res.json({ success: true, saved: !alreadySaved });
});

// POST /api/community/comment/:postId — Add comment
exports.addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ success: false, message: 'Comment content is required' });

  const post = await CommunityPost.findById(req.params.postId);
  if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

  const comment = await CommunityComment.create({
    postId: req.params.postId,
    userId: req.user.id,
    content
  });

  post.commentsCount += 1;
  post.feedScore = calcFeedScore(post);
  await post.save();

  const populated = await CommunityComment.findById(comment._id)
    .populate('userId', 'name avatar primaryDomain communityScore');

  res.status(201).json({ success: true, comment: populated });
});

// GET /api/community/comments/:postId — Get comments
exports.getComments = asyncHandler(async (req, res) => {
  const comments = await CommunityComment.find({ postId: req.params.postId })
    .populate('userId', 'name avatar primaryDomain communityScore')
    .sort({ isAcceptedAnswer: -1, upvoteCount: -1, createdAt: -1 });

  res.json({ success: true, comments });
});

// POST /api/community/comment/:commentId/upvote — Upvote comment
exports.upvoteComment = asyncHandler(async (req, res) => {
  const comment = await CommunityComment.findById(req.params.commentId);
  if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

  const userId = req.user.id;
  const alreadyUpvoted = comment.upvotes.includes(userId);

  if (alreadyUpvoted) {
    comment.upvotes.pull(userId);
    comment.upvoteCount = Math.max(0, comment.upvoteCount - 1);
  } else {
    comment.upvotes.push(userId);
    comment.upvoteCount += 1;
    // Helpful answer bonus
    if (comment.upvoteCount === 5) {
      await User.findByIdAndUpdate(comment.userId, { $inc: { communityScore: POINTS.HELPFUL_ANSWER } });
    }
  }
  await comment.save();

  res.json({ success: true, upvoted: !alreadyUpvoted, upvoteCount: comment.upvoteCount });
});

// PATCH /api/community/accept-answer/:commentId — Accept answer (post author only)
exports.acceptAnswer = asyncHandler(async (req, res) => {
  const comment = await CommunityComment.findById(req.params.commentId);
  if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

  const post = await CommunityPost.findById(comment.postId);
  if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

  if (post.authorId.toString() !== req.user.id) {
    return res.status(403).json({ success: false, message: 'Only post author can accept answers' });
  }

  if (post.postType !== 'Doubt') {
    return res.status(400).json({ success: false, message: 'Only Doubt posts can have accepted answers' });
  }

  // Unset previous accepted answer
  await CommunityComment.updateMany({ postId: comment.postId }, { isAcceptedAnswer: false });

  comment.isAcceptedAnswer = true;
  await comment.save();

  // Award points
  await User.findByIdAndUpdate(comment.userId, { $inc: { communityScore: POINTS.ACCEPTED_ANSWER } });

  res.json({ success: true, comment });
});

// POST /api/community/report — Report post
exports.reportPost = asyncHandler(async (req, res) => {
  const { postId, reason } = req.body;
  await CommunityPost.findByIdAndUpdate(postId, { reported: true });
  res.json({ success: true, message: 'Post reported. Moderators will review it.' });
});

// DELETE /api/community/:postId — Delete own post
exports.deletePost = asyncHandler(async (req, res) => {
  const post = await CommunityPost.findById(req.params.postId);
  if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

  const isOwner = post.authorId.toString() === req.user.id;
  const isAdmin = ['admin', 'super_admin'].includes(req.user.role);

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  await CommunityComment.deleteMany({ postId: post._id });
  await CommunityPost.findByIdAndDelete(post._id);

  res.json({ success: true, message: 'Post deleted' });
});

// GET /api/community/my-posts — Get own posts
exports.getMyPosts = asyncHandler(async (req, res) => {
  const posts = await CommunityPost.find({ authorId: req.user.id })
    .populate('authorId', 'name avatar primaryDomain communityScore')
    .sort({ createdAt: -1 });

  res.json({ success: true, posts });
});

// GET /api/community/stats — Community stats for dashboard
exports.getCommunityStats = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('communityScore');
  const myPostCount = await CommunityPost.countDocuments({ authorId: req.user.id });
  const totalPosts = await CommunityPost.countDocuments();
  const thisWeekPosts = await CommunityPost.countDocuments({
    createdAt: { $gte: new Date(Date.now() - 7 * 24 * 3600000) }
  });

  res.json({
    success: true,
    stats: {
      communityScore: user.communityScore || 0,
      myPosts: myPostCount,
      totalPosts,
      thisWeekPosts
    }
  });
});
