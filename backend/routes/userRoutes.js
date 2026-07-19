const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  register,
  login,
  getMe,
  updateProfile,
  addAddress,
  getAddresses,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  getUsers,
  deleteUser,
  createUser
} = require('../controllers/userController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.get('/', protect, authorize('admin'), getUsers);
router.post('/', protect, authorize('admin'), createUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);
router.post('/address', protect, addAddress);
router.get('/address', protect, getAddresses);
router.post('/wishlist', protect, addToWishlist);
router.delete('/wishlist/:productId', protect, removeFromWishlist);
router.get('/wishlist', protect, getWishlist);

module.exports = router;
