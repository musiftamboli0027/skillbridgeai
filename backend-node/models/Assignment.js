const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    module: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['quiz', 'coding'],
        required: true
    },
    // Quiz Fields
    questions: [{
        question: String,
        options: [String],
        correctAnswer: Number,
        explanation: String
    }],
    // Coding Fields
    problemStatement: String,
    constraints: String,
    examples: [{
        input: String,
        output: String,
        explanation: String
    }],
    testCases: [{
        input: String,
        expectedOutput: String,
        isHidden: { type: Boolean, default: false }
    }],
    starterCode: {
        type: Map,
        of: String, // 'python' -> 'def solution():...', 'javascript' -> 'function solution()...'
        default: {}
    },
    passingScore: {
        type: Number,
        default: 70
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Assignment', assignmentSchema);
