const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (amount, currency, receipt, notes) => {
    const options = {
        amount: amount * 100, // razorpay expects amount in paise
        currency: currency,
        receipt: receipt,
        notes: notes,
    };

    return await razorpay.orders.create(options);
};

const verifyPayment = (orderId, paymentId, signature) => {
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    return expectedSignature === signature;
};

const fetchPayment = async (paymentId) => {
    return await razorpay.payments.fetch(paymentId);
};

const calculateInstallments = (totalAmount, plan) => {
    if (plan === 'full') {
        return [{ number: 1, amount: totalAmount, dueDate: new Date() }];
    }

    // Example for 2 installments
    if (plan === 'split') {
        const half = totalAmount / 2;
        return [
            { number: 1, amount: half, dueDate: new Date() },
            { number: 2, amount: half, dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
        ];
    }

    return [{ number: 1, amount: totalAmount, dueDate: new Date() }];
};

const validateWebhookSignature = (body, signature, secret) => {
    const expectedSignature = crypto
        .createHmac('sha256', secret || process.env.RAZORPAY_WEBHOOK_SECRET)
        .update(JSON.stringify(body))
        .digest('hex');

    return expectedSignature === signature;
};

module.exports = {
    createOrder,
    verifyPayment,
    fetchPayment,
    calculateInstallments,
    validateWebhookSignature
};
