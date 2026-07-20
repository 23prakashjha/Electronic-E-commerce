import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  HeartIcon,
  ShoppingCartIcon,
  ArrowLeftIcon,
  TrashIcon,
  BoltIcon,
  EyeIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';
import getImageUrl from '../utils/getImageUrl';

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/wishlist', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setWishlistItems(data.wishlist);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/wishlist/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setWishlistItems(wishlistItems.filter((item) => item._id !== productId));
        toast.success('Removed from wishlist');
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    }
  };

  const addToCartFromWishlist = (product) => {
    addToCart(product);
    toast.success('Added to cart!');
  };

  const moveAllToCart = () => {
    wishlistItems.forEach((product) => {
      addToCart(product);
    });
    toast.success(`Added ${wishlistItems.length} items to cart!`);
  };

  const clearWishlist = async () => {
    if (window.confirm('Are you sure you want to clear your wishlist?')) {
      try {
        const promises = wishlistItems.map((item) =>
          fetch(`http://localhost:5000/api/users/wishlist/${item._id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          })
        );

        await Promise.all(promises);
        setWishlistItems([]);
        toast.success('Wishlist cleared');
      } catch (error) {
        console.error('Error clearing wishlist:', error);
        toast.error('Failed to clear wishlist');
      }
    }
  };

  // Not authenticated state
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center bg-white rounded-3xl shadow-xl shadow-gray-200/40 p-10 sm:p-16 border border-gray-100">
            <div className="w-28 h-28 bg-gradient-to-br from-pink-50 to-red-50 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-pink-100/50">
              <HeartIcon className="h-14 w-14 text-pink-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Save your favorites</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
              Create an account to save products you love and access them anytime, anywhere.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/25"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-500 mt-2">Loading your saved items...</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
                <div className="h-56 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-6 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-500 mt-2 flex items-center gap-2">
                <HeartSolidIcon className="h-5 w-5 text-red-500" />
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>

            {wishlistItems.length > 0 && (
              <div className="flex items-center gap-3">
                <button
                  onClick={moveAllToCart}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md shadow-blue-500/20 text-sm"
                >
                  <ShoppingCartIcon className="h-4 w-4" />
                  Add All to Cart
                </button>
                <button
                  onClick={clearWishlist}
                  className="flex items-center gap-2 text-red-500 hover:text-red-700 font-medium px-4 py-2.5 rounded-xl hover:bg-red-50 transition-colors text-sm"
                >
                  <TrashIcon className="h-4 w-4" />
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>

        {wishlistItems.length > 0 ? (
          <>
            {/* Wishlist Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-12">
              {wishlistItems.map((product) => (
                <div key={product._id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden group border border-gray-100 flex flex-col">
                  {/* Image */}
                  <div className="relative">
                    <Link to={`/product/${product._id}`}>
                      <img
                        src={getImageUrl(product.images?.[0]?.url)}
                        alt={product.name}
                        className="w-full h-56 object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromWishlist(product._id)}
                      className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center hover:bg-red-50 transition-colors"
                      title="Remove from Wishlist"
                    >
                      <HeartSolidIcon className="h-5 w-5 text-red-500" />
                    </button>

                    {/* Discount Badge */}
                    {product.discountPrice && (
                      <span className="absolute top-3 left-3 bg-red-500 text-white px-2.5 py-1 text-xs font-bold rounded-lg">
                        -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4 flex flex-col flex-1">
                    <Link to={`/product/${product._id}`}>
                      <h3 className="text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide font-medium">{product.brand}</p>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < Math.floor(product.ratings?.average || 0)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">({product.ratings?.count || 0})</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-gray-900">
                        ₹{(product.discountPrice || product.price).toLocaleString('en-IN')}
                      </span>
                      {product.discountPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    {/* Stock */}
                    <span className={`text-xs font-semibold mb-3 ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                    </span>

                    {/* Actions */}
                    <div className="flex gap-2 mt-auto pt-1">
                      <button
                        onClick={() => addToCartFromWishlist(product)}
                        disabled={product.stock === 0}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                          product.stock === 0
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-sm shadow-blue-500/20'
                        }`}
                      >
                        <ShoppingCartIcon className="h-4 w-4" />
                        Add to Cart
                      </button>
                      <Link
                        to={`/product/${product._id}`}
                        className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all text-gray-500"
                        title="View Details"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Empty Wishlist */
          <div className="text-center bg-white rounded-3xl shadow-xl shadow-gray-200/40 p-10 sm:p-16 border border-gray-100">
            <div className="w-28 h-28 bg-gradient-to-br from-pink-50 to-red-50 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-pink-100/50">
              <HeartIcon className="h-14 w-14 text-pink-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
              Start adding products you love and they&apos;ll appear right here.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Browse Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
