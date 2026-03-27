import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartIcon,
  ShoppingCartIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

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
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
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
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        setWishlistItems(wishlistItems.filter(item => item._id !== productId));
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
    wishlistItems.forEach(product => {
      addToCart(product);
    });
    toast.success(`Added ${wishlistItems.length} items to cart!`);
  };

  const clearWishlist = async () => {
    if (window.confirm('Are you sure you want to clear your wishlist?')) {
      try {
        // Remove all items from wishlist
        const promises = wishlistItems.map(item => 
          fetch(`http://localhost:5000/api/users/wishlist/${item._id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center bg-white rounded-lg shadow-md p-12">
            <HeartIcon className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
            <p className="text-gray-600 mb-8">
              You need to be logged in to view your wishlist
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-600 mt-2">Loading your saved items...</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md animate-pulse">
                <div className="h-64 bg-gray-200 rounded-t-lg"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-600 mt-2">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
            
            {wishlistItems.length > 0 && (
              <div className="flex space-x-3">
                <button
                  onClick={moveAllToCart}
                  className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                  <span>Add All to Cart</span>
                </button>
                <button
                  onClick={clearWishlist}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>

        {wishlistItems.length > 0 ? (
          <>
            {/* Wishlist Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {wishlistItems.map((product) => (
                <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden group">
                  <div className="relative">
                    <Link to={`/product/${product._id}`}>
                      <img
                        src={product.images?.[0]?.url || '/placeholder-product.jpg'}
                        alt={product.name}
                        className="w-full h-64 object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    
                    {/* Quick Actions */}
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <button
                        onClick={() => removeFromWishlist(product._id)}
                        className="bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition-colors"
                        title="Remove from Wishlist"
                      >
                        <HeartSolidIcon className="h-5 w-5 text-red-500" />
                      </button>
                    </div>

                    {/* Badge */}
                    {product.discountPrice && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
                        -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                      </span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <Link to={`/product/${product._id}`}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary-600 transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="text-sm text-gray-500 mb-2">{product.brand}</p>

                    {/* Rating */}
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.ratings?.average || 0)
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.95 2.001l1.07 3.292c.3.921-.603.921-1.602 0-1.902l-1.07-3.292a1 1 0 00-.95-.69H9.95a1 1 0 00-.95.69l-1.07 3.292c-.3.921-1.603-.921-1.902 0z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        ({product.ratings?.count || 0})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-primary-600">
                          ₹{(product.discountPrice || product.price).toLocaleString('en-IN')}
                        </span>
                        {product.discountPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stock Status */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-sm font-medium ${
                        product.stock > 0 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => addToCartFromWishlist(product)}
                        disabled={product.stock === 0}
                        className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
                          product.stock === 0
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-primary-600 text-white hover:bg-primary-700'
                        }`}
                      >
                        <ShoppingCartIcon className="h-4 w-4 inline mr-1" />
                        Add to Cart
                      </button>
                      <Link
                        to={`/product/${product._id}`}
                        className="flex-1 text-center py-2 px-3 border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recommended Products */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* This would be populated with recommended products */}
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                    <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Empty Wishlist */
          <div className="text-center bg-white rounded-lg shadow-md p-12">
            <HeartIcon className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8">
              Start adding products you love to see them here
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Continue Shopping
            </Link>
          </div>
        )}
      </div>

    </div>
  );
};

export default WishlistPage;
