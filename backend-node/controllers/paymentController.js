const Payment = require('../models/Payment');
const Invoice = require('../models/Invoice');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');
const { createOrder, verifyPayment, fetchPayment, calculateInstallments } = require('../utils/razorpay');
const { sendEmail } = require('../utils/email');
const enrollmentService = require('../services/enrollmentService');

// @desc    Create payment order (Razorpay)
// @route   POST /api/payments/create-order
// @access  Private (Student)
exports.createPaymentOrder = async (req, res) => {
    try {
        const { courseId, paymentPlan = 'full', installmentNumber = 1 } = req.body;

        // 1. Find Course by ID or Slug
        let course = await Course.findById(courseId).catch(() => null);

        if (!course) {
            course = await Course.findOne({ slug: courseId });
        }

        if (!course) {
            return res.status(404).json({
                success: false,
                message: `Course not found. If this is a sample course (ID 1, 2, 3), please create a real course in Admin Panel first.`
            });
        }

        const price = course.discountPrice || course.price;
        const installments = calculateInstallments(price, paymentPlan);
        const installment = installments[installmentNumber - 1];

        if (!installment) {
            return res.status(400).json({ success: false, message: 'Invalid installment number' });
        }

        // 2. Handle Free Courses (Skip Razorpay)
        if (installment.amount <= 0) {
            return res.status(200).json({
                success: true,
                isFree: true,
                message: 'This course is free. No payment required.',
                data: {
                    orderId: 'FREE_ORDER_' + Date.now(),
                    amount: 0,
                    key: 'FREE',
                    course: { id: course._id, title: course.title }
                }
            });
        }

        const receipt = `rcpt_${req.user._id.toString().slice(-6)}_${Date.now()}`;

        // 3. Wrap Razorpay Order in its own try/catch for better logging
        try {
            const order = await createOrder(installment.amount, 'INR', receipt, {
                courseId,
                userId: req.user._id.toString(),
                paymentPlan,
                installmentNumber
            });

            res.status(200).json({
                success: true,
                data: {
                    orderId: order.id,
                    amount: order.amount,
                    currency: order.currency,
                    course: { id: course._id, title: course.title, price: course.price },
                    installment,
                    key: process.env.RAZORPAY_KEY_ID
                }
            });
        } catch (rzpErr) {
            console.error('RAZORPAY CONFIG ERROR:', rzpErr);
            return res.status(500).json({
                success: false,
                message: 'Razorpay Order Failed. Check if RAZORPAY_KEY_ID & SECRET are correct in .env',
                error: rzpErr.message
            });
        }
    } catch (err) {
        console.error('Payment Controller Error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Verify payment and complete enrollment
// @route   POST /api/payments/verify
// @access  Private (Student)
exports.verifyPaymentAndEnroll = async (req, res) => {
    try {
        console.log('[RZP VERIFY] Received Body:', JSON.stringify(req.body, null, 2));
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId, paymentPlan, installmentNumber } = req.body;

        const isValid = verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature);

        if (!isValid) {
            console.error('Signature verification failed for order:', razorpay_order_id);
            return res.status(400).json({ success: false, message: 'Payment verification failed: Signature mismatch.' });
        }

        const paymentDetails = await fetchPayment(razorpay_payment_id);

        let course = await Course.findById(courseId).catch(() => null);
        if (!course) {
            course = await Course.findOne({ slug: courseId });
        }

        if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

        const finalCourseId = course._id; // Use real MongoDB ID for storage

        const amount = paymentDetails.amount / 100;

        const enrollmentData = await completeEnrollmentLogic({
            userId: req.user._id,
            courseId,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            signature: razorpay_signature,
            amount,
            method: paymentDetails.method,
            paymentPlan: paymentPlan || 'full',
            installmentNumber: installmentNumber || 1
        });

        res.status(200).json({
            success: true,
            message: 'Payment successful!',
            data: enrollmentData
        });
    } catch (err) {
        console.error('[RZP VERIFY ERROR]:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Handle Razorpay Webhook
// @route   POST /api/payments/webhook
// @access  Public (Signature Verified)
exports.handleWebhook = async (req, res) => {
    try {
        const signature = req.headers['x-razorpay-signature'];
        const { validateWebhookSignature } = require('../utils/razorpay');

        const isValid = validateWebhookSignature(req.body, signature, process.env.RAZORPAY_WEBHOOK_SECRET);

        if (!isValid) {
            return res.status(400).json({ success: false, message: 'Invalid signature' });
        }

        const event = req.body.event;
        const payload = req.body.payload.payment.entity;

        if (event === 'payment.captured') {
            const { userId, courseId, paymentPlan, installmentNumber } = payload.notes;

            // Prevent duplicate enrollment if already done by verify API
            const existingPayment = await Payment.findOne({ razorpayPaymentId: payload.id });
            if (existingPayment) {
                return res.status(200).json({ status: 'already_processed' });
            }

            await completeEnrollmentLogic({
                userId,
                courseId,
                paymentId: payload.id,
                orderId: payload.order_id,
                signature: 'WEBHOOK_VERIFIED',
                amount: payload.amount / 100,
                method: payload.method,
                paymentPlan: paymentPlan || 'full',
                installmentNumber: installmentNumber || 1
            });
        }

        res.status(200).json({ status: 'ok' });
    } catch (err) {
        console.error('[WEBHOOK ERROR]:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// Internal Helper for Enrollment
async function completeEnrollmentLogic({ userId, courseId, paymentId, orderId, signature, amount, method, paymentPlan, installmentNumber }) {
    let course = await Course.findById(courseId).catch(() => null);
    if (!course) {
        course = await Course.findOne({ slug: courseId });
    }
    if (!course) throw new Error('Course not found');

    const payment = await Payment.create({
        student: userId,
        course: course._id,
        amount,
        razorpayOrderId: orderId,
        razorpayPaymentId: paymentId,
        razorpaySignature: signature,
        paymentPlan: paymentPlan || 'full',
        installmentNumber: installmentNumber || 1,
        status: 'captured',
        paymentMethod: method
    });

    // Use Service for Enrollment & Unlocking Logic
    const enrollment = await enrollmentService.enrollStudent(userId, course._id, {
        amount,
        paymentId,
        status: paymentPlan === 'full' ? 'completed' : 'partial'
    });

    await Invoice.create({
        invoiceNumber: `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        student: userId,
        course: course._id,
        payment: payment._id,
        amount,
        totalAmount: amount,
        status: 'paid'
    });

    // Send email (non-blocking)
    const user = await User.findById(userId);
    if (user) {
        sendEmail({
            email: user.email,
            subject: 'Payment Successful',
            html: `<h1>Payment Successful</h1><p>Dear ${user.name}, your payment of ₹${amount} for ${course.title} was successful. Your course is now unlocked!</p>`
        }).catch(err => console.error('Email failed:', err));
    }

    return { payment, enrollment };
}

// @desc    Immediate Enrollment for Free Courses
// @route   POST /api/payments/free-enroll
// @access  Private (Student)
exports.freeEnroll = async (req, res) => {
    try {
        const { courseId } = req.body;
        let course = await Course.findById(courseId).catch(() => null);
        if (!course) {
            course = await Course.findOne({ slug: courseId });
        }

        if (!course) return res.status(404).json({ message: 'Course not found' });

        const price = course.discountPrice || course.price;
        if (price > 0) return res.status(400).json({ message: 'This course is not free' });

        let enrollment = await Enrollment.findOne({ user: req.user._id, course: course._id });
        if (!enrollment) {
            enrollment = await Enrollment.create({
                user: req.user._id,
                course: course._id,
                paymentStatus: 'completed',
                paymentPlan: 'full'
            });

            // Update user enrolledCourses
            await User.findByIdAndUpdate(req.user._id, {
                $push: {
                    enrolledCourses: {
                        course: course._id,
                        enrolledAt: new Date()
                    }
                }
            });
        }

        res.status(200).json({ success: true, message: 'Enrolled successfully!', data: enrollment });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get my payments
exports.getMyPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ student: req.user._id })
            .populate('course', 'title thumbnail')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: payments });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get all payments (Admin)
exports.getAllPayments = async (req, res) => {
    try {
        const { status, course, page = 1, limit = 20 } = req.query;
        const query = {};
        if (status) query.status = status;
        if (course) query.course = course;

        const total = await Payment.countDocuments(query);
        const payments = await Payment.find(query)
            .populate('student', 'name email phone')
            .populate('course', 'title')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.status(200).json({ success: true, total, data: payments });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Record manual payment (Admin)
exports.recordManualPayment = async (req, res) => {
    try {
        const { studentId, courseId, amount, method, reference, paymentPlan } = req.body;

        const payment = await Payment.create({
            student: studentId,
            course: courseId,
            amount,
            paymentMethod: method || 'cash',
            status: 'captured',
            paymentPlan: paymentPlan || 'full',
            manualEntry: true,
            manualReference: reference,
            processedBy: req.user._id
        });

        let enrollment = await Enrollment.findOne({ user: studentId, course: courseId });
        if (!enrollment) {
            enrollment = await Enrollment.create({
                user: studentId,
                course: courseId,
                paymentStatus: paymentPlan === 'full' ? 'completed' : 'partial',
                paymentPlan: paymentPlan || 'full',
                amount: amount,
                status: 'active'
            });

            // Update user enrolledCourses for consistency
            await User.findByIdAndUpdate(studentId, {
                $push: {
                    enrolledCourses: {
                        course: courseId,
                        enrolledAt: new Date(),
                        progress: 0
                    }
                }
            });
        }

        res.status(201).json({ success: true, data: payment });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get invoices
exports.getInvoices = async (req, res) => {
    try {
        const query = req.user.role === 'student' ? { student: req.user._id } : {};
        const invoices = await Invoice.find(query)
            .populate('student', 'name email')
            .populate('course', 'title')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: invoices });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get payment analytics
exports.getPaymentAnalytics = async (req, res) => {
    try {
        const totalRevenue = await Payment.aggregate([
            { $match: { status: 'captured' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const thisMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const thisMonthRevenue = await Payment.aggregate([
            { $match: { status: 'captured', createdAt: { $gte: thisMonth } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalRevenue: totalRevenue[0]?.total || 0,
                thisMonthRevenue: thisMonthRevenue[0]?.total || 0
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
