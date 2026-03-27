import React, { useState, useEffect } from 'react';
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
  CheckIcon
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
  const { addToCart, isInCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

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
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setIsWishlisted(false);
        toast.success('Removed from wishlist');
      } else {
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href
        });
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
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarSolidIcon key={i} className="h-5 w-5 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<StarSolidIcon key="half" className="h-5 w-5 text-yellow-400" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StarIcon key={`empty-${i}`} className="h-5 w-5 text-gray-300" />);
    }

    return stars;
  };

  const discountPercentage = product?.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % (product.images?.length || 1));
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + (product.images?.length || 1)) % (product.images?.length || 1));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-[500px] bg-gray-200 rounded-3xl"></div>
              <div className="space-y-6">
                <div className="h-10 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-12 bg-gray-200 rounded w-1/3"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-16 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
            <Link to="/products" className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all">
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-blue-600 transition-colors">Products</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-4">
            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl border border-gray-100">
              <img
                src={product.images?.[selectedImage]?.url || '/placeholder-product.jpg'}
                alt={product.name}
                className="w-full h-[500px] object-cover"
              />
              {discountPercentage > 0 && (
                <span className="absolute top-6 left-6 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  {discountPercentage}% OFF
                </span>
              )}
              {product.images?.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-xl p-3 rounded-full shadow-lg hover:bg-white transition-all">
                    <ChevronLeftIcon className="w-6 h-6" />
                  </button>
                  <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-xl p-3 rounded-full shadow-lg hover:bg-white transition-all">
                    <ChevronRightIcon className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={image.url} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-blue-600 font-semibold mb-2">{product.brand}</p>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {renderStars(product.ratings?.average || 0)}
                </div>
                <span className="text-gray-600">
                  {product.ratings?.average || 0} ({product.ratings?.count || 0} reviews)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ₹{(product.discountPrice || product.price).toLocaleString('en-IN')}
              </span>
              {product.discountPrice && (
                <>
                  <span className="text-xl text-gray-400 line-through">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `✓ In Stock (${product.stock} available)` : '✗ Out of Stock'}
              </span>
            </div>

            <p className="text-gray-600 leading-relaxed text-lg">{product.description}</p>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <label className="text-gray-700 font-semibold">Quantity:</label>
                <div className="flex items-center bg-white border border-gray-200 rounded-2xl">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-2xl transition-colors"
                  >
                    <MinusIcon className="h-5 w-5" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val >= 1 && val <= product.stock) {
                        setQuantity(val);
                      }
                    }}
                    min="1"
                    max={product.stock}
                    className="w-16 text-center border-0 focus:ring-0 font-semibold text-lg"
                  />
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-2xl transition-colors"
                  >
                    <PlusIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isInCart(product._id) || product.stock === 0}
                  className={`flex-1 py-4 px-8 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 ${
                    isInCart(product._id)
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : product.stock === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                  }`}
                >
                  <ShoppingCartIcon className="h-6 w-6" />
                  {isInCart(product._id) ? '✓ Added to Cart' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>

                <button
                  onClick={handleToggleWishlist}
                  className="p-4 border-2 border-gray-200 rounded-2xl hover:border-red-500 hover:bg-red-50 transition-all duration-300"
                  title="Add to Wishlist"
                >
                  {isWishlisted ? (
                    <HeartSolidIcon className="h-6 w-6 text-red-500" />
                  ) : (
                    <HeartIcon className="h-6 w-6 text-gray-600" />
                  )}
                </button>

                <button
                  onClick={handleShare}
                  className="p-4 border-2 border-gray-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-300"
                  title="Share"
                >
                  <ShareIcon className="h-6 w-6 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex items-center gap-3 text-gray-600 bg-white/50 p-4 rounded-xl">
                <TruckIcon className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="font-semibold text-sm">Free Shipping</p>
                  <p className="text-xs text-gray-500">On orders above ₹500</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-600 bg-white/50 p-4 rounded-xl">
                <ShieldCheckIcon className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-semibold text-sm">Secure Payment</p>
                  <p className="text-xs text-gray-500">100% secure</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-600 bg-white/50 p-4 rounded-xl">
                <ArrowPathIcon className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="font-semibold text-sm">Easy Returns</p>
                  <p className="text-xs text-gray-500">30-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <div className="flex border-b border-gray-200 mb-8">
            <button
              onClick={() => setActiveTab('description')}
              className={`px-8 py-4 font-semibold transition-all border-b-2 ${
                activeTab === 'description'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('specifications')}
              className={`px-8 py-4 font-semibold transition-all border-b-2 ${
                activeTab === 'specifications'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-8 py-4 font-semibold transition-all border-b-2 ${
                activeTab === 'reviews'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Reviews ({product.reviews?.length || 0})
            </button>
          </div>

          {activeTab === 'description' && (
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Product Description</h3>
              <p className="text-gray-600 leading-relaxed text-lg">{product.description}</p>
              {product.features && product.features.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-xl font-bold text-gray-900 mb-4">Key Features</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-xl">
                        <CheckIcon className="h-5 w-5 text-green-500 mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'specifications' && product.specifications && (
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-3 border-b border-gray-100">
                    <span className="font-medium text-gray-700">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h3>
              {product.reviews && product.reviews.length > 0 ? (
                <div className="space-y-6">
                  {product.reviews.map((review) => (
                    <div key={review._id} className="bg-gray-50 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">
                              {review.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{review.name}</h4>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <StarSolidIcon key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
                </div>
              )}
            </div>
          )}
        </div>

        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <span className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></span>
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct._id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
