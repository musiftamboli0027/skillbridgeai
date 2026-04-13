const mongoose = require('mongoose');

const InterviewSessionSchema = new mongoose.Schema(
  {
    role: { type: String, required: true, trim: true },
    level: { type: String, required: true, trim: true },
    topics: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["created", "in_progress", "completed"],
      default: "created"
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // required: true // Not strictly required if we just wanna mirror exactly, but good for Skillbridge2
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('InterviewSession', InterviewSessionSchema);
