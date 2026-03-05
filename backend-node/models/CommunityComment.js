const mongoose = require('mongoose');

const communityCommentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommunityPost',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    maxlength: 2000
  },
  upvotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  upvoteCount: {
    type: Number,
    default: 0
  },
  isAcceptedAnswer: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

communityCommentSchema.index({ postId: 1, createdAt: -1 });
communityCommentSchema.index({ userId: 1 });

module.exports = mongoose.model('CommunityComment', communityCommentSchema);
