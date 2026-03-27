const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getTrendingProducts,
  getBestSellerProducts,
  addProductReview,
  getProductReviews
} = require('../controllers/productController');

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, authorize('admin'), createProduct);

router.route('/featured')
  .get(getFeaturedProducts);

router.route('/trending')
  .get(getTrendingProducts);

router.route('/best-sellers')
  .get(getBestSellerProducts);

router.route('/:id')
  .get(getProduct)
  .put(protect, authorize('admin'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

router.route('/:id/reviews')
  .post(protect, addProductReview)
  .get(getProductReviews);

module.exports = router;
