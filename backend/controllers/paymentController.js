const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @desc    Create Razorpay order
// @route   POST /api/payment/create-order
// @access  Private
exports.createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order: razorpayOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payment/verify
// @access  Private
exports.verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    } = req.body;

    // Generate signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    // Compare signatures
    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Update order payment status
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.paymentInfo.status = 'paid';
    order.paymentInfo.razorpayOrderId = razorpay_order_id;
    order.paymentInfo.razorpayPaymentId = razorpay_payment_id;
    order.paymentInfo.paidAt = Date.now();

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Process refund
// @route   POST /api/payment/refund
// @access  Private/Admin
exports.processRefund = async (req, res, next) => {
  try {
    const { paymentId, amount } = req.body;

    const refund = await razorpay.refunds.create({
      payment_id: paymentId,
      amount: amount ? amount * 100 : undefined // Amount in paise
    });

    // Update order payment status
    const order = await Order.findOne({ 'paymentInfo.razorpayPaymentId': paymentId });

    if (order) {
      order.paymentInfo.status = 'refunded';
      await order.save();
    }

    res.status(200).json({
      success: true,
      refund
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payment details
// @route   GET /api/payment/:paymentId
// @access  Private/Admin
exports.getPaymentDetails = async (req, res, next) => {
  try {
    const payment = await razorpay.payments.fetch(req.params.paymentId);

    res.status(200).json({
      success: true,
      payment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Razorpay key
// @route   GET /api/payment/key
// @access  Public
exports.getRazorpayKey = (req, res) => {
  res.status(200).json({
    success: true,
    key: process.env.RAZORPAY_KEY_ID
  });
};
