const mongoose = require('mongoose');

const communityPostSchema = new mongoose.Schema({
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Post content is required'],
    maxlength: 5000
  },
  images: [String],
  tags: [String],
  domainTag: {
    type: String,
    default: 'General'
  },
  postType: {
    type: String,
    enum: ['Discussion', 'Doubt', 'Project', 'Achievement', 'Opportunity', 'Collaboration'],
    default: 'Discussion'
  },
  githubLink: {
    type: String,
    default: ''
  },
  demoLink: {
    type: String,
    default: ''
  },
  visibility: {
    type: String,
    enum: ['Public', 'Private'],
    default: 'Public'
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  likesCount: {
    type: Number,
    default: 0
  },
  commentsCount: {
    type: Number,
    default: 0
  },
  saves: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  feedScore: {
    type: Number,
    default: 0
  },
  reported: {
    type: Boolean,
    default: false
  },
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College'
  }
}, {
  timestamps: true
});

communityPostSchema.index({ feedScore: -1, createdAt: -1 });
communityPostSchema.index({ domainTag: 1, createdAt: -1 });
communityPostSchema.index({ postType: 1 });
communityPostSchema.index({ authorId: 1 });
communityPostSchema.index({ visibility: 1, createdAt: -1 });
communityPostSchema.index({ tags: 1 });

// Validate githubLink for Project posts
communityPostSchema.pre('validate', function (next) {
  if (this.postType === 'Project' && !this.githubLink) {
    this.invalidate('githubLink', 'GitHub link is required for Project posts');
  }
  next();
});

module.exports = mongoose.model('CommunityPost', communityPostSchema);
