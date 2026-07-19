import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MinusIcon,
  PlusIcon,
  TrashIcon,
  ShoppingCartIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  TruckIcon,
  GiftIcon,
  ShoppingBagIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

const FREE_SHIPPING_THRESHOLD = 500;

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
    clearCart,
  } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

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

  const freeShippingProgress = Math.min((totalAmount / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const amountForFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - totalAmount, 0);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center bg-white rounded-3xl shadow-xl shadow-gray-200/40 p-10 sm:p-16 border border-gray-100">
            <div className="w-28 h-28 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-blue-100/50">
              <ShoppingCartIcon className="h-14 w-14 text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
              Looks like you haven&apos;t added any products yet. Browse our collection and find something you love.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-500 mt-2 flex items-center gap-2">
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">{totalItems}</span>
            {totalItems === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="flex-1 space-y-4">
            {cartItems.map((item) => (
              <div key={item.product} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 p-4 sm:p-6 border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Image */}
                  <Link to={`/product/${item.product}`} className="shrink-0">
                    <img
                      src={item.image || '/placeholder-product.jpg'}
                      alt={item.name}
                      className="w-full sm:w-28 h-48 sm:h-28 object-cover rounded-xl hover:opacity-90 transition-opacity"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <Link to={`/product/${item.product}`}>
                          <h3 className="text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1">
                            {item.name}
                          </h3>
                        </Link>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                          ₹{item.price.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-gray-900 shrink-0 hidden sm:block">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4 gap-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200">
                        <button
                          onClick={() => handleQuantityChange(item.product, item.quantity - 1)}
                          className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-l-xl transition-colors"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <span className="w-12 text-center font-bold text-gray-900 text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.product, item.quantity + 1)}
                          className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-r-xl transition-colors"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <p className="text-lg font-bold text-gray-900 sm:hidden">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </p>
                        <button
                          onClick={() => handleRemoveItem(item.product)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-xl transition-colors"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
              <button
                onClick={handleClearCart}
                className="text-red-500 hover:text-red-700 font-medium flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-red-50 transition-colors text-sm"
              >
                <TrashIcon className="h-4 w-4" />
                Clear Cart
              </button>
              <Link
                to="/products"
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 text-sm"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary - Sticky on desktop, sticky bottom on mobile */}
          <div className="w-full lg:w-96 shrink-0">
            <div className="lg:sticky lg:top-24">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Gradient accent */}
                <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

                <div className="p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h2>

                  {/* Free Shipping Progress */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-5 border border-blue-100/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                        <TruckIcon className="h-4 w-4 text-blue-600" />
                        Free Shipping
                      </span>
                      {amountForFreeShipping > 0 ? (
                        <span className="text-sm font-bold text-blue-600">₹{amountForFreeShipping.toLocaleString('en-IN')} away</span>
                      ) : (
                        <span className="text-sm font-bold text-green-600 flex items-center gap-1">
                          <CheckBadgeIcon className="h-4 w-4" /> Unlocked!
                        </span>
                      )}
                    </div>
                    <div className="w-full bg-blue-100 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${freeShippingProgress}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-3 mb-5">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal ({totalItems} items)</span>
                      <span className="font-semibold text-gray-900">₹{totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-1.5">
                        <TruckIcon className="h-4 w-4" /> Shipping
                      </span>
                      <span className="font-semibold">
                        {shipping === 0 ? (
                          <span className="text-green-600">FREE</span>
                        ) : (
                          <span className="text-gray-900">₹{shipping.toLocaleString('en-IN')}</span>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-1.5">
                        <ShieldCheckIcon className="h-4 w-4" /> Tax (18% GST)
                      </span>
                      <span className="font-semibold text-gray-900">₹{tax.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="border-t border-gray-100 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">Total</span>
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          ₹{grandTotal.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    Proceed to Checkout
                    <ArrowRightIcon className="h-5 w-5" />
                  </button>

                  <div className="mt-5 space-y-2.5">
                    {[
                      { icon: ShieldCheckIcon, text: 'Secure checkout', color: 'text-green-500' },
                      { icon: TruckIcon, text: 'Easy returns within 30 days', color: 'text-purple-500' },
                      { icon: GiftIcon, text: 'Free shipping above ₹500', color: 'text-blue-500' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-sm text-gray-500">
                        <item.icon className={`h-4 w-4 ${item.color} shrink-0`} />
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sticky Checkout Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-40 safe-area-bottom">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-xl font-bold text-gray-900">₹{grandTotal.toLocaleString('en-IN')}</p>
            </div>
            <button
              onClick={handleCheckout}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/25 flex items-center gap-2"
            >
              Checkout
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
