const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    module: {
        type: mongoose.Schema.Types.ObjectId,
        required: true // We need to know which module this belongs to for unlocking
    },
    lesson: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    assignmentType: {
        type: String,
        enum: ['quiz', 'coding', 'project'],
        required: true
    },
    // For Quizzes
    quizAnswers: [{
        questionId: String,
        selectedOption: Number,
        isCorrect: Boolean
    }],
    // For Coding
    code: {
        type: String,
        default: ''
    },
    language: {
        type: String,
        default: 'javascript'
    },
    testResults: [{
        testCaseId: String,
        input: String,
        expectedOutput: String,
        actualOutput: String,
        passed: Boolean,
        error: String
    }],
    // For Projects
    githubRepo: {
        type: String
    },
    deployedUrl: {
        type: String
    },
    // General Result
    status: {
        type: String,
        enum: ['pending', 'submitted', 'graded', 'passed', 'failed'],
        default: 'pending'
    },
    score: {
        type: Number,
        default: 0
    },
    feedback: {
        type: String
    },
    attempt: {
        type: Number,
        default: 1
    }
}, {
    timestamps: true
});

// Prevent duplicate submissions for the same attempt? 
// Actually we want history, so we don't unique constrain user+lesson.
// But we might want to quickly find the *latest* submission.

submissionSchema.index({ user: 1, lesson: 1, createdAt: -1 });

module.exports = mongoose.model('Submission', submissionSchema);
