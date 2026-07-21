import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCart, Heart, Star, Zap, TrendingUp, Award, Percent,
  Sparkles, ArrowRight, Package, CheckCircle, Mail, Headphones,
  Shield, Truck, ChevronLeft, ChevronRight, Eye, Clock, Users,
  ThumbsUp, Wallet, BadgeCheck, CircleDollarSign, RefreshCw
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import appleLogo from '../assets/apple.png';
import samsungLogo from '../assets/samsung.png';
import dellLogo from '../assets/dell.png';
import hpLogo from '../assets/hp.png';
import lenovoLogo from '../assets/lenovo.png';
import oneplusLogo from '../assets/oneplus.png';
import lgLogo from '../assets/lg.png';
import realmeLogo from '../assets/realme.png';
import vivoLogo from '../assets/vivo.png';
import motorolaLogo from '../assets/motorola.png';
import oppoLogo from '../assets/oppo.png';
import boysAvatar from '../assets/boys.jpg';
import girlsAvatar from '../assets/girls.jpg';
import heroMain from '../assets/hero.png';
import heroMobile from '../assets/hero-mob.png';
import heroLaptop from '../assets/hero-lap.png';
import heroSmart from '../assets/hero-smart.png';
import heroEarphones from '../assets/hero-ear.png';
import heroWatch from '../assets/hero-watch.png';
import heroTV from '../assets/hero-tv.png';
import heroMonitor from '../assets/hero-mon.png';
import heroTablet from '../assets/hero-tabs.png';
import heroWashing from '../assets/hero-wash.png';
import heroFridge from '../assets/hero-ref.png';
import heroAccessories from '../assets/hero-acc.png';
import getImageUrl from '../utils/getImageUrl';

const API_BASE = 'http://localhost:5000/api';

