const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    paymentPlan: {
        type: String,
        enum: ['full', 'split', 'installment', 'subscription'],
        default: 'full',
    },
    installmentNumber: {
        type: Number,
        default: 1,
    },
    status: {
        type: String,
        enum: ['created', 'captured', 'failed', 'refunded'],
        default: 'created',
    },
    paymentMethod: String,
    manualEntry: {
        type: Boolean,
        default: false,
    },
    manualReference: String,
    processedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    notes: String,
}, {
    timestamps: true,
});

module.exports = mongoose.model('Payment', paymentSchema);
