import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HeartIcon,
  ShoppingCartIcon,
  StarIcon,
  EyeIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartSolidIcon,
  StarIcon as StarSolidIcon,
} from '@heroicons/react/24/solid';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import getImageUrl from '../utils/getImageUrl';

const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);

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
        await fetch(`http://localhost:5000/api/users/wishlist/${product._id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setIsWishlisted(false);
        toast.success('Removed from wishlist');
      } else {
        await fetch('http://localhost:5000/api/users/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ productId: product._id }),
        });
        setIsWishlisted(true);
        toast.success('Added to wishlist');
      }
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarSolidIcon key={i} className="h-3.5 w-3.5 text-amber-400" />);
    }
    if (hasHalfStar) {
      stars.push(<StarSolidIcon key="half" className="h-3.5 w-3.5 text-amber-400" />);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StarIcon key={`empty-${i}`} className="h-3.5 w-3.5 text-gray-200" />);
    }
    return stars;
  };

  const discountPercentage = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const currentPrice = product.discountPrice || product.price;
  const inCart = isInCart(product._id);

  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden transition-shadow duration-[500ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)] border border-gray-100 hover:border-transparent"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient border effect on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-[1] bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-[1px]" />
      <div className="absolute inset-[1px] rounded-2xl bg-white pointer-events-none -z-[1]" />

      <div className="relative">
        {/* Product Image */}
        <Link to={`/product/${product._id}`} className="block">
          <div className="aspect-square w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
            <img
              src={getImageUrl(product.images?.[0]?.url)}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
            />
          </div>
        </Link>

        {/* Hover overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent transition-opacity duration-400 pointer-events-none ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discountPercentage > 0 && (
            <span className="inline-flex items-center bg-gradient-to-r from-rose-500 to-pink-500 text-white px-2.5 py-1 text-[11px] font-bold rounded-lg shadow-lg shadow-rose-500/25 tracking-wide">
              {discountPercentage}% OFF
            </span>
          )}
          {product.isFeatured && (
            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-2.5 py-1 text-[11px] font-bold rounded-lg shadow-lg shadow-amber-400/25 tracking-wide">
              Featured
            </span>
          )}
        </div>

        {/* Quick action buttons with staggered animation */}
        {showQuickActions && (
          <div
            className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${
              isHovered
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-3 pointer-events-none'
            }`}
          >
            <button
              onClick={handleQuickView}
              className="w-10 h-10 min-h-[40px] bg-white/95 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 hover:scale-110 hover:shadow-xl"
              style={{ transitionDelay: isHovered ? '0ms' : '60ms' }}
              title="Quick View"
            >
              <EyeIcon className="h-[18px] w-[18px] text-gray-600" />
            </button>
            <button
              onClick={handleToggleWishlist}
              className="w-10 h-10 min-h-[40px] bg-white/95 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg hover:bg-red-50 transition-all duration-300 hover:scale-110 hover:shadow-xl"
              style={{ transitionDelay: isHovered ? '40ms' : '30ms' }}
              title="Add to Wishlist"
            >
              {isWishlisted ? (
                <HeartSolidIcon className="h-[18px] w-[18px] text-red-500" />
              ) : (
                <HeartIcon className="h-[18px] w-[18px] text-gray-600" />
              )}
            </button>
            <button
              onClick={handleAddToCart}
              disabled={inCart}
              className={`w-10 h-10 min-h-[40px] rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl ${
                inCart
                  ? 'bg-emerald-100 cursor-default'
                  : 'bg-white/95 backdrop-blur-sm hover:bg-blue-50 hover:text-blue-600'
              }`}
              style={{ transitionDelay: isHovered ? '80ms' : '0ms' }}
              title={inCart ? 'In Cart' : 'Add to Cart'}
            >
              {inCart ? (
                <CheckIcon className="h-[18px] w-[18px] text-emerald-600" />
              ) : (
                <ShoppingCartIcon className="h-[18px] w-[18px] text-gray-600" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 sm:p-5">
        {/* Brand */}
        {product.brand && (
          <p className="text-[11px] font-semibold tracking-wider uppercase text-blue-500/80 mb-1.5">
            {product.brand}
          </p>
        )}

        {/* Name */}
        <Link to={`/product/${product._id}`}>
          <h3 className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2 leading-snug hover:text-blue-600 transition-colors duration-200 min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center gap-px">{renderStars(product.ratings?.average || 0)}</div>
          <span className="text-[11px] text-gray-400 font-medium">
            ({product.ratings?.count || 0})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900">{formatPrice(currentPrice)}</span>
          {product.discountPrice && (
            <span className="text-sm text-gray-400 line-through font-medium">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Stock + Add to Cart */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-md ${
              product.stock > 0
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-red-50 text-red-500'
            }`}
          >
            {product.stock > 0 ? `In Stock` : 'Out of Stock'}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={inCart || product.stock === 0}
            className={`inline-flex items-center gap-1.5 px-4 py-2 min-h-[40px] rounded-xl text-xs font-semibold transition-all duration-300 active:scale-95 ${
              inCart
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-default'
                : product.stock === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 hover:from-blue-500 hover:to-purple-500'
            }`}
          >
            {inCart ? (
              <>
                <CheckIcon className="h-3.5 w-3.5" />
                In Cart
              </>
            ) : product.stock === 0 ? (
              'Out of Stock'
            ) : (
              <>
                <ShoppingCartIcon className="h-3.5 w-3.5" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* Skeleton loading state */
export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
    <div className="aspect-square w-full bg-gray-100" />
    <div className="p-5 space-y-3">
      <div className="h-3 w-16 bg-gray-200 rounded" />
      <div className="h-4 w-3/4 bg-gray-200 rounded" />
      <div className="h-4 w-1/2 bg-gray-200 rounded" />
      <div className="flex items-center gap-1.5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-3.5 w-3.5 bg-gray-200 rounded-sm" />
        ))}
        <div className="h-3 w-8 bg-gray-200 rounded ml-1" />
      </div>
      <div className="flex items-center justify-between pt-1">
        <div className="h-5 w-24 bg-gray-200 rounded" />
        <div className="h-9 w-28 bg-gray-200 rounded-xl" />
      </div>
    </div>
  </div>
);

export default ProductCard;