const HERO_SLIDES = [
  {
    id: 1,
    title: "Summer Electronics Sale",
    subtitle: "Up to 50% Off on Smartphones, Laptops & Accessories",
    tagline: "Biggest Sale of the Year",
    description: "Explore thousands of deals across smartphones, laptops, headphones, cameras, and more. From flagship devices to budget-friendly picks — we've got it all. Limited stock available — grab your favorites before they're gone!",
    image: heroMain,
    cta: "Shop Now",
    ctaLink: "/products",
    badge: "UP TO 50% OFF",
    features: ["Free Shipping on ₹500+", "30-Day Easy Returns", "No Cost EMI Available", "Cash on Delivery"]
  },
  {
    id: 2,
    title: "Latest Smartphones",
    subtitle: "Discover the Newest Phones from Apple, Samsung & OnePlus",
    tagline: "New Arrivals Just Dropped",
    description: "Get your hands on the latest flagships and mid-range powerhouses. Compare specs, read reviews, and find the perfect phone that matches your lifestyle — all at the best prices online.",
    image: heroMobile,
    cta: "Explore Phones",
    ctaLink: "/products?category=smartphones",
    badge: "NEW LAUNCHES",
    features: ["Exchange & Save More", "No Cost EMI Options", "Cash on Delivery", "1 Year Brand Warranty"]
  },
  {
    id: 3,
    title: "Premium Laptops",
    subtitle: "Powerful Laptops for Work, Study & Gaming",
    tagline: "Performance Meets Portability",
    description: "From ultrabooks for professionals to high-performance gaming rigs — find the perfect laptop for your needs. Top brands like Dell, HP, Lenovo, Apple, and ASUS at unbeatable prices with extended warranty.",
    image: heroLaptop,
    cta: "Shop Laptops",
    ctaLink: "/products?category=laptops",
    badge: "TOP BRANDS",
    features: ["1 Year Manufacturer Warranty", "Free Laptop Bag Included", "Gaming & Workstation Options", "SSD & High RAM Configs"]
  },
  {
    id: 4,
    title: "Smart Home Revolution",
    subtitle: "Transform Your Home with Alexa & Google Compatible Devices",
    tagline: "Automate Your Lifestyle",
    description: "Control your lights, thermostats, cameras, and appliances with just your voice. Build a connected smart home ecosystem that makes life easier, safer, and more energy-efficient — starting from just ₹2,499.",
    image: heroSmart,
    cta: "Discover More",
    ctaLink: "/products?category=smart-home",
    badge: "SMART HOME",
    features: ["Voice Control Ready", "Energy Saving Devices", "Remote Access via App", "Easy DIY Setup"]
  },
  {
    id: 5,
    title: "Premium Audio Experience",
    subtitle: "Studio-Quality Headphones, Earbuds & Speakers",
    tagline: "Sound That Moves You",
    description: "Immerse yourself in rich, crystal-clear audio with our curated range of wireless earbuds, over-ear headphones, and portable speakers. Industry-leading noise cancellation and up to 30 hours of battery life.",
    image: heroEarphones,
    cta: "Shop Audio",
    ctaLink: "/products?category=headphones",
    badge: "BEST SELLERS",
    features: ["Active Noise Cancelling", "Up to 30hr Battery Life", "Hi-Res Audio Certified", "IPX4+ Water Resistant"]
  },
  {
    id: 6,
    title: "Smart Watches",
    subtitle: "Track Fitness, Health & Stay Connected on Your Wrist",
    tagline: "Your Health Companion",
    description: "Monitor your heart rate, SpO2, sleep quality, and daily activity — all from your wrist. Stay connected with notifications, calls, and music control. Style meets functionality for every occasion.",
    image: heroWatch,
    cta: "Shop Watches",
    ctaLink: "/products?category=wearables",
    badge: "HEALTH FIRST",
    features: ["24/7 Heart Rate Monitor", "Built-in GPS Tracking", "5ATM Water Resistant", "14-Day Battery Life"]
  },
  {
    id: 7,
    title: "Smart TVs & Home Entertainment",
    subtitle: "4K Ultra HD, OLED & QLED TVs at Unbeatable Prices",
    tagline: "Cinema Experience at Home",
    description: "Upgrade your living room with stunning displays featuring Dolby Vision, Dolby Atmos, and smart OS built-in. Stream Netflix, Prime, and more directly on your TV. Sizes from 43\" to 75\" available.",
    image: heroTV,
    cta: "Shop TVs",
    ctaLink: "/products?category=tvs",
    badge: "4K ULTRA HD",
    features: ["Dolby Vision & Atmos", "120Hz Refresh Rate", "Built-in Smart OS", "Wall Mount Included"]
  },
  {
    id: 8,
    title: "Gaming Monitors",
    subtitle: "Ultra-Smooth Displays for Competitive & Casual Gaming",
    tagline: "Win Every Match",
    description: "Gain the competitive edge with blazing-fast refresh rates, ultra-low response times, and stunning HDR visuals. From 24\" esports monitors to 34\" ultrawide curved displays for immersive gaming.",
    image: heroMonitor,
    cta: "Shop Monitors",
    ctaLink: "/products?category=monitors",
    badge: "144Hz+ DISPLAY",
    features: ["1ms Response Time", "HDR10+ Support", "Adaptive Sync Tech", "IPS & VA Panel Options"]
  },
  {
    id: 9,
    title: "Tablets & iPads",
    subtitle: "Portable Power for Creativity, Study & Entertainment",
    tagline: "Create Anywhere You Go",
    description: "Whether you're sketching with a stylus, attending online classes, streaming your favorite shows, or editing photos on the go — our tablets deliver desktop-class performance in a sleek, lightweight package.",
    image: heroTablet,
    cta: "Shop Tablets",
    ctaLink: "/products?category=tablets",
    badge: "ULTRA PORTABLE",
    features: ["Stylus & Keyboard Support", "All-Day 10hr+ Battery", "Retina & AMOLED Displays", "WiFi + Cellular Options"]
  },
  {
    id: 10,
    title: "Premium Home Appliances",
    subtitle: "Refrigerators, ACs & More at the Best Prices Online",
    tagline: "Smart Living Starts Here",
    description: "Upgrade every corner of your home with energy-efficient appliances from Samsung, LG, Whirlpool, and more. Inverter technology, smart diagnostics, and whisper-quiet performance — all with free installation.",
    image: heroFridge,
    cta: "Shop Appliances",
    ctaLink: "/products?category=appliances",
    badge: "HOME ESSENTIALS",
    features: ["Energy Star Rated", "5 Year Comprehensive Warranty", "Free Installation & Setup", "EMI from ₹999/month"]
  },
  {
    id: 11,
    title: "Washing Machines",
    subtitle: "Fully Automatic Front & Top Load at Best Prices",
    tagline: "Effortless Laundry Every Day",
    description: "Find the perfect washing machine for your family — from compact 6kg models to large 9kg capacity. AI-powered wash cycles, steam cleaning, and inverter motors for whisper-quiet, energy-efficient performance.",
    image: heroWashing,
    cta: "Shop Now",
    ctaLink: "/products?category=appliances",
    badge: "FULLY AUTO",
    features: ["AI Wash Technology", "Steam & Hot Wash", "Low Water & Energy Usage", "8kg to 10kg Capacity"]
  }
];

