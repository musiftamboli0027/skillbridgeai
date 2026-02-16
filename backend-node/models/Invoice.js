const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
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
    payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    invoiceNumber: {
        type: String,
        unique: true,
        sparse: true
    },
    status: {
        type: String,
        enum: ['draft', 'paid', 'void', 'uncollectible'],
        default: 'paid',
    },
    billingDetails: {
        name: String,
        email: String,
        address: String,
    },
    invoiceUrl: String,
}, {
    timestamps: true,
});

module.exports = mongoose.model('Invoice', invoiceSchema);
