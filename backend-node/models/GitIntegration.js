const mongoose = require('mongoose');

const commitEntrySchema = new mongoose.Schema({
    sha: { type: String, default: '' },
    message: { type: String, default: '' },
    file: { type: String, default: '' },
    date: { type: Date, default: Date.now }
}, { _id: false });

const gitIntegrationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    provider: {
        type: String,
        default: 'github'
    },
    githubUsername: {
        type: String,
        required: true
    },
    githubId: {
        type: String,
        required: true
    },
    avatarUrl: {
        type: String,
        default: ''
    },
    accessToken: {
        type: String,
        required: true,
        select: false  // Never returned in queries by default
    },
    connectedAt: {
        type: Date,
        default: Date.now
    },
    // ── Commit tracking ──
    totalCommits: {
        type: Number,
        default: 0
    },
    lastCommitAt: {
        type: Date
    },
    commitHistory: {
        type: [commitEntrySchema],
        default: []
    }
}, { timestamps: true });


module.exports = mongoose.model('GitIntegration', gitIntegrationSchema);