const TESTIMONIALS = [
  { name: "Amit Sharma", rating: 5, text: "Amazing products and excellent customer service! Will definitely shop again.", avatar: boysAvatar },
  { name: "Priya Singh", rating: 5, text: "Fast delivery and authentic products. The best electronics store online!", avatar: girlsAvatar },
  { name: "Rahul Verma", rating: 4, text: "Great prices and quality products. The return process is also very smooth.", avatar: boysAvatar },
  { name: "Sneha Patel", rating: 5, text: "I love the wide range of products. Found exactly what I was looking for!", avatar: girlsAvatar },
  { name: "Vikram Reddy", rating: 5, text: "Outstanding customer support. They resolved my issue within minutes.", avatar: boysAvatar },
  { name: "Ananya Nair", rating: 4, text: "Very reliable store. Products are always genuine and well-packaged.", avatar: girlsAvatar },
  { name: "Karan Mehta", rating: 5, text: "Best deals during the sale! Saved a lot on my new laptop purchase.", avatar: boysAvatar },
  { name: "Deepika Joshi", rating: 5, text: "Quick shipping and amazing packaging. Highly recommended for electronics.", avatar: girlsAvatar },
  { name: "Arjun Rao", rating: 4, text: "Good quality products at competitive prices. Will keep coming back.", avatar: boysAvatar },
  { name: "Meera Gupta", rating: 5, text: "The warranty support is fantastic. Very trustworthy online store.", avatar: girlsAvatar },
  { name: "Suresh Kumar", rating: 5, text: "Ordered a smartphone and received it in perfect condition. Great service!", avatar: boysAvatar },
  { name: "Pooja Desai", rating: 4, text: "Easy checkout process and multiple payment options. Very convenient.", avatar: girlsAvatar },
  { name: "Ravi Teja", rating: 5, text: "Been shopping here for over a year. Never disappointed with the quality.", avatar: boysAvatar },
  { name: "Kavitha Rao", rating: 5, text: "My go-to store for all electronic gadgets. Love the offers and discounts!", avatar: girlsAvatar },
  { name: "Nikhil Bansal", rating: 4, text: "Fastest delivery I have ever experienced. Products are always top-notch.", avatar: boysAvatar },
  { name: "Shreya Iyer", rating: 5, text: "Excellent collection of accessories. Found everything I needed in one place.", avatar: girlsAvatar },
  { name: "Manish Tiwari", rating: 5, text: "Superb shopping experience. The website is easy to navigate and user-friendly.", avatar: boysAvatar },
  { name: "Ritika Chopra", rating: 4, text: "Amazing return policy. No questions asked, hassle-free returns.", avatar: girlsAvatar },
  { name: "Aditya Pandey", rating: 5, text: "Bought a gaming setup and saved 30%. Best place for gamers!", avatar: boysAvatar },
  { name: "Nisha Agarwal", rating: 5, text: "The customer care team is very responsive. Issues are resolved quickly.", avatar: girlsAvatar }
];

const BRANDS = [
  { name: "Apple", productCount: 124, logo: appleLogo },
  { name: "Samsung", productCount: 189, logo: samsungLogo },
  { name: "Sony", initials: "Sn", productCount: 97 },
  { name: "Dell", productCount: 76, logo: dellLogo },
  { name: "HP", productCount: 88, logo: hpLogo },
  { name: "Lenovo", productCount: 64, logo: lenovoLogo },
  { name: "OnePlus", productCount: 42, logo: oneplusLogo },
  { name: "LG", productCount: 71, logo: lgLogo },
  { name: "Realme", productCount: 58, logo: realmeLogo },
  { name: "Vivo", productCount: 53, logo: vivoLogo },
  { name: "Motorola", productCount: 47, logo: motorolaLogo },
  { name: "Oppo", productCount: 51, logo: oppoLogo }
];

const normalizeProduct = (p) => ({
  _id: p._id,
  id: p._id,
  name: p.name,
  price: p.price,
  originalPrice: p.originalPrice || p.price,
  image: p.images?.[0]?.url || p.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
  images: p.images || [p.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"],
  rating: p.ratings?.average || p.rating || 0,
  discount: p.discount || (p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0),
  isNew: p.isNew,
  trending: p.trending || p.salesCount > 50,
  slug: p.slug
});

const useFlashSaleTimer = () => {
  const [timeLeft, setTimeLeft] = useState(() => {
    const now = new Date();
    const end = new Date(now);
    end.setDate(end.getDate() + 2);
    end.setHours(23, 59, 59, 0);
    return Math.max(0, Math.floor((end - now) / 1000));
  });

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft > 0]);

  const days = Math.floor(timeLeft / 86400);
  const hours = Math.floor((timeLeft % 86400) / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return [
    { value: String(days).padStart(2, '0'), label: 'Days' },
    { value: String(hours).padStart(2, '0'), label: 'Hours' },
    { value: String(minutes).padStart(2, '0'), label: 'Minutes' },
    { value: String(seconds).padStart(2, '0'), label: 'Seconds' }
  ];
};

