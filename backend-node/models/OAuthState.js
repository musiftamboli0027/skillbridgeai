const mongoose = require('mongoose');

const oAuthStateSchema = new mongoose.Schema({
    state: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 } // Document will be automatically deleted at expiresAt
    }
}, { timestamps: true });

module.exports = mongoose.model('OAuthState', oAuthStateSchema);
