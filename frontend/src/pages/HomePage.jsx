import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Clock, Truck, Shield, Headphones, Mail, ChevronLeft, ChevronRight, Zap, TrendingUp, Award, Percent, Sparkles } from 'lucide-react';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [email, setEmail] = useState('');

  // Hero Banner Sliders
  const heroSlides = [
    {
      id: 1,
      title: "Summer Electronics Sale",
      subtitle: "Up to 50% Off on Smartphones & Laptops",
      image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=1200&h=600&fit=crop",
      cta: "Shop Now",
      ctaLink: "/products"
    },
    {
      id: 2,
      title: "New Gaming Consoles",
      subtitle: "Latest PS5 & Xbox Series X Available",
      image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=1200&h=600&fit=crop",
      cta: "Explore Games",
      ctaLink: "/products?category=gaming"
    },
    {
      id: 3,
      title: "Smart Home Revolution",
      subtitle: "Transform Your Home with Smart Devices",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=600&fit=crop",
      cta: "Discover More",
      ctaLink: "/products?category=smart-home"
    }
  ];

  // Featured Products
  const featuredProducts = [
    { id: 1, name: "iPhone 15 Pro", price: 999, originalPrice: 1199, image: "https://images.unsplash.com/photo-1592286115803-a1c3b552ee43?w=300&h=300&fit=crop", rating: 4.8, discount: 17 },
    { id: 2, name: "MacBook Air M2", price: 1099, originalPrice: 1299, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop", rating: 4.9, discount: 15 },
    { id: 3, name: "AirPods Pro", price: 199, originalPrice: 249, image: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=300&h=300&fit=crop", rating: 4.7, discount: 20 },
    { id: 4, name: "iPad Air", price: 599, originalPrice: 749, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop", rating: 4.8, discount: 20 }
  ];

  // Latest Products
  const latestProducts = [
    { id: 5, name: "Samsung Galaxy S24", price: 899, image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e597?w=300&h=300&fit=crop", rating: 4.7, isNew: true },
    { id: 6, name: "Sony WH-1000XM5", price: 399, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop", rating: 4.8, isNew: true },
    { id: 7, name: "Apple Watch Ultra", price: 799, image: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=300&h=300&fit=crop", rating: 4.9, isNew: true },
    { id: 8, name: "Google Pixel 8", price: 699, image: "https://images.unsplash.com/photo-1592286115803-a1c3b552ee43?w=300&h=300&fit=crop", rating: 4.6, isNew: true }
  ];

  // Trending Products
  const trendingProducts = [
    { id: 9, name: "DJI Mini 3 Pro", price: 759, image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=300&h=300&fit=crop", rating: 4.8, trending: true },
    { id: 10, name: "Nintendo Switch", price: 299, image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300&h=300&fit=crop", rating: 4.7, trending: true },
    { id: 11, name: "GoPro Hero 12", price: 399, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop", rating: 4.6, trending: true },
    { id: 12, name: "Kindle Oasis", price: 249, image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=300&fit=crop", rating: 4.5, trending: true }
  ];

  // Best Sellers
  const bestSellers = [
    { id: 13, name: "AirPods Max", price: 549, sold: 1200, image: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=300&h=300&fit=crop", rating: 4.8 },
    { id: 14, name: "Samsung TV 55\"", price: 899, sold: 980, image: "https://images.unsplash.com/photo-1593359677879-2b0dea0d750b?w=300&h=300&fit=crop", rating: 4.7 },
    { id: 15, name: "Canon EOS R6", price: 2499, sold: 450, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&h=300&fit=crop", rating: 4.9 },
    { id: 16, name: "Surface Laptop 5", price: 1299, sold: 670, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop", rating: 4.6 }
  ];

  // Categories
  const categories = [
    { name: "Smartphones", icon: "📱", count: 245, color: "bg-blue-500" },
    { name: "Laptops", icon: "💻", count: 89, color: "bg-purple-500" },
    { name: "Headphones", icon: "🎧", count: 156, color: "bg-green-500" },
    { name: "Cameras", icon: "📷", count: 67, color: "bg-red-500" },
    { name: "Gaming", icon: "🎮", count: 134, color: "bg-indigo-500" },
    { name: "Smart Home", icon: "🏠", count: 98, color: "bg-yellow-500" }
  ];

  // Brands
  const brands = [
    { name: "Apple", logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=150&h=80&fit=crop" },
    { name: "Samsung", logo: "https://images.unsplash.com/photo-1592286115803-a1c3b552ee43?w=150&h=80&fit=crop" },
    { name: "Sony", logo: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&h=80&fit=crop" },
    { name: "LG", logo: "https://images.unsplash.com/photo-1593359677879-2b0dea0d750b?w=150&h=80&fit=crop" },
    { name: "Dell", logo: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=150&h=80&fit=crop" },
    { name: "HP", logo: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=150&h=80&fit=crop" }
  ];

  // Testimonials
  const testimonials = [
    { name: "John Doe", rating: 5, text: "Amazing products and excellent customer service! Will definitely shop again.", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" },
    { name: "Jane Smith", rating: 5, text: "Fast delivery and authentic products. The best electronics store online!", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop" },
    { name: "Mike Johnson", rating: 4, text: "Great prices and quality products. The return process is also very smooth.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" }
  ];

  // Blog posts
  const blogPosts = [
    { title: "Top 10 Smartphones of 2024", excerpt: "Discover the best smartphones available this year...", image: "https://images.unsplash.com/photo-1592286115803-a1c3b552ee43?w=400&h=250&fit=crop", date: "Mar 15, 2024" },
    { title: "Gaming Laptop Buying Guide", excerpt: "Everything you need to know before buying a gaming laptop...", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=250&fit=crop", date: "Mar 12, 2024" },
    { title: "Smart Home Setup Basics", excerpt: "Learn how to start your smart home journey...", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop", date: "Mar 10, 2024" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const ProductCard = ({ product, showDiscount = false, showNew = false, showTrending = false, showSold = false }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
      <div className="relative">
        <img src={product.image} alt={product.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
        {showDiscount && product.discount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
            -{product.discount}%
          </span>
        )}
        {showNew && (
          <span className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
            NEW
          </span>
        )}
        {showTrending && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-md text-sm font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> HOT
          </span>
        )}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
            <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm text-gray-600">{product.rating}</span>
        </div>
        {showSold && (
          <p className="text-sm text-gray-500 mb-2">{product.sold} sold</p>
        )}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through ml-2">${product.originalPrice}</span>
            )}
          </div>
          <button className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Hero Banner Slider */}
      <section className="relative h-96 md:h-[500px] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h1>
                <p className="text-xl md:text-2xl mb-8">{slide.subtitle}</p>
                <Link to={slide.ctaLink} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors">
                  {slide.cta}
                </Link>
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? 'bg-white' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </section>

      {/* Featured Electronics Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Featured Electronics</h2>
            <p className="text-gray-600 text-lg">Handpicked products with amazing deals</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} showDiscount={true} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Latest Arrivals</h2>
            <p className="text-gray-600 text-lg">Be the first to get the newest tech</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestProducts.map((product) => (
              <ProductCard key={product.id} product={product} showNew={true} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
              <TrendingUp className="w-8 h-8 text-orange-500" />
              Trending Now
            </h2>
            <p className="text-gray-600 text-lg">Hot products everyone's talking about</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} showTrending={true} />
            ))}
          </div>
        </div>
      </section>

      {/* Best Seller Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
              <Award className="w-8 h-8 text-yellow-500" />
              Best Sellers
            </h2>
            <p className="text-gray-600 text-lg">Our most popular products</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} showSold={true} />
            ))}
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Shop by Category</h2>
            <p className="text-gray-600 text-lg">Find exactly what you're looking for</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/products?category=${category.name.toLowerCase()}`}
                className={`${category.color} text-white rounded-lg p-6 text-center hover:scale-105 transition-transform cursor-pointer`}
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold mb-1">{category.name}</h3>
                <p className="text-sm opacity-90">{category.count} Products</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Flash Sale Offers */}
      <section className="py-16 bg-gradient-to-r from-red-500 to-orange-500 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-2">
              <Zap className="w-8 h-8" />
              Flash Sale
            </h2>
            <p className="text-xl">Limited time offers - Don't miss out!</p>
            <div className="flex justify-center gap-4 mt-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold">02</div>
                <div className="text-sm">Days</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold">14</div>
                <div className="text-sm">Hours</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold">37</div>
                <div className="text-sm">Minutes</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold">52</div>
                <div className="text-sm">Seconds</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} showDiscount={true} />
            ))}
          </div>
        </div>
      </section>

      {/* Discount Banner */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <Percent className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">Mega Discount Season</h2>
            <p className="text-xl mb-8">Get up to 70% off on selected items. Use code: TECH70</p>
            <Link to="/products" className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
              Shop Sale Items
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Showcase */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Top Brands</h2>
            <p className="text-gray-600 text-lg">Shop from your favorite brands</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {brands.map((brand, index) => (
              <div key={`brand-${index}`} className="bg-white rounded-lg p-6 flex items-center justify-center hover:shadow-lg transition-shadow cursor-pointer">
                <img src={brand.logo} alt={brand.name} className="h-12 object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Shipping Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Truck className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
              <p className="opacity-90">On orders over $50</p>
            </div>
            <div className="flex flex-col items-center">
              <Shield className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
              <p className="opacity-90">100% secure transactions</p>
            </div>
            <div className="flex flex-col items-center">
              <Headphones className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
              <p className="opacity-90">Dedicated customer service</p>
            </div>
          </div>
        </div>
      </section>

      {/* Secure Payment Information */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Secure Payment Methods</h2>
            <p className="text-gray-600 text-lg">We accept all major payment options</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md flex items-center justify-center">
              <div className="text-2xl font-bold text-blue-600">VISA</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md flex items-center justify-center">
              <div className="text-2xl font-bold text-red-600">MC</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md flex items-center justify-center">
              <div className="text-2xl font-bold text-blue-500">AMEX</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md flex items-center justify-center">
              <div className="text-2xl font-bold text-green-600">PayPal</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md flex items-center justify-center">
              <div className="text-2xl font-bold text-orange-500">GPay</div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
            <p className="text-gray-600 text-lg">Real reviews from real customers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Latest Blog Posts</h2>
            <p className="text-gray-600 text-lg">Stay updated with tech news and reviews</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <p className="text-sm text-gray-500 mb-2">{post.date}</p>
                  <h3 className="text-xl font-semibold mb-3">{post.title}</h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <Link to="/blog" className="text-blue-600 hover:text-blue-700 font-semibold">
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Mail className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl mb-8">Subscribe to get exclusive offers and new product updates</p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
              <button
                type="submit"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Customer Support Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">We're Here to Help</h2>
            <p className="text-gray-600 text-lg">Get the support you need, when you need it</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 text-center shadow-md">
              <Headphones className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Live Chat Support</h3>
              <p className="text-gray-600 mb-4">Chat with our support team in real-time</p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Start Chat
              </button>
            </div>
            <div className="bg-white rounded-lg p-8 text-center shadow-md">
              <Mail className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Email Support</h3>
              <p className="text-gray-600 mb-4">Get help via email within 24 hours</p>
              <a href="mailto:support@electrostore.com" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors inline-block">
                Send Email
              </a>
            </div>
            <div className="bg-white rounded-lg p-8 text-center shadow-md">
              <Shield className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Help Center</h3>
              <p className="text-gray-600 mb-4">Find answers to common questions</p>
              <Link to="/help" className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors inline-block">
                Visit Help Center
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Links */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Follow Us</h2>
          <p className="text-xl mb-8">Stay connected for latest updates and exclusive offers</p>
          <div className="flex justify-center gap-6">
            <a href="#" className="bg-blue-600 p-3 rounded-full hover:bg-blue-700 transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" className="bg-blue-400 p-3 rounded-full hover:bg-blue-500 transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a href="#" className="bg-gradient-to-br from-purple-600 to-pink-500 p-3 rounded-full hover:opacity-90 transition-opacity">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
              </svg>
            </a>
            <a href="#" className="bg-red-600 p-3 rounded-full hover:bg-red-700 transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