const useScrollReveal = () => {
  const [visibleSections, setVisibleSections] = useState(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            setVisibleSections((prev) => new Set([...prev, entry.target.dataset.section]));
          }
        });
      },
      { threshold: 0.1 }
    );

    const timer = setTimeout(() => {
      document.querySelectorAll('[data-section]').forEach((el) => observer.observe(el));
    }, 100);

    return () => { clearTimeout(timer); observer.disconnect(); };
  }, []);

  return visibleSections;
};

const useAnimatedCounter = (end, duration = 2000, startCounting = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startCounting) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [startCounting, end, duration]);

  return count;
};

const SkeletonCard = () => (
  <div className="bg-white rounded-3xl shadow-lg overflow-hidden animate-pulse border border-gray-100">
    <div className="h-56 bg-gray-200" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-6 bg-gray-200 rounded w-1/3" />
    </div>
  </div>
);

const SkeletonCategoryCard = () => (
  <div className="rounded-3xl p-6 bg-white/10 animate-pulse border border-white/10">
    <div className="h-12 w-12 bg-white/20 rounded-xl mx-auto mb-3" />
    <div className="h-4 bg-white/20 rounded w-2/3 mx-auto mb-2" />
    <div className="h-3 bg-white/20 rounded w-1/2 mx-auto" />
  </div>
);

