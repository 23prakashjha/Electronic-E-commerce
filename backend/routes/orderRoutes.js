const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  createOrder,
  getMyOrders,
  getOrder,
  getOrders,
  updateOrderStatus,
  cancelOrder,
  getOrderStats
} = require('../controllers/orderController');

const router = express.Router();

router.route('/')
  .get(protect, authorize('admin'), getOrders);

router.route('/my-orders')
  .get(protect, getMyOrders);

router.route('/stats')
  .get(protect, authorize('admin'), getOrderStats);

router.route('/:id')
  .get(protect, getOrder);

router.route('/:id/status')
  .put(protect, authorize('admin'), updateOrderStatus);

router.route('/:id/cancel')
  .put(protect, cancelOrder);

router.post('/', protect, createOrder);

module.exports = router;
