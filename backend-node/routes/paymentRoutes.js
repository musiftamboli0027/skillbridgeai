const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const paymentController = require('../controllers/paymentController');

// Webhook is public (verified via signature)
router.post('/webhook', paymentController.handleWebhook);

router.use(protect);

// Student routes
router.post('/create-order', authorize('student'), paymentController.createPaymentOrder);
router.post('/free-enroll', authorize('student'), paymentController.freeEnroll);
router.post('/verify', authorize('student'), paymentController.verifyPaymentAndEnroll);
router.get('/my', authorize('student'), paymentController.getMyPayments);

// Admin routes
router.get('/', authorize('admin'), paymentController.getAllPayments);
router.post('/manual', authorize('admin'), paymentController.recordManualPayment);
router.get('/analytics', authorize('admin'), paymentController.getPaymentAnalytics);

// Invoices
router.get('/invoices', paymentController.getInvoices);

module.exports = router;
