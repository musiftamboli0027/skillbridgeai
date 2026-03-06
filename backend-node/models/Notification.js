const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
        type: String,
        enum: ['course_enrolled', 'lesson_completed', 'achievement', 'system', 'reminder', 'announcement'],
        default: 'system'
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    icon: { type: String, default: 'bell' },   // lucide icon name
    color: { type: String, default: '#00D4FF' },
    link: { type: String },                       // optional deep-link path
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now, index: true }
});

// Auto-expire old notifications after 30 days
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

module.exports = mongoose.model('Notification', notificationSchema);
