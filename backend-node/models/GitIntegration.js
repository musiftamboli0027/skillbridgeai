const mongoose = require('mongoose');

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
        type: String
    },
    accessToken: {
        type: String,
        required: true
    },
    connectedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('GitIntegration', gitIntegrationSchema);
