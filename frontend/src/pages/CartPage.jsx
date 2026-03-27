import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MinusIcon, 
  PlusIcon, 
  TrashIcon,
  ShoppingCartIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  TruckIcon
} from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

const CartPage = () => {
  const {
    cartItems,
    totalItems,
    totalAmount,
    shipping,
    tax,
    grandTotal,
    removeFromCart,
    updateQuantity,
    clearCart
  } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      toast.success('Item removed from cart');
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
    toast.success('Item removed from cart');
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to proceed with checkout');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
      toast.success('Cart cleared');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-gray-100">
            <div className="w-28 h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCartIcon className="h-14 w-14 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any products to your cart yet. Start shopping to fill it up!
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2 flex items-center gap-2">
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">{totalItems}</span>
            {totalItems === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.product} className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
                <div className="flex items-center space-x-6">
                  <Link to={`/product/${item.product}`}>
                    <img
                      src={item.image || '/placeholder-product.jpg'}
                      alt={item.name}
                      className="w-28 h-28 object-cover rounded-2xl hover:scale-110 transition-transform duration-300"
                    />
                  </Link>

                  <div className="flex-1">
                    <Link to={`/product/${item.product}`}>
                      <h3 className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors mb-2">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-gray-600 mb-4 font-semibold text-xl">
                      ₹{item.price.toLocaleString('en-IN')}
                    </p>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center bg-gray-50 rounded-xl">
                        <button
                          onClick={() => handleQuantityChange(item.product, item.quantity - 1)}
                          className="p-2 hover:bg-gray-200 rounded-l-xl transition-colors"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <span className="px-4 py-2 text-center w-14 font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.product, item.quantity + 1)}
                          className="p-2 hover:bg-gray-200 rounded-r-xl transition-colors"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.product)}
                        className="text-red-500 hover:text-red-700 flex items-center space-x-1 bg-red-50 px-4 py-2 rounded-xl hover:bg-red-100 transition-colors"
                      >
                        <TrashIcon className="h-4 w-4" />
                        <span className="text-sm font-medium">Remove</span>
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center mt-6">
              <button
                onClick={handleClearCart}
                className="text-red-500 hover:text-red-700 font-medium flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-red-50 transition-colors"
              >
                <TrashIcon className="h-5 w-5" />
                Clear Cart
              </button>
              <Link
                to="/products"
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 sticky top-24 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></span>
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-semibold">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-2">
                    <TruckIcon className="h-5 w-5" /> Shipping
                  </span>
                  <span className="font-semibold">
                    {shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString('en-IN')}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-2">
                    <ShieldCheckIcon className="h-5 w-5" /> Tax (18% GST)
                  </span>
                  <span className="font-semibold">₹{tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-2xl">₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {totalAmount < 1000 && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <p className="text-sm text-blue-700 flex items-center gap-2">
                    <TruckIcon className="h-5 w-5" />
                    Add ₹{(1000 - totalAmount).toLocaleString('en-IN')} more for FREE shipping!
                  </p>
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                {loading ? 'Processing...' : 'Proceed to Checkout'}
                <ArrowRightIcon className="h-5 w-5" />
              </button>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <ShieldCheckIcon className="h-5 w-5 text-green-500" />
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <TruckIcon className="h-5 w-5 text-purple-500" />
                  <span>Easy returns within 30 days</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <TruckIcon className="h-5 w-5 text-blue-500" />
                  <span>Free shipping on orders above ₹500</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-1 h-8 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></span>
            You might also like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-4 animate-pulse">
                <div className="h-40 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl mb-4"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-5 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
