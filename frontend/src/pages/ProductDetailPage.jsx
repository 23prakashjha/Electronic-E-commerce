import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  StarIcon,
  ShoppingCartIcon,
  HeartIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  MinusIcon,
  PlusIcon,
  ShareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  ChevronRightIcon as ChevronRightSmall,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [showStickyBar, setShowStickyBar] = useState(false);
  const ctaRef = useRef(null);
  const thumbContainerRef = useRef(null);
  const { addToCart, isInCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!ctaRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(ctaRef.current);
    return () => observer.disconnect();
  }, [loading, product]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/products/${id}`);
      const data = await response.json();
      if (data.success) {
        setProduct(data.product);
        setRelatedProducts(data.relatedProducts || []);
        setSelectedImage(0);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product && product.stock > 0) {
      addToCart(product, quantity);
      toast.success(`Added ${quantity} item(s) to cart!`);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      return;
    }
    try {
      if (isWishlisted) {
        await fetch(`http://localhost:5000/api/users/wishlist/${product._id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, text: product.description, url: window.location.href });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const full = Math.floor(rating);
    const half = rating % 1 !== 0;
    for (let i = 0; i < full; i++) stars.push(<StarSolidIcon key={i} className="h-5 w-5 text-yellow-400" />);
    if (half) stars.push(<StarSolidIcon key="h" className="h-5 w-5 text-yellow-400" />);
    const empty = 5 - Math.ceil(rating);
    for (let i = 0; i < empty; i++) stars.push(<StarIcon key={`e${i}`} className="h-5 w-5 text-gray-300" />);
    return stars;
  };

  const discountPercentage = product?.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const currentPrice = product?.discountPrice || product?.price;

  const nextImage = () => setSelectedImage((p) => (p + 1) % (product.images?.length || 1));
  const prevImage = () => setSelectedImage((p) => (p - 1 + (product.images?.length || 1)) % (product.images?.length || 1));

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
  };

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'specifications', label: 'Specifications' },
    { id: 'reviews', label: `Reviews (${product?.reviews?.length || 0})` },
  ];

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-64 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="aspect-square bg-gray-200 rounded-2xl" />
                <div className="flex gap-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-20 h-20 bg-gray-200 rounded-xl flex-shrink-0" />
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-5 bg-gray-200 rounded w-24" />
                <div className="h-10 bg-gray-200 rounded w-3/4" />
                <div className="h-5 bg-gray-200 rounded w-48" />
                <div className="h-12 bg-gray-200 rounded w-36" />
                <div className="h-20 bg-gray-200 rounded" />
                <div className="flex gap-4">
                  <div className="h-14 bg-gray-200 rounded-2xl flex-1" />
                  <div className="h-14 bg-gray-200 rounded-2xl w-14" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not found
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center bg-white rounded-2xl shadow-sm border border-gray-200 p-12 max-w-md w-full">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6">
            <ShoppingCartIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-500 mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold text-sm hover:bg-gray-800 transition-colors"
          >
            <ChevronLeftIcon className="h-4 w-4" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-500 mb-8 overflow-x-auto">
          <Link to="/" className="hover:text-gray-900 transition-colors whitespace-nowrap">Home</Link>
          <ChevronRightSmall className="h-3.5 w-3.5 mx-1.5 text-gray-400 flex-shrink-0" />
          <Link to="/products" className="hover:text-gray-900 transition-colors whitespace-nowrap">Products</Link>
          {product.brand && (
            <>
              <ChevronRightSmall className="h-3.5 w-3.5 mx-1.5 text-gray-400 flex-shrink-0" />
              <Link
                to={`/products?brand=${product.brand}`}
                className="hover:text-gray-900 transition-colors whitespace-nowrap"
              >
                {product.brand}
              </Link>
            </>
          )}
          <ChevronRightSmall className="h-3.5 w-3.5 mx-1.5 text-gray-400 flex-shrink-0" />
          <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Main Product */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
              <img
                src={product.images?.[selectedImage]?.url || '/placeholder-product.jpg'}
                alt={product.name}
                className="w-full aspect-square object-cover"
              />
              {discountPercentage > 0 && (
                <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-bold">
                  {discountPercentage}% OFF
                </span>
              )}
              {product.images?.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-md hover:bg-white transition-colors"
                  >
                    <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-md hover:bg-white transition-colors"
                  >
                    <ChevronRightIcon className="w-5 h-5 text-gray-700" />
                  </button>
                </>
              )}
              <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-md">
                {selectedImage + 1} / {product.images?.length || 1}
              </div>
            </div>

            {product.images?.length > 1 && (
              <div
                ref={thumbContainerRef}
                className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
              >
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-gray-900 shadow-md ring-2 ring-gray-900/10'
                        : 'border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={image.url} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-5">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">{product.brand}</p>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-0.5">{renderStars(product.ratings?.average || 0)}</div>
                <span className="text-sm text-gray-500">
                  {product.ratings?.average?.toFixed(1) || '0.0'} ({product.ratings?.count || 0} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">
                ₹{currentPrice?.toLocaleString('en-IN')}
              </span>
              {product.discountPrice && (
                <span className="text-lg text-gray-400 line-through">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              )}
              {discountPercentage > 0 && (
                <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
                  Save {discountPercentage}%
                </span>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-700' : 'text-red-600'}`}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>

            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            {/* Quantity + CTA */}
            <div ref={ctaRef} className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <label className="text-sm font-semibold text-gray-700">Quantity</label>
                <div className="inline-flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-2.5 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <MinusIcon className="h-4 w-4 text-gray-600" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val >= 1 && val <= product.stock) setQuantity(val);
                    }}
                    min="1"
                    max={product.stock}
                    className="w-14 text-center border-x border-gray-300 focus:ring-0 focus:outline-none font-semibold text-sm py-2.5"
                  />
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="p-2.5 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <PlusIcon className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isInCart(product._id) || product.stock === 0}
                  className={`flex-1 py-3.5 px-6 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2.5 ${
                    isInCart(product._id)
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200'
                      : product.stock === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                      : 'bg-gray-900 text-white hover:bg-gray-800 shadow-sm'
                  }`}
                >
                  <ShoppingCartIcon className="h-5 w-5" />
                  {isInCart(product._id) ? 'Added to Cart' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>

                <button
                  onClick={handleToggleWishlist}
                  className={`p-3.5 border rounded-xl transition-all ${
                    isWishlisted
                      ? 'border-red-200 bg-red-50 text-red-500'
                      : 'border-gray-300 hover:border-red-300 hover:bg-red-50 text-gray-600'
                  }`}
                  title="Add to Wishlist"
                >
                  {isWishlisted ? <HeartSolidIcon className="h-5 w-5" /> : <HeartIcon className="h-5 w-5" />}
                </button>

                <button
                  onClick={handleShare}
                  className="p-3.5 border border-gray-300 rounded-xl hover:border-blue-300 hover:bg-blue-50 text-gray-600 transition-all"
                  title="Share"
                >
                  <ShareIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200">
              <div className="flex flex-col items-center text-center gap-2 p-3">
                <TruckIcon className="h-6 w-6 text-gray-700" />
                <div>
                  <p className="text-xs font-semibold text-gray-900">Free Shipping</p>
                  <p className="text-[11px] text-gray-500">On orders above ₹500</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-2 p-3">
                <ShieldCheckIcon className="h-6 w-6 text-gray-700" />
                <div>
                  <p className="text-xs font-semibold text-gray-900">Secure Payment</p>
                  <p className="text-[11px] text-gray-500">100% secure</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-2 p-3">
                <ArrowPathIcon className="h-6 w-6 text-gray-700" />
                <div>
                  <p className="text-xs font-semibold text-gray-900">Easy Returns</p>
                  <p className="text-[11px] text-gray-500">30-day policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-16">
          <div className="border-b border-gray-200 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex overflow-x-auto gap-1 scrollbar-none">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-3.5 text-sm font-semibold whitespace-nowrap transition-all border-b-2 ${
                    activeTab === tab.id
                      ? 'border-gray-900 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'description' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Product Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
              {product.features?.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Key Features</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {product.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 bg-gray-50 px-4 py-3 rounded-lg">
                        <CheckIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'specifications' && product.specifications && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {Object.entries(product.specifications).map(([key, value], i) => (
                  <div
                    key={key}
                    className={`flex justify-between py-3.5 text-sm ${
                      i % 2 === 0 ? 'md:pr-8' : 'md:pl-8 md:border-l md:border-gray-100'
                    } ${i > 1 ? 'border-t border-gray-100' : ''}`}
                  >
                    <span className="font-medium text-gray-500">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="font-medium text-gray-900 text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Customer Reviews</h3>
              {product.reviews?.length > 0 ? (
                <div className="space-y-5">
                  {product.reviews.map((review) => (
                    <div key={review._id} className="border border-gray-100 rounded-xl p-5">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-sm font-bold">{getInitials(review.name)}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm text-gray-900">{review.name}</h4>
                            <div className="flex items-center gap-0.5 mt-0.5">
                              {[...Array(5)].map((_, i) => (
                                <StarSolidIcon
                                  key={i}
                                  className={`h-3.5 w-3.5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-200'}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          {new Date(review.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 mb-4">
                    <StarIcon className="h-7 w-7 text-gray-400" />
                  </div>
                  <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rp) => (
                <ProductCard key={rp._id} product={rp} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Mobile Add to Cart Bar */}
      {showStickyBar && product && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 py-3 lg:hidden">
          <div className="flex items-center gap-3 max-w-lg mx-auto">
            <div className="flex-shrink-0">
              <span className="text-lg font-bold text-gray-900">
                ₹{currentPrice?.toLocaleString('en-IN')}
              </span>
              {product.discountPrice && (
                <span className="block text-xs text-gray-400 line-through">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={isInCart(product._id) || product.stock === 0}
              className={`flex-1 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                isInCart(product._id)
                  ? 'bg-gray-100 text-gray-500'
                  : product.stock === 0
                  ? 'bg-gray-100 text-gray-400'
                  : 'bg-gray-900 text-white active:bg-gray-800'
              }`}
            >
              <ShoppingCartIcon className="h-4 w-4" />
              {isInCart(product._id) ? 'In Cart' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
