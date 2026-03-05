const mongoose = require('mongoose');

const aptitudeTestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  questions: [{
    question: String,
    options: [String],
    correctAnswer: Number, // Index of option
    explanation: String,
    category: { type: String, enum: ['Quantitative', 'Logical', 'Verbal', 'Technical'] }
  }],
  duration: {
    type: Number, // in minutes
    required: true
  },
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College'
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  }
}, {
  timestamps: true
});

aptitudeTestSchema.index({ collegeId: 1, createdAt: -1 });

module.exports = mongoose.model('AptitudeTest', aptitudeTestSchema);