const StatCounter = ({ stat, startCounting, idx }) => {
  const count = useAnimatedCounter(stat.isDecimal ? 48 : stat.value, 2000, startCounting);
  const displayValue = stat.isDecimal ? (count / 10).toFixed(1) : count.toLocaleString();

  return (
    <div
      className="text-center group"
      style={{ animationDelay: `${idx * 150}ms` }}
    >
      <div className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-xl`}>
        <stat.icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
      </div>
      <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-2 tabular-nums">
        {displayValue}{stat.suffix}
      </div>
      <div className="text-gray-500 font-medium text-sm md:text-base">{stat.label}</div>
    </div>
  );
};

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHoveringSlide, setIsHoveringSlide] = useState(false);
  const [email, setEmail] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { addToCart, isInCart } = useCart();
  const visibleSections = useScrollReveal();

  const [featured, setFeatured] = useState([]);
  const [latest, setLatest] = useState([]);
  const [trending, setTrending] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState({ featured: true, latest: true, trending: true, categories: true });

  const timeLeft = useFlashSaleTimer();

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isHoveringSlide) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isHoveringSlide]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [featRes, latestRes, trendRes, catRes] = await Promise.allSettled([
          fetch(`${API_BASE}/products?limit=8&sort=ratings.average&order=desc`),
          fetch(`${API_BASE}/products?limit=4&sort=createdAt&order=desc`),
          fetch(`${API_BASE}/products?limit=4&sort=salesCount&order=desc`),
          fetch(`${API_BASE}/categories`)
        ]);

        if (featRes.status === 'fulfilled' && featRes.value.ok) {
          const data = await featRes.value.json();
          setFeatured((data.products || data.data || data || []).slice(0, 8).map(normalizeProduct));
        }

        if (latestRes.status === 'fulfilled' && latestRes.value.ok) {
          const data = await latestRes.value.json();
          setLatest((data.products || data.data || data || []).slice(0, 4).map(normalizeProduct));
        }

        if (trendRes.status === 'fulfilled' && trendRes.value.ok) {
          const data = await trendRes.value.json();
          setTrending((data.products || data.data || data || []).slice(0, 4).map(normalizeProduct));
        }

        if (catRes.status === 'fulfilled' && catRes.value.ok) {
          const data = await catRes.value.json();
          const cats = (data.categories || data.data || data || []).map((c) => ({
            name: c.name,
            slug: c.slug || c.name.toLowerCase().replace(/\s+/g, '-'),
            icon: c.icon || '📦',
            productCount: c.productCount || c.count || 0,
            color: c.color || 'from-gray-500 to-gray-600',
            bgGradient: c.bgGradient || 'from-gray-500/20 to-gray-600/10'
          }));
          if (cats.length > 0) setCategories(cats);
        }
      } catch {
        // API unavailable — sections will show empty/loading state
      } finally {
        setLoading({ featured: false, latest: false, trending: false, categories: false });
      }
    };

    fetchAll();
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  const handleQuickAdd = (product) => {
    const id = product._id || product.id;
    if (!isInCart(id)) {
      addToCart(product);
      toast.success(`${product.name} added to cart!`);
    } else {
      toast('Already in cart!', { icon: '🛒' });
    }
  };

  const SectionHeader = ({ label, title, subtitle, gradient, icon: Icon }) => (
    <div className="text-center mb-12 md:mb-14">
      {label && (
        <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${gradient} text-white px-4 py-2 rounded-full mb-4`}>
          {Icon && <Icon className="w-4 h-4" />}
          <span className="font-semibold text-sm">{label}</span>
        </div>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
        {title.split(' ').slice(0, -1).join(' ')}{' '}
        <span className={`text-transparent bg-clip-text bg-gradient-to-r ${gradient}`}>{title.split(' ').pop()}</span>
      </h2>
      <p className="text-gray-500 text-lg max-w-2xl mx-auto">{subtitle}</p>
    </div>
  );

  const ProductCard = ({ product, showDiscount = false, showNew = false, showTrending = false }) => (
    <div className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 border border-gray-100 hover:border-transparent">
      <div className="relative">
        <div className="aspect-square overflow-hidden">
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
        </div>

        {showDiscount && product.discount > 0 && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
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
          <Link
            to={`/product/${product.slug || product._id}`}
            className="p-2.5 bg-white/90 backdrop-blur-xl rounded-full shadow-md hover:bg-white transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
          >
            <Eye className="w-5 h-5 text-gray-600 hover:text-blue-500 transition-colors" />
          </Link>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <button
          onClick={() => handleQuickAdd(product)}
          className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xl text-gray-800 py-3 px-4 rounded-xl font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white"
        >
          <ShoppingCart className="w-5 h-5" />
          {isInCart(product._id || product.id) ? 'In Cart' : 'Quick Add'}
        </button>
      </div>

      <div className="p-5">
        <Link to={`/product/${product.slug || product._id}`}>
          <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 text-base lg:text-lg">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
          ))}
          <span className="text-sm text-gray-500 ml-1">{product.rating}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl lg:text-2xl font-bold text-gray-900">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-400 line-through font-medium">₹{product.originalPrice.toLocaleString('en-IN')}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen overflow-hidden">

      {/* ==================== 1. HERO ==================== */}
      <section
        className="relative h-[75vh] sm:h-[82vh] md:h-[88vh] lg:h-[92vh] overflow-hidden"
        onMouseEnter={() => setIsHoveringSlide(true)}
        onMouseLeave={() => setIsHoveringSlide(false)}
      >
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20 z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 z-10" />
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover transition-transform duration-[10000ms] ease-out"
              style={{ transform: index === currentSlide ? 'scale(1.08)' : 'scale(1)' }}
            />
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${index === currentSlide ? 'opacity-100 translate-y-0 delay-200' : 'opacity-0 translate-y-12'}`}>

                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-xl px-5 py-2.5 rounded-full mb-5 md:mb-6 border border-white/25 shadow-lg">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-3 py-1 rounded-full text-[10px] md:text-xs font-black tracking-wider">{slide.badge}</span>
                    <Zap className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 animate-pulse" />
                    <span className="text-white/90 font-medium text-xs md:text-sm">{slide.tagline}</span>
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-3 md:mb-5 leading-[1.1] tracking-tight">
                    {slide.title.split(' ').map((word, i) => {
                      const isLast = i === slide.title.split(' ').length - 1;
                      const isSecond = i === 1;
                      return (
                        <span key={i} className={
                          isLast ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400' :
                          isSecond ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400' : ''
                        }>{word} </span>
                      );
                    })}
                  </h1>

                  {/* Subtitle */}
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mb-2 md:mb-3 font-light leading-relaxed">{slide.subtitle}</p>

                  {/* Description */}
                  <p className="text-sm md:text-base text-gray-400 mb-5 md:mb-7 max-w-2xl mx-auto leading-relaxed hidden sm:block">{slide.description}</p>

                  {/* Feature Pills */}
                  <div className="flex flex-wrap justify-center gap-2 mb-6 md:mb-8">
                    {slide.features.map((feat, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/15 text-white/90 px-3 py-1.5 rounded-full text-[10px] md:text-xs font-medium">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        {feat}
                      </span>
                    ))}
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                    <Link
                      to={slide.ctaLink}
                      className="group inline-flex items-center gap-2 md:gap-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-7 py-3.5 md:px-9 md:py-4 rounded-2xl text-sm md:text-lg font-bold hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25"
                    >
                      {slide.cta}
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <button className="inline-flex items-center gap-2 md:gap-3 bg-white/10 backdrop-blur-xl border border-white/30 text-white px-7 py-3.5 md:px-9 md:py-4 rounded-2xl text-sm md:text-lg font-semibold hover:bg-white/20 transition-all duration-300 hover:border-white/50">
                      <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="w-0 h-0 border-l-[7px] border-l-white border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent ml-0.5" />
                      </span>
                      Watch Video
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        ))}

        {/* Navigation Arrows */}
        <button onClick={prevSlide} className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 bg-white/15 backdrop-blur-xl hover:bg-white/30 p-2.5 md:p-4 rounded-full transition-all duration-300 z-30 group border border-white/20 hover:border-white/40">
          <ChevronLeft className="w-5 h-5 md:w-7 md:h-7 text-white group-hover:scale-110 transition-transform" />
        </button>
        <button onClick={nextSlide} className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 bg-white/15 backdrop-blur-xl hover:bg-white/30 p-2.5 md:p-4 rounded-full transition-all duration-300 z-30 group border border-white/20 hover:border-white/40">
          <ChevronRight className="w-5 h-5 md:w-7 md:h-7 text-white group-hover:scale-110 transition-transform" />
        </button>

        {/* Bottom Dots + Counter + Scroll Indicator */}
        <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 md:gap-3 z-30">
          {/* Slide Counter */}
          <div className="bg-white/10 backdrop-blur-xl rounded-full border border-white/20 px-4 py-1.5 flex items-center gap-3">
            <span className="text-white font-black text-sm md:text-base">{String(currentSlide + 1).padStart(2, '0')}</span>
            <div className="w-16 md:w-24 h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-700" style={{ width: `${((currentSlide + 1) / HERO_SLIDES.length) * 100}%` }} />
            </div>
            <span className="text-white/50 text-xs md:text-sm">{String(HERO_SLIDES.length).padStart(2, '0')}</span>
          </div>
          {/* Dots */}
          <div className="flex gap-1.5 md:gap-2">
            {HERO_SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`rounded-full transition-all duration-500 ${
                  index === currentSlide
                    ? 'bg-white w-6 md:w-10 h-2 md:h-2.5 shadow-lg shadow-white/30'
                    : 'bg-white/30 hover:bg-white/50 w-2 md:w-2.5 h-2 md:h-2.5'
                }`}
              />
            ))}
          </div>
          <div className="animate-bounce mt-0.5">
            <ChevronLeft className="w-3.5 h-3.5 md:w-4 md:h-4 text-white/40 rotate-[-90deg]" />
          </div>
        </div>
      </section>

      {/* ==================== 2. FEATURED PRODUCTS ==================== */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-rose-50/60 via-amber-50/40 to-violet-50/50 relative" data-section="featured">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Handpicked for You"
            title="Featured Electronics"
            subtitle="Discover our curated selection of premium electronics with unbeatable deals"
            gradient="from-blue-600 to-purple-600"
            icon={Sparkles}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {loading.featured
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : featured.length > 0
                ? featured.map((product) => (
                    <ProductCard key={product._id} product={product} showDiscount />
                  ))
                : <p className="col-span-full text-center text-gray-400 py-12">No featured products available</p>
            }
          </div>
        </div>
      </section>

      {/* ==================== 3. BRAND SHOWCASE ==================== */}
      <section className="py-10 md:py-16 bg-gradient-to-b from-slate-50/80 to-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Our Partners"
            title="Popular Brands"
            subtitle="Shop from the world's most trusted electronics brands"
            gradient="from-purple-600 to-pink-600"
            icon={Award}
          />
        </div>
        <div className="relative mt-8">
          <div
            className="flex gap-4 md:gap-5 animate-scroll"
            style={{ width: 'max-content' }}
          >
            {[...BRANDS, ...BRANDS].map((brand, index) => (
              <Link
                key={`${brand.name}-${index}`}
                to={`/products?brand=${brand.name.toLowerCase()}`}
                className="group flex flex-col items-center justify-center p-4 md:p-6 rounded-xl border border-gray-100 hover:border-purple-200 bg-white hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex-shrink-0 w-[140px] md:w-[170px]"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-3 rounded-xl bg-white group-hover:scale-110 transition-transform duration-300">
                  {brand.logo ? (
                    <img src={brand.logo} alt={`${brand.name} logo`} className="w-12 h-12 md:w-14 md:h-14 object-contain" />
                  ) : (
                    <span className="text-gray-600 font-bold text-2xl md:text-3xl">{brand.initials}</span>
                  )}
                </div>
                <span className="font-semibold text-gray-700 text-xs md:text-sm group-hover:text-purple-600 transition-colors text-center leading-tight">{brand.name}</span>
              </Link>
            ))}
          </div>
          <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
          <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
        </div>
        <style>{`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-scroll {
            animation: scroll 30s linear infinite;
          }
          .animate-scroll:hover {
            animation-play-state: paused;
          }
          @media (max-width: 640px) {
            .animate-scroll {
              animation-duration: 20s;
            }
          }
        `}</style>
      </section>

      {/* ==================== 4. CATEGORIES ==================== */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#0c1222] via-[#131b33] to-[#0f172a] text-white relative overflow-hidden" data-section="categories">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 md:mb-14">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl px-5 py-2.5 rounded-full mb-6 border border-white/20">
              <Package className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 font-semibold text-sm">Browse by Category</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Shop by Category</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Find exactly what you're looking for across our diverse collection</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {loading.categories
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCategoryCard key={i} />)
              : categories.map((category) => (
                  <Link
                    key={category.name}
                    to={`/products?category=${category.slug}`}
                    className="group relative rounded-3xl p-4 md:p-6 text-center hover:scale-105 transition-all duration-500 cursor-pointer overflow-hidden bg-gradient-to-br border border-white/10 hover:border-white/30"
                    style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.bgGradient}`} />
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative text-4xl md:text-5xl mb-3 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                      {category.icon}
                    </div>
                    <h3 className="font-bold text-base md:text-lg mb-1 relative">{category.name}</h3>
                    <p className="text-xs md:text-sm text-gray-400">{category.productCount} Products</p>
                  </Link>
                ))
            }
          </div>
        </div>
      </section>

      {/* ==================== 5. LATEST ARRIVALS ==================== */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-cyan-50/50 via-white to-emerald-50/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Just Dropped"
            title="Latest Arrivals"
            subtitle="Be the first to experience the newest tech innovations"
            gradient="from-green-600 to-emerald-600"
            icon={Zap}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {loading.latest
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : latest.length > 0
                ? latest.map((product) => (
                    <ProductCard key={product._id} product={product} showNew />
                  ))
                : <p className="col-span-full text-center text-gray-400 py-12">No new arrivals yet</p>
            }
          </div>
        </div>
      </section>

      {/* ==================== 6. FLASH SALE ==================== */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-rose-600 via-orange-500 to-amber-500 text-white relative overflow-hidden" data-section="flashsale">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 md:mb-14">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xl px-5 py-2.5 rounded-full mb-6">
              <Zap className="w-5 h-5 text-yellow-300 animate-pulse" />
              <span className="text-white font-semibold text-sm">Hurry Up!</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 flex items-center justify-center gap-3">
              <Zap className="w-8 h-8 md:w-10 md:h-10" />
              Flash Sale
            </h2>
            <p className="text-lg md:text-xl mb-8 md:mb-10 text-white/90">Limited time offers — Don't miss out!</p>
            <div className="flex justify-center gap-3 md:gap-6 mb-8 md:mb-10">
              {timeLeft.map((item, i) => (
                <div key={i} className="bg-white/20 backdrop-blur-xl rounded-2xl p-3 md:p-6 min-w-[64px] md:min-w-[100px]">
                  <div className="text-2xl md:text-5xl font-bold tabular-nums">{item.value}</div>
                  <div className="text-xs md:text-base text-white/80">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {loading.featured
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : featured.slice(0, 4).length > 0
                ? featured.slice(0, 4).map((product) => (
                    <ProductCard key={product._id} product={product} showDiscount />
                  ))
                : <p className="col-span-full text-center text-white/60 py-12">No flash sale products right now</p>
            }
          </div>
        </div>
      </section>

      {/* ==================== 8. TRENDING ==================== */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-amber-50/40 via-orange-50/30 to-rose-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Everyone's Talking About"
            title="Trending Now"
            subtitle="Hot products that are taking the market by storm"
            gradient="from-orange-600 to-red-600"
            icon={TrendingUp}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {loading.trending
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : trending.length > 0
                ? trending.map((product) => (
                    <ProductCard key={product._id} product={product} showTrending />
                  ))
                : <p className="col-span-full text-center text-gray-400 py-12">No trending products yet</p>
            }
          </div>
        </div>
      </section>

      {/* ==================== 9. MEGA DISCOUNT ==================== */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#0a0f24] via-[#1a1450] to-[#0d1333] text-white relative overflow-hidden" data-section="megadiscount">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(120,119,198,0.2),transparent_50%)]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl px-5 py-2.5 rounded-full mb-6 border border-white/20">
              <Percent className="w-5 h-5 text-purple-400" />
              <span className="text-purple-400 font-semibold text-sm">Special Offer</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
              Mega Discount Season
            </h2>
            <p className="text-xl md:text-2xl text-purple-200 mb-4">Get up to 70% off on selected items</p>
            <p className="text-lg md:text-xl text-purple-300 mb-8 md:mb-10">
              Use code: <span className="font-bold text-white bg-white/20 px-5 py-1.5 rounded-xl">TECH70</span>
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-3 bg-white text-indigo-900 px-8 py-4 md:px-10 md:py-5 rounded-2xl text-lg md:text-xl font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              Shop Sale Items
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== TRUST STRIP ==================== */}
      <section className="py-12 md:py-16 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Truck, title: "Free Shipping", desc: "On orders over ₹500" },
              { icon: Shield, title: "Secure Payment", desc: "100% secure transactions" },
              { icon: Headphones, title: "24/7 Support", desc: "Dedicated customer service" }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-gray-100 hover:shadow-lg hover:border-blue-100 transition-all duration-300 group">
                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                  <item.icon className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-base">{item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 15. CUSTOMER STATS ==================== */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50/80 via-blue-50/40 to-indigo-50/30 relative" data-section="stats">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: Package, value: 50000, suffix: "+", label: "Products", color: "from-blue-500 to-blue-600" },
              { icon: Users, value: 100000, suffix: "+", label: "Happy Customers", color: "from-purple-500 to-purple-600" },
              { icon: Star, value: 4.8, suffix: "", label: "Average Rating", color: "from-yellow-500 to-orange-500", isDecimal: true },
              { icon: Award, value: 10, suffix: "+", label: "Years Experience", color: "from-green-500 to-emerald-500" }
            ].map((stat, idx) => (
              <StatCounter key={idx} stat={stat} startCounting={visibleSections.has('stats')} idx={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 16. WHY CHOOSE US ==================== */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50/40 via-indigo-50/30 to-violet-50/40" data-section="whychoose">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Top Rated"
            title="Why Choose Us"
            subtitle="We go the extra mile to make your shopping experience exceptional"
            gradient="from-yellow-600 to-amber-600"
            icon={ThumbsUp}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: BadgeCheck, title: "Genuine Products", desc: "100% authentic products with manufacturer warranty", color: "from-blue-500 to-indigo-500" },
              { icon: RefreshCw, title: "Easy Returns", desc: "30-day hassle-free return and exchange policy", color: "from-green-500 to-emerald-500" },
              { icon: CircleDollarSign, title: "Best Prices", desc: "Price match guarantee on all electronics", color: "from-purple-500 to-violet-500" },
              { icon: Wallet, title: "EMI Options", desc: "No-cost EMI on all major credit cards", color: "from-orange-500 to-red-500" }
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-transparent transform hover:-translate-y-2 group"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm md:text-base">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 17. TESTIMONIALS ==================== */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-purple-50/50 via-fuchsia-50/30 to-pink-50/40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-14">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 px-5 py-2.5 rounded-full mb-6">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <span className="text-blue-600 font-semibold text-sm">What Our Customers Say</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              Trusted by{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Thousands</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Real reviews from real customers who love shopping with us</p>
          </div>
        </div>
        <div className="relative">
          <div
            className="flex gap-6 md:gap-8 animate-testimonial-scroll"
            style={{ width: 'max-content' }}
          >
            {[...TESTIMONIALS, ...TESTIMONIALS].map((testimonial, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 md:p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 flex-shrink-0 w-[300px] md:w-[380px]">
                <div className="flex items-center mb-4 md:mb-6">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-14 h-14 md:w-16 md:h-16 rounded-full mr-4 ring-4 ring-blue-100 object-cover" />
                  <div>
                    <h4 className="font-bold text-base md:text-lg text-gray-900">{testimonial.name}</h4>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic text-sm md:text-base leading-relaxed">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
          <div className="absolute inset-y-0 left-0 w-20 md:w-40 bg-gradient-to-r from-purple-50 to-transparent pointer-events-none z-10" />
          <div className="absolute inset-y-0 right-0 w-20 md:w-40 bg-gradient-to-l from-purple-50 to-transparent pointer-events-none z-10" />
        </div>
        <style>{`
          @keyframes testimonialScroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-testimonial-scroll {
            animation: testimonialScroll 40s linear infinite;
          }
          .animate-testimonial-scroll:hover {
            animation-play-state: paused;
          }
          @media (max-width: 640px) {
            .animate-testimonial-scroll {
              animation-duration: 25s;
            }
          }
        `}</style>
      </section>

      {/* ==================== NEWSLETTER ==================== */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#1e40af] via-[#7c3aed] to-[#db2777] text-white relative overflow-hidden" data-section="newsletter">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Mail className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-6 animate-bounce" />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Stay Updated</h2>
          <p className="text-lg md:text-xl mb-8 md:mb-10 text-white/90">Subscribe to get exclusive offers and new product updates</p>
          <form
            className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
            onSubmit={(e) => {
              e.preventDefault();
              if (email) {
                toast.success('Subscribed successfully!');
                setEmail('');
              }
            }}
          >
            <input
              type="email"
              id="newsletter-email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-2xl text-gray-800 focus:outline-none focus:ring-4 focus:ring-white/30 text-base md:text-lg shadow-xl"
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

      {/* Back to Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 animate-bounce"
        >
          <ChevronLeft className="w-5 h-5 rotate-90" />
        </button>
      )}

      {/* Scroll Reveal Styles */}
        <style>{`
        [data-section] {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
        }
        [data-section].visible {
          opacity: 1;
          transform: translateY(0);
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
