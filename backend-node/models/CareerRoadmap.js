const mongoose = require('mongoose');

const careerRoadmapSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Student input profile
  profile: {
    career: { type: String, required: true },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
    skills: [String],
    hours: { type: String, required: true },
    budget: { type: String, enum: ['Free', 'Low (< ₹5000)', 'Medium (₹5000-15000)', 'High (> ₹15000)'], required: true },
    goal: { type: String, required: true }
  },
  // AI-generated roadmap (stored as structured JSON)
  roadmap: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  // Metadata
  generatedAt: { type: Date, default: Date.now },
  version: { type: Number, default: 1 }
}, {
  timestamps: true
});

careerRoadmapSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('CareerRoadmap', careerRoadmapSchema);
