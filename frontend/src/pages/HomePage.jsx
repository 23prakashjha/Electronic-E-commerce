import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Zap, TrendingUp, Award, Percent, Sparkles, ArrowRight, Package, CheckCircle, Mail, Headphones, Shield, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [email, setEmail] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState({});
  const { addToCart, isInCart } = useCart();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('section').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 30 - 15,
        y: (e.clientY / window.innerHeight) * 30 - 15
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      clearInterval(timer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

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

  const featuredProducts = [
    { id: 1, name: "iPhone 15 Pro", price: 999, originalPrice: 1199, image: "https://images.unsplash.com/photo-1592286115803-a1c3b552ee43?w=300&h=300&fit=crop", rating: 4.8, discount: 17 },
    { id: 2, name: "MacBook Air M2", price: 1099, originalPrice: 1299, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop", rating: 4.9, discount: 15 },
    { id: 3, name: "AirPods Pro", price: 199, originalPrice: 249, image: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=300&h=300&fit=crop", rating: 4.7, discount: 20 },
    { id: 4, name: "iPad Air", price: 599, originalPrice: 749, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop", rating: 4.8, discount: 20 }
  ];

  const latestProducts = [
    { id: 5, name: "Samsung Galaxy S24", price: 899, image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e597?w=300&h=300&fit=crop", rating: 4.7, isNew: true },
    { id: 6, name: "Sony WH-1000XM5", price: 399, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop", rating: 4.8, isNew: true },
    { id: 7, name: "Apple Watch Ultra", price: 799, image: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=300&h=300&fit=crop", rating: 4.9, isNew: true },
    { id: 8, name: "Google Pixel 8", price: 699, image: "https://images.unsplash.com/photo-1592286115803-a1c3b552ee43?w=300&h=300&fit=crop", rating: 4.6, isNew: true }
  ];

  const trendingProducts = [
    { id: 9, name: "DJI Mini 3 Pro", price: 759, image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=300&h=300&fit=crop", rating: 4.8, trending: true },
    { id: 10, name: "Nintendo Switch", price: 299, image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300&h=300&fit=crop", rating: 4.7, trending: true },
    { id: 11, name: "GoPro Hero 12", price: 399, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop", rating: 4.6, trending: true },
    { id: 12, name: "Kindle Oasis", price: 249, image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=300&fit=crop", rating: 4.5, trending: true }
  ];

  const categories = [
    { name: "Smartphones", icon: "📱", count: 245, color: "from-blue-500 to-blue-600", bgGradient: "from-blue-500/20 to-blue-600/10" },
    { name: "Laptops", icon: "💻", count: 89, color: "from-purple-500 to-purple-600", bgGradient: "from-purple-500/20 to-purple-600/10" },
    { name: "Headphones", icon: "🎧", count: 156, color: "from-green-500 to-green-600", bgGradient: "from-green-500/20 to-green-600/10" },
    { name: "Cameras", icon: "📷", count: 67, color: "from-red-500 to-red-600", bgGradient: "from-red-500/20 to-red-600/10" },
    { name: "Gaming", icon: "🎮", count: 134, color: "from-indigo-500 to-indigo-600", bgGradient: "from-indigo-500/20 to-indigo-600/10" },
    { name: "Smart Home", icon: "🏠", count: 98, color: "from-yellow-500 to-yellow-600", bgGradient: "from-yellow-500/20 to-yellow-600/10" }
  ];

  const testimonials = [
    { name: "John Doe", rating: 5, text: "Amazing products and excellent customer service! Will definitely shop again.", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" },
    { name: "Jane Smith", rating: 5, text: "Fast delivery and authentic products. The best electronics store online!", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop" },
    { name: "Mike Johnson", rating: 4, text: "Great prices and quality products. The return process is also very smooth.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" }
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  const handleQuickAdd = (product) => {
    if (!isInCart(product.id)) {
      addToCart({ _id: product.id, name: product.name, price: product.price, image: product.image });
      toast.success(`${product.name} added to cart!`);
    } else {
      toast('Already in cart!', { icon: '🛒' });
    }
  };

  const SectionHeader = ({ badge, title, subtitle, gradient, icon: Icon }) => (
    <div className="text-center mb-14">
      <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${badge} px-4 py-2 rounded-full mb-4`}>
        {Icon && <Icon className="w-5 h-5" />}
        <span className={`font-semibold text-sm`}>{badge.split('from-')[1]?.split('-')[0] === 'blue' ? 'Handpicked for You' : badge.includes('green') ? 'Just Dropped' : badge.includes('orange') ? 'Everyone\'s Talking About' : ''}</span>
      </div>
      <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
        {title} <span className={`text-transparent bg-clip-text bg-gradient-to-r ${gradient}`}>{title.split(' ').pop()}</span>
      </h2>
      <p className="text-gray-600 text-lg max-w-2xl mx-auto">{subtitle}</p>
    </div>
  );

  const ProductCard = ({ product, showDiscount = false, showNew = false, showTrending = false }) => (
    <div className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 border border-gray-100 hover:border-transparent">
      <div className="relative">
        <img src={product.image} alt={product.name} className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500" />
        {showDiscount && product.discount && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg animate-pulse">
            -{product.discount}% OFF
          </span>
        )}
        {showNew && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
            NEW
          </span>
        )}
        {showTrending && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> HOT
          </span>
        )}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
          <button className="p-2.5 bg-white/90 backdrop-blur-xl rounded-full shadow-md hover:bg-white transition-all duration-300 transform hover:scale-110 hover:rotate-12">
            <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" />
          </button>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <button 
          onClick={() => handleQuickAdd(product)}
          className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xl text-gray-800 py-3 px-4 rounded-xl font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white"
        >
          <ShoppingCart className="w-5 h-5" />
          {isInCart(product.id) ? 'In Cart' : 'Quick Add'}
        </button>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 text-lg">{product.name}</h3>
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
          ))}
          <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through font-medium">${product.originalPrice}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const AnimatedSection = ({ id, children, delay = 0 }) => (
    <section id={id} className={`transition-all duration-1000 transform ${isVisible[id] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </section>
  );

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Hero Banner Slider */}
      <AnimatedSection id="hero">
        <section className="relative h-[85vh] md:h-[90vh] overflow-hidden">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 z-10"></div>
              <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(1.05)` }} />
              <div className="absolute inset-0 z-20 flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className={`max-w-3xl transition-all duration-1000 delay-300 ${index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xl px-5 py-2.5 rounded-full mb-6 border border-white/30">
                      <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
                      <span className="text-white font-medium">Limited Time Offer</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                      {slide.title.split(' ').map((word, i) => (
                        <span key={i} className={`${i === slide.title.split(' ').length - 1 ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400' : ''}`}>{word} </span>
                      ))}
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-200 mb-8 font-light">{slide.subtitle}</p>
                    <div className="flex flex-wrap gap-4">
                      <Link to={slide.ctaLink} className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/30 hover:shadow-purple-500/30">
                        {slide.cta}
                        <ArrowRight className="w-6 h-6" />
                      </Link>
                      <button className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/30 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-white/20 transition-all duration-300">
                        Watch Video
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button onClick={prevSlide} className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-xl hover:bg-white/30 p-3 md:p-4 rounded-full transition-all duration-300 z-30 group">
            <ArrowRight className="w-6 h-6 md:w-8 md:h-8 text-white rotate-180 group-hover:scale-110 transition-transform" />
          </button>
          <button onClick={nextSlide} className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-xl hover:bg-white/30 p-3 md:p-4 rounded-full transition-all duration-300 z-30 group">
            <ArrowRight className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:scale-110 transition-transform" />
          </button>
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-30">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-500 ${index === currentSlide ? 'bg-white w-16' : 'bg-white/40 hover:bg-white/60 w-8'}`}
              />
            ))}
          </div>
        </section>
      </AnimatedSection>

      {/* Featured Products */}
      <AnimatedSection id="featured" delay={200}>
        <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-purple-50/30 relative">
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader 
              badge="from-blue-100 to-purple-100"
              title="Featured Electronics"
              subtitle="Discover our curated selection of premium electronics with unbeatable deals"
              gradient="from-blue-600 to-purple-600"
              icon={Sparkles}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} showDiscount={true} />
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Categories */}
      <AnimatedSection id="categories" delay={400}>
        <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl px-5 py-2.5 rounded-full mb-6 border border-white/20">
                <Package className="w-5 h-5 text-blue-400" />
                <span className="text-blue-400 font-semibold text-sm">Browse by Category</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Shop by Category</h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">Find exactly what you're looking for across our diverse collection</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category, index) => (
                <Link
                  key={category.name}
                  to={`/products?category=${category.name.toLowerCase()}`}
                  className={`group relative rounded-3xl p-6 text-center hover:scale-105 transition-all duration-500 cursor-pointer overflow-hidden bg-gradient-to-br ${category.bgGradient} border border-white/10 hover:border-white/30`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/5"></div>
                  <div className="relative text-5xl mb-3 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">{category.icon}</div>
                  <h3 className="font-bold text-lg mb-1 relative">{category.name}</h3>
                  <p className="text-sm text-gray-400">{category.count} Products</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Latest Products */}
      <AnimatedSection id="latest" delay={600}>
        <section className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader 
              badge="from-green-100 to-emerald-100"
              title="Latest Arrivals"
              subtitle="Be the first to experience the newest tech innovations"
              gradient="from-green-600 to-emerald-600"
              icon={Zap}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {latestProducts.map((product) => (
                <ProductCard key={product.id} product={product} showNew={true} />
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Flash Sale */}
      <AnimatedSection id="flash" delay={800}>
        <section className="py-24 bg-gradient-to-br from-red-600 via-orange-500 to-yellow-500 text-white relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-20"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xl px-5 py-2.5 rounded-full mb-6">
                <Zap className="w-5 h-5 text-yellow-300 animate-pulse" />
                <span className="text-white font-semibold text-sm">Hurry Up!</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 flex items-center justify-center gap-3">
                <Zap className="w-10 h-10" />
                Flash Sale
              </h2>
              <p className="text-xl mb-8 text-white/90">Limited time offers - Don't miss out!</p>
              <div className="flex justify-center gap-4 md:gap-6 mb-10">
                {[
                  { value: '02', label: 'Days' },
                  { value: '14', label: 'Hours' },
                  { value: '37', label: 'Minutes' },
                  { value: '52', label: 'Seconds' }
                ].map((item, i) => (
                  <div key={i} className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 md:p-6 min-w-[80px] md:min-w-[100px]">
                    <div className="text-3xl md:text-5xl font-bold">{item.value}</div>
                    <div className="text-sm md:text-base text-white/80">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} showDiscount={true} />
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Trending Products */}
      <AnimatedSection id="trending" delay={1000}>
        <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader 
              badge="from-orange-100 to-red-100"
              title="Trending Now"
              subtitle="Hot products that are taking the market by storm"
              gradient="from-orange-600 to-red-600"
              icon={TrendingUp}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {trendingProducts.map((product) => (
                <ProductCard key={product.id} product={product} showTrending={true} />
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Mega Discount Banner */}
      <AnimatedSection id="discount" delay={1200}>
        <section className="py-24 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(120,119,198,0.2),transparent_50%)]"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl px-5 py-2.5 rounded-full mb-6 border border-white/20">
                <Percent className="w-5 h-5 text-purple-400" />
                <span className="text-purple-400 font-semibold text-sm">Special Offer</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                Mega Discount Season
              </h2>
              <p className="text-2xl text-purple-200 mb-4">Get up to 70% off on selected items</p>
              <p className="text-xl text-purple-300 mb-10">Use code: <span className="font-bold text-white bg-white/20 px-6 py-2 rounded-xl">TECH70</span></p>
              <Link to="/products" className="inline-flex items-center gap-3 bg-white text-indigo-900 px-10 py-4 rounded-2xl text-xl font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl">
                Shop Sale Items
                <ArrowRight className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Features Section */}
      <AnimatedSection id="features" delay={1400}>
        <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-10"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Truck, title: "Free Shipping", desc: "On orders over ₹500" },
                { icon: Shield, title: "Secure Payment", desc: "100% secure transactions" },
                { icon: Headphones, title: "24/7 Support", desc: "Dedicated customer service" }
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center text-center p-8 rounded-3xl bg-white/10 backdrop-blur-xl hover:bg-white/20 transition-all duration-300 group border border-white/10 hover:border-white/30">
                  <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="opacity-90">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Testimonials */}
      <AnimatedSection id="testimonials" delay={1600}>
        <section className="py-24 bg-gradient-to-br from-white via-purple-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-5 py-2.5 rounded-full mb-6">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span className="text-blue-600 font-semibold text-sm">What Our Customers Say</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Thousands</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">Real reviews from real customers who love shopping with us</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                  <div className="flex items-center mb-6">
                    <img src={testimonial.avatar} alt={testimonial.name} className="w-16 h-16 rounded-full mr-4 ring-4 ring-blue-100" />
                    <div>
                      <h4 className="font-bold text-xl text-gray-900">{testimonial.name}</h4>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 italic text-lg leading-relaxed">"{testimonial.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Newsletter */}
      <AnimatedSection id="newsletter" delay={1800}>
        <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          </div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <Mail className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl mb-10 text-white/90">Subscribe to get exclusive offers and new product updates</p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-2xl text-gray-800 focus:outline-none focus:ring-4 focus:ring-white/30 text-lg"
                required
              />
              <button
                type="submit"
                className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
};

export default HomePage;