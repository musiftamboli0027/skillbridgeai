const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: 120
  },
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  companyLogo: {
    type: String,
    default: ''
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobType: {
    type: String,
    enum: ['Internship', 'Full-Time', 'Part-Time', 'Remote', 'Contract'],
    required: true
  },
  requiredDomains: [{
    type: String,
    trim: true
  }],
  requiredSkills: [{
    type: String,
    trim: true
  }],
  experienceLevel: {
    type: String,
    enum: ['1st Year', '2nd Year', '3rd Year', 'Final Year', 'Any'],
    default: 'Any'
  },
  stipendOrSalary: {
    type: String,
    trim: true,
    default: 'Not Disclosed'
  },
  location: {
    type: String,
    trim: true,
    default: 'Remote'
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    maxlength: 5000
  },
  responsibilities: {
    type: String,
    maxlength: 3000
  },
  applicationDeadline: {
    type: Date,
    required: true
  },
  visibility: {
    type: String,
    enum: ['Public', 'StudentsOnly'],
    default: 'Public'
  },
  status: {
    type: String,
    enum: ['Active', 'Closed', 'Expired'],
    default: 'Active'
  },
  applicantCount: {
    type: Number,
    default: 0
  },
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College'
  }
}, {
  timestamps: true
});

// Index for efficient querying
jobSchema.index({ status: 1, applicationDeadline: 1 });
jobSchema.index({ postedBy: 1 });
jobSchema.index({ requiredDomains: 1 });

module.exports = mongoose.model('Job', jobSchema);
