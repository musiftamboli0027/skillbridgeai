const mongoose = require('mongoose');

const careerPathSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  programmingLanguages: [{
    type: String
  }],
  tools: [{
    type: String
  }],
  certifications: [{
    type: String
  }],
  miniProjects: [{
    title: String,
    description: String,
    techStack: [String]
  }],
  internshipSuggestions: [{
    company: String,
    role: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College'
  },
  isGlobal: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

careerPathSchema.index({ collegeId: 1, isActive: 1 });
careerPathSchema.index({ isGlobal: 1 });

module.exports = mongoose.model('CareerPath', careerPathSchema);
