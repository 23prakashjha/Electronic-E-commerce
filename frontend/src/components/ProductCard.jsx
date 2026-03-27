import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartIcon, 
  ShoppingCartIcon,
  StarIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product, showQuickActions = true }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart, isInCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success('Added to cart!');
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // This would open a quick view modal
    console.log('Quick view:', product._id);
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      return;
    }

    try {
      if (isWishlisted) {
        // Remove from wishlist
        await fetch(`http://localhost:5000/api/users/wishlist/${product._id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setIsWishlisted(false);
        toast.success('Removed from wishlist');
      } else {
        // Add to wishlist
        await fetch('http://localhost:5000/api/users/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ productId: product._id })
        });
        setIsWishlisted(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarSolidIcon key={i} className="h-4 w-4 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<StarSolidIcon key="half" className="h-4 w-4 text-yellow-400" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StarIcon key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }

    return stars;
  };

  const discountPercentage = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const currentPrice = product.discountPrice || product.price;

  return (
    <div
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 border border-gray-100 hover:border-transparent"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Product Image */}
        <Link to={`/product/${product._id}`}>
          <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
            <img
              src={product.images?.[0]?.url || '/placeholder-product.jpg'}
              alt={product.name}
              className="w-full h-72 object-cover object-center group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        </Link>

        {/* Gradient Overlay on Hover */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}></div>

        {/* Badges */}
        <div className="absolute top-4 left-4 space-y-2">
          {discountPercentage > 0 && (
            <span className="inline-block bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 text-xs font-bold rounded-full shadow-lg animate-bounce">
              -{discountPercentage}% OFF
            </span>
          )}
          {product.isFeatured && (
            <span className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1.5 text-xs font-bold rounded-full shadow-lg">
              ⭐ Featured
            </span>
          )}
        </div>

        {/* Quick Actions */}
        {showQuickActions && (
          <div className={`absolute top-4 right-4 space-y-2 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
          }`}>
            <button
              onClick={handleQuickView}
              className="block w-10 h-10 bg-white/90 backdrop-blur-xl rounded-full hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
              title="Quick View"
            >
              <EyeIcon className="h-5 w-5 text-gray-700 mx-auto" />
            </button>
            <button
              onClick={handleToggleWishlist}
              className="block w-10 h-10 bg-white/90 backdrop-blur-xl rounded-full hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
              title="Add to Wishlist"
            >
              {isWishlisted ? (
                <HeartSolidIcon className="h-5 w-5 text-red-500 mx-auto" />
              ) : (
                <HeartIcon className="h-5 w-5 text-gray-700 mx-auto" />
              )}
            </button>
            <button
              onClick={handleAddToCart}
              disabled={isInCart(product._id)}
              className={`block w-10 h-10 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110 ${
                isInCart(product._id)
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-white/90 backdrop-blur-xl hover:bg-white'
              }`}
              title={isInCart(product._id) ? 'In Cart' : 'Add to Cart'}
            >
              <ShoppingCartIcon className={`h-5 w-5 mx-auto ${
                isInCart(product._id) ? 'text-gray-500' : 'text-gray-700'
              }`} />
            </button>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-6">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 hover:text-blue-600 transition-colors duration-300 leading-tight">
            {product.name}
          </h3>
        </Link>

        {/* Brand */}
        <p className="text-sm text-gray-500 mb-3 font-medium">{product.brand}</p>

        {/* Rating */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="flex items-center">
            {renderStars(product.ratings?.average || 0)}
          </div>
          <span className="text-sm text-gray-600 font-medium">
            ({product.ratings?.count || 0} reviews)
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ₹{currentPrice.toLocaleString('en-IN')}
            </span>
            {product.discountPrice && (
              <span className="text-lg text-gray-500 line-through font-medium">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>

        {/* Stock Status & Add to Cart */}
        <div className="flex items-center justify-between">
          <span className={`text-sm font-bold px-3 py-1 rounded-full ${
            product.stock > 0 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={isInCart(product._id) || product.stock === 0}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 ${
              isInCart(product._id)
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : product.stock === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {isInCart(product._id) ? '✓ In Cart' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
