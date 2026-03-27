const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  createRazorpayOrder,
  verifyPayment,
  processRefund,
  getPaymentDetails,
  getRazorpayKey
} = require('../controllers/paymentController');

const router = express.Router();

router.get('/key', getRazorpayKey);

router.post('/create-order', protect, createRazorpayOrder);
router.post('/verify', protect, verifyPayment);

router.post('/refund', protect, authorize('admin'), processRefund);
router.get('/:paymentId', protect, authorize('admin'), getPaymentDetails);

module.exports = router;
