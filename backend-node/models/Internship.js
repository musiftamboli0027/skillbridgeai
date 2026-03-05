const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College'
  },
  applicants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { 
      type: String, 
      enum: ['applied', 'shortlisted', 'rejected', 'hired'], 
      default: 'applied' 
    },
    appliedAt: { type: Date, default: Date.now }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Could be an HR/College Admin
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

internshipSchema.index({ collegeId: 1, isActive: 1 });

module.exports = mongoose.model('Internship', internshipSchema);
