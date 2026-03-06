const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a college name'],
    trim: true
  },
  university: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'University',
    required: [true, 'Please provide a university reference']
  },
  city: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure uniqueness of college name within a university
collegeSchema.index({ name: 1, university: 1 }, { unique: true });

module.exports = mongoose.model('College', collegeSchema);
