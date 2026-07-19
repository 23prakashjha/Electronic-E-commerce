import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCart, Heart, Star, Zap, TrendingUp, Award, Percent,
  Sparkles, ArrowRight, Package, CheckCircle, Mail, Headphones,
  Shield, Truck, ChevronLeft, ChevronRight, Eye, Clock, Users,
  Repeat, CreditCard, Gift, ShieldCheck, BookOpen, Smartphone,
  Share2, LayoutGrid, Timer, ThumbsUp, Wallet,
  BadgeCheck, CircleDollarSign, RefreshCw, MessageSquare, MapPin,
  HelpCircle, Tag, Store, Camera
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

const API_BASE = 'http://localhost:5000/api';

const HERO_SLIDES = [
  {
    id: 1,
    title: "Summer Electronics Sale",
    subtitle: "Up to 50% Off on Smartphones & Laptops",
    image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=1400&h=700&fit=crop",
    cta: "Shop Now",
    ctaLink: "/products"
  },
  {
    id: 2,
    title: "New Gaming Consoles",
    subtitle: "Latest PS5 & Xbox Series X Available",
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=1400&h=700&fit=crop",
    cta: "Explore Games",
    ctaLink: "/products?category=gaming"
  },
  {
    id: 3,
    title: "Smart Home Revolution",
    subtitle: "Transform Your Home with Smart Devices",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&h=700&fit=crop",
    cta: "Discover More",
    ctaLink: "/products?category=smart-home"
  }
];

const FALLBACK_FEATURED = [
  { _id: "f1", name: "iPhone 15 Pro", price: 999, originalPrice: 1199, images: ["https://images.unsplash.com/photo-1592286115803-a1c3b552ee43?w=400&h=400&fit=crop"], ratings: { average: 4.8 }, discount: 17 },
  { _id: "f2", name: "MacBook Air M2", price: 1099, originalPrice: 1299, images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop"], ratings: { average: 4.9 }, discount: 15 },
  { _id: "f3", name: "AirPods Pro", price: 199, originalPrice: 249, images: ["https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=400&h=400&fit=crop"], ratings: { average: 4.7 }, discount: 20 },
  { _id: "f4", name: "iPad Air", price: 599, originalPrice: 749, images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop"], ratings: { average: 4.8 }, discount: 20 }
];

const FALLBACK_LATEST = [
  { _id: "l1", name: "Samsung Galaxy S24", price: 899, images: ["https://images.unsplash.com/photo-1610945415295-d9bbf067e597?w=400&h=400&fit=crop"], ratings: { average: 4.7 }, isNew: true },
  { _id: "l2", name: "Sony WH-1000XM5", price: 399, images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"], ratings: { average: 4.8 }, isNew: true },
  { _id: "l3", name: "Apple Watch Ultra", price: 799, images: ["https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400&h=400&fit=crop"], ratings: { average: 4.9 }, isNew: true },
  { _id: "l4", name: "Google Pixel 8", price: 699, images: ["https://images.unsplash.com/photo-1592286115803-a1c3b552ee43?w=400&h=400&fit=crop"], ratings: { average: 4.6 }, isNew: true }
];

const FALLBACK_TRENDING = [
  { _id: "t1", name: "DJI Mini 3 Pro", price: 759, images: ["https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=400&fit=crop"], ratings: { average: 4.8 }, trending: true },
  { _id: "t2", name: "Nintendo Switch", price: 299, images: ["https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop"], ratings: { average: 4.7 }, trending: true },
  { _id: "t3", name: "GoPro Hero 12", price: 399, images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"], ratings: { average: 4.6 }, trending: true },
  { _id: "t4", name: "Kindle Oasis", price: 249, images: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop"], ratings: { average: 4.5 }, trending: true }
];

const FALLBACK_CATEGORIES = [
  { name: "Smartphones", slug: "smartphones", icon: "📱", productCount: 245, color: "from-blue-500 to-blue-600", bgGradient: "from-blue-500/20 to-blue-600/10" },
  { name: "Laptops", slug: "laptops", icon: "💻", productCount: 89, color: "from-purple-500 to-purple-600", bgGradient: "from-purple-500/20 to-purple-600/10" },
  { name: "Headphones", slug: "headphones", icon: "🎧", productCount: 156, color: "from-green-500 to-green-600", bgGradient: "from-green-500/20 to-green-600/10" },
  { name: "Cameras", slug: "cameras", icon: "📷", productCount: 67, color: "from-red-500 to-red-600", bgGradient: "from-red-500/20 to-red-600/10" },
  { name: "Gaming", slug: "gaming", icon: "🎮", productCount: 134, color: "from-indigo-500 to-indigo-600", bgGradient: "from-indigo-500/20 to-indigo-600/10" },
  { name: "Smart Home", slug: "smart-home", icon: "🏠", productCount: 98, color: "from-yellow-500 to-yellow-600", bgGradient: "from-yellow-500/20 to-yellow-600/10" }
];

const TESTIMONIALS = [
  { name: "John Doe", rating: 5, text: "Amazing products and excellent customer service! Will definitely shop again.", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" },
  { name: "Jane Smith", rating: 5, text: "Fast delivery and authentic products. The best electronics store online!", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop" },
  { name: "Mike Johnson", rating: 4, text: "Great prices and quality products. The return process is also very smooth.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" }
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

const DEAL_PRODUCTS = [
  { id: "d1", name: "MacBook Air M2", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop", originalPrice: 1299, dealPrice: 749, discount: 42, rating: 4.8, reviews: 2847, badge: "Staff Pick" },
  { id: "d2", name: "Sony WH-1000XM5", image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop", originalPrice: 399, dealPrice: 229, discount: 43, rating: 4.7, reviews: 1532, badge: "Best Seller" },
  { id: "d3", name: "Samsung Galaxy S24", image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop", originalPrice: 999, dealPrice: 649, discount: 35, rating: 4.6, reviews: 3120, badge: "Hot Deal" },
  { id: "d4", name: "iPad Pro 12.9\"", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop", originalPrice: 1099, dealPrice: 799, discount: 27, rating: 4.8, reviews: 1894, badge: "Limited" },
  { id: "d5", name: "PS5 Console Bundle", image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop", originalPrice: 549, dealPrice: 429, discount: 22, rating: 4.9, reviews: 4201, badge: "Almost Gone" },
  { id: "d6", name: "Dell XPS 15", image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=400&fit=crop", originalPrice: 1499, dealPrice: 1099, discount: 27, rating: 4.5, reviews: 987, badge: "Flash Sale" },
  { id: "d7", name: "Apple Watch Ultra 2", image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop", originalPrice: 799, dealPrice: 549, discount: 31, rating: 4.7, reviews: 1456, badge: "Top Rated" },
  { id: "d8", name: "Bose QuietComfort 45", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop", originalPrice: 329, dealPrice: 199, discount: 40, rating: 4.6, reviews: 2103, badge: "Staff Pick" }
];

const BUNDLE_DEALS = [
  {
    id: "b1",
    name: "Work From Home Essentials",
    items: ["MacBook Air M2", "Magic Mouse", "USB-C Hub"],
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=400&fit=crop",
    originalPrice: 1447,
    bundlePrice: 1199,
    discount: 17
  },
  {
    id: "b2",
    name: "Gamer Starter Pack",
    items: ["Gaming Headset", "Mechanical Keyboard", "Gaming Mouse"],
    image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=500&h=400&fit=crop",
    originalPrice: 447,
    bundlePrice: 299,
    discount: 33
  },
  {
    id: "b3",
    name: "Smart Home Starter",
    items: ["Echo Dot", "Smart Bulb Pack", "Smart Plug"],
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop",
    originalPrice: 247,
    bundlePrice: 179,
    discount: 28
  }
];

const BLOG_POSTS = [
  {
    id: "bp1",
    title: "Top 10 Gadgets That Will Define 2026",
    excerpt: "From AI-powered wearables to foldable laptops, these are the must-watch tech trends this year.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop",
    category: "Trending",
    date: "Jul 15, 2026",
    readTime: "5 min read"
  },
  {
    id: "bp2",
    title: "How to Choose the Perfect Laptop",
    excerpt: "A complete buyer's guide covering performance, battery life, display quality, and more.",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop",
    category: "Guides",
    date: "Jul 12, 2026",
    readTime: "8 min read"
  },
  {
    id: "bp3",
    title: "Smart Home Automation on a Budget",
    excerpt: "Build your dream smart home without breaking the bank. Tips, tricks, and product picks inside.",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=600&h=400&fit=crop",
    category: "Tips",
    date: "Jul 10, 2026",
    readTime: "6 min read"
  }
];

const SOCIAL_POSTS = [
  { id: "s1", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop" },
  { id: "s2", image: "https://images.unsplash.com/photo-1585298723682-7115561c51b7?w=300&h=300&fit=crop" },
  { id: "s3", image: "https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=300&h=300&fit=crop" },
  { id: "s4", image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop" },
  { id: "s5", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop" },
  { id: "s6", image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=300&h=300&fit=crop" }
];

const COMPARISON_PRODUCTS = [
  {
    name: "iPhone 15 Pro",
    image: "https://images.unsplash.com/photo-1592286115803-a1c3b552ee43?w=300&h=300&fit=crop",
    price: 999,
    rating: 4.8,
    specs: { display: '6.1" OLED', chip: 'A17 Pro', ram: '8 GB', storage: '256 GB', battery: '3274 mAh', camera: '48 MP' }
  },
  {
    name: "Samsung Galaxy S24",
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e597?w=300&h=300&fit=crop",
    price: 899,
    rating: 4.7,
    specs: { display: '6.2" AMOLED', chip: 'Snapdragon 8 Gen 3', ram: '8 GB', storage: '256 GB', battery: '4000 mAh', camera: '50 MP' }
  },
  {
    name: "Google Pixel 8 Pro",
    image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=300&h=300&fit=crop",
    price: 849,
    rating: 4.6,
    specs: { display: '6.7" LTPO OLED', chip: 'Tensor G3', ram: '12 GB', storage: '128 GB', battery: '5050 mAh', camera: '50 MP' }
  }
];

const WARRANTY_PLANS = [
  {
    name: "Basic",
    price: 49,
    period: "1 Year",
    features: ["Manufacturing Defects", "1 Year Coverage", "Online Support", "Basic Replacement"],
    color: "from-blue-500 to-blue-600",
    popular: false
  },
  {
    name: "Standard",
    price: 99,
    period: "2 Years",
    features: ["All Basic Features", "Accidental Damage", "Priority Support", "Free Home Pickup", "Extended Replacement"],
    color: "from-purple-500 to-pink-500",
    popular: true
  },
  {
    name: "Premium",
    price: 179,
    period: "3 Years",
    features: ["All Standard Features", "Liquid Damage", "Theft Protection", "24/7 VIP Support", "Express Replacement", "Annual Maintenance"],
    color: "from-orange-500 to-red-500",
    popular: false
  }
];

const GIFT_CARDS = [
  { amount: 25, color: "from-emerald-400 to-teal-500", label: "Starter" },
  { amount: 50, color: "from-blue-400 to-indigo-500", label: "Popular" },
  { amount: 100, color: "from-purple-400 to-pink-500", label: "Premium" },
  { amount: 200, color: "from-orange-400 to-red-500", label: "Ultimate" }
];

const normalizeProduct = (p) => ({
  _id: p._id,
  id: p._id,
  name: p.name,
  price: p.price,
  originalPrice: p.originalPrice || p.price,
  image: p.images?.[0] || p.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
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

const useDealOfTheDayTimer = () => {
  const [timeLeft, setTimeLeft] = useState(() => {
    const now = new Date();
    const end = new Date(now);
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

  const hours = Math.floor((timeLeft % 86400) / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return [
    { value: String(hours).padStart(2, '0'), label: 'Hours' },
    { value: String(minutes).padStart(2, '0'), label: 'Minutes' },
    { value: String(seconds).padStart(2, '0'), label: 'Seconds' }
  ];
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

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHoveringSlide, setIsHoveringSlide] = useState(false);
  const [email, setEmail] = useState('');
  const { addToCart, isInCart } = useCart();

  const [featured, setFeatured] = useState([]);
  const [latest, setLatest] = useState([]);
  const [trending, setTrending] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState({ featured: true, latest: true, trending: true, categories: true });

  const timeLeft = useFlashSaleTimer();
  const dealTimeLeft = useDealOfTheDayTimer();

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
          setFeatured((data.products || data.data || data || []).slice(0, 4).map(normalizeProduct));
        } else {
          setFeatured(FALLBACK_FEATURED.map(normalizeProduct));
        }

        if (latestRes.status === 'fulfilled' && latestRes.value.ok) {
          const data = await latestRes.value.json();
          setLatest((data.products || data.data || data || []).slice(0, 4).map(normalizeProduct));
        } else {
          setLatest(FALLBACK_LATEST.map(normalizeProduct));
        }

        if (trendRes.status === 'fulfilled' && trendRes.value.ok) {
          const data = await trendRes.value.json();
          setTrending((data.products || data.data || data || []).slice(0, 4).map(normalizeProduct));
        } else {
          setTrending(FALLBACK_TRENDING.map(normalizeProduct));
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
          setCategories(cats.length > 0 ? cats : FALLBACK_CATEGORIES);
        } else {
          setCategories(FALLBACK_CATEGORIES);
        }
      } catch {
        setFeatured(FALLBACK_FEATURED.map(normalizeProduct));
        setLatest(FALLBACK_LATEST.map(normalizeProduct));
        setTrending(FALLBACK_TRENDING.map(normalizeProduct));
        setCategories(FALLBACK_CATEGORIES);
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

  const SectionHeader = ({ badge, title, subtitle, gradient, icon: Icon }) => (
    <div className="text-center mb-12 md:mb-14">
      <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${badge} px-4 py-2 rounded-full mb-4`}>
        {Icon && <Icon className="w-5 h-5" />}
        <span className="font-semibold text-sm">
          {badge.includes('blue') ? 'Handpicked for You' : badge.includes('green') ? 'Just Dropped' : badge.includes('orange') ? "Everyone's Talking About" : badge.includes('purple') ? 'Our Partners' : badge.includes('red') ? 'Limited Offers' : badge.includes('teal') ? 'Rewards' : badge.includes('pink') ? 'Exclusive' : badge.includes('yellow') ? 'Top Rated' : badge.includes('indigo') ? 'Read & Learn' : badge.includes('rose') ? 'Stay Connected' : ''}
        </span>
      </div>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
        {title.split(' ').slice(0, -1).join(' ')}{' '}
        <span className={`text-transparent bg-clip-text bg-gradient-to-r ${gradient}`}>{title.split(' ').pop()}</span>
      </h2>
      <p className="text-gray-600 text-lg max-w-2xl mx-auto">{subtitle}</p>
    </div>
  );

  const ProductCard = ({ product, showDiscount = false, showNew = false, showTrending = false }) => (
    <div className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 border border-gray-100 hover:border-transparent">
      <div className="relative">
        <div className="aspect-square overflow-hidden">
          <img
            src={product.image}
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
            <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ${product.price}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-400 line-through font-medium">${product.originalPrice}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* ==================== 1. HERO ==================== */}
      <section
        className="relative h-[70vh] sm:h-[80vh] md:h-[85vh] lg:h-[90vh] overflow-hidden"
        onMouseEnter={() => setIsHoveringSlide(true)}
        onMouseLeave={() => setIsHoveringSlide(false)}
      >
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 z-10" />
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover transition-transform duration-[8000ms] ease-out"
              style={{ transform: index === currentSlide ? 'scale(1.05)' : 'scale(1)' }}
            />
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className={`max-w-3xl text-center mx-auto transition-all duration-700 ${index === currentSlide ? 'opacity-100 translate-y-0 delay-300' : 'opacity-0 translate-y-8'}`}>
                  <div className="inline-flex items-center justify-center gap-2 bg-white/20 backdrop-blur-xl px-4 py-2 rounded-full mb-4 md:mb-6 border border-white/30">
                    <Zap className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 animate-pulse" />
                    <span className="text-white font-medium text-sm md:text-base">Limited Time Offer</span>
                  </div>
                  <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight">
                    {slide.title.split(' ').map((word, i) => (
                      <span key={i} className={`${i === slide.title.split(' ').length - 1 ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400' : ''}`}>{word} </span>
                    ))}
                  </h1>
                  <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-6 md:mb-8 font-light">{slide.subtitle}</p>
                  <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                    <Link
                      to={slide.ctaLink}
                      className="inline-flex items-center gap-2 md:gap-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-2xl text-base md:text-lg font-bold hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-2xl"
                    >
                      {slide.cta}
                      <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
                    </Link>
                    <button className="inline-flex items-center gap-2 md:gap-3 bg-white/10 backdrop-blur-xl border border-white/30 text-white px-6 py-3 md:px-8 md:py-4 rounded-2xl text-base md:text-lg font-semibold hover:bg-white/20 transition-all duration-300">
                      Watch Video
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button onClick={prevSlide} className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-xl hover:bg-white/30 p-2.5 md:p-4 rounded-full transition-all duration-300 z-30 group">
          <ChevronLeft className="w-5 h-5 md:w-8 md:h-8 text-white group-hover:scale-110 transition-transform" />
        </button>
        <button onClick={nextSlide} className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-xl hover:bg-white/30 p-2.5 md:p-4 rounded-full transition-all duration-300 z-30 group">
          <ChevronRight className="w-5 h-5 md:w-8 md:h-8 text-white group-hover:scale-110 transition-transform" />
        </button>

        <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 z-30">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-500 ${index === currentSlide ? 'bg-white w-10 md:w-16' : 'bg-white/40 hover:bg-white/60 w-6 md:w-8'}`}
            />
          ))}
        </div>
      </section>

      {/* ==================== 2. FEATURED PRODUCTS ==================== */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 via-white to-purple-50/30 relative">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="from-blue-100 to-purple-100"
            title="Featured Electronics"
            subtitle="Discover our curated selection of premium electronics with unbeatable deals"
            gradient="from-blue-600 to-purple-600"
            icon={Sparkles}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {loading.featured
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : featured.map((product) => (
                  <ProductCard key={product._id} product={product} showDiscount />
                ))
            }
          </div>
        </div>
      </section>

      {/* ==================== 3. BRAND SHOWCASE ==================== */}
      <section className="py-10 md:py-16 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="from-purple-100 to-pink-100"
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
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
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
      <section className="py-16 md:py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="from-green-100 to-emerald-100"
            title="Latest Arrivals"
            subtitle="Be the first to experience the newest tech innovations"
            gradient="from-green-600 to-emerald-600"
            icon={Zap}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {loading.latest
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : latest.map((product) => (
                  <ProductCard key={product._id} product={product} showNew />
                ))
            }
          </div>
        </div>
      </section>

      {/* ==================== 6. BUNDLE DEALS ==================== */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="from-red-100 to-orange-100"
            title="Bundle Deals"
            subtitle="Save big when you buy together — exclusive combo offers"
            gradient="from-red-600 to-orange-600"
            icon={Tag}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {BUNDLE_DEALS.map((bundle) => (
              <div
                key={bundle.id}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-red-200 transform hover:-translate-y-2"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={bundle.image}
                    alt={bundle.name}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    Save {bundle.discount}%
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-red-600 transition-colors">{bundle.name}</h3>
                  <div className="space-y-2 mb-4">
                    {bundle.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">${bundle.bundlePrice}</span>
                    <span className="text-gray-400 line-through text-lg">${bundle.originalPrice}</span>
                  </div>
                  <button
                    onClick={() => toast.success(`${bundle.name} bundle added!`)}
                    className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 rounded-xl font-bold hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Get Bundle
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 7. FLASH SALE ==================== */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-red-600 via-orange-500 to-yellow-500 text-white relative overflow-hidden">
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
              : featured.slice(0, 4).map((product) => (
                  <ProductCard key={product._id} product={product} showDiscount />
                ))
            }
          </div>
        </div>
      </section>

      {/* ==================== 8. TRENDING ==================== */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="from-orange-100 to-red-100"
            title="Trending Now"
            subtitle="Hot products that are taking the market by storm"
            gradient="from-orange-600 to-red-600"
            icon={TrendingUp}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {loading.trending
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : trending.map((product) => (
                  <ProductCard key={product._id} product={product} showTrending />
                ))
            }
          </div>
        </div>
      </section>

      {/* ==================== 9. DEAL OF THE DAY ==================== */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-yellow-500/20 backdrop-blur-xl px-5 py-2.5 rounded-full mb-6 border border-yellow-500/30">
              <Clock className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-semibold text-sm">Expires Today!</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Deal of the Day</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">Hurry up! These deals expire at midnight</p>
            <div className="flex justify-center gap-3 md:gap-4">
              {dealTimeLeft.map((item, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-xl rounded-2xl px-5 py-3 md:px-6 md:py-4 text-center border border-white/10">
                  <div className="text-2xl md:text-3xl font-bold tabular-nums">{item.value}</div>
                  <div className="text-xs text-gray-400 mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {DEAL_PRODUCTS.map((product) => (
              <div key={product.id} className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:border-yellow-400/50 hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-1 group">
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                    {product.discount}% OFF
                  </div>
                  <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {product.badge}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-white text-sm md:text-base mb-2 line-clamp-1">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-500'}`} />
                    ))}
                    <span className="text-gray-400 text-xs ml-1">({product.reviews.toLocaleString()})</span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl font-bold text-yellow-400">${product.dealPrice}</span>
                    <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
                  </div>
                  <button
                    onClick={() => toast.success(`${product.name} added to cart!`)}
                    className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 py-2.5 rounded-xl font-bold text-sm hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 10. TOP PICKS COMPARISON ==================== */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="from-indigo-100 to-blue-100"
            title="Compare Top Picks"
            subtitle="Side-by-side comparison of our best flagship phones"
            gradient="from-indigo-600 to-blue-600"
            icon={LayoutGrid}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {COMPARISON_PRODUCTS.map((product, idx) => (
              <div
                key={idx}
                className={`bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border ${idx === 1 ? 'border-indigo-200 ring-2 ring-indigo-100 md:scale-[1.02]' : 'border-gray-100'} transform hover:-translate-y-2`}
              >
                {idx === 1 && (
                  <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-center py-2 text-sm font-bold">
                    BEST VALUE
                  </div>
                )}
                <div className="p-6">
                  <div className="flex justify-center mb-6">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-32 h-32 object-cover rounded-2xl"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 text-center mb-2">{product.name}</h3>
                  <div className="flex items-center justify-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    ))}
                    <span className="text-sm text-gray-500 ml-1">{product.rating}</span>
                  </div>
                  <div className="text-center mb-6">
                    <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">${product.price}</span>
                  </div>
                  <div className="space-y-3 mb-6">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                        <span className="text-gray-500 text-sm capitalize">{key}</span>
                        <span className="font-semibold text-gray-800 text-sm">{value}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => toast.success(`${product.name} added to cart!`)}
                    className={`w-full py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 ${idx === 1 ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white hover:from-indigo-600 hover:to-blue-600 shadow-lg' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 11. MEGA DISCOUNT ==================== */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white relative overflow-hidden">
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

      {/* ==================== 12. GIFT CARDS ==================== */}
      <section className="py-16 md:py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="from-teal-100 to-green-100"
            title="Gift Cards"
            subtitle="Give the gift of choice — perfect for any occasion"
            gradient="from-teal-600 to-green-600"
            icon={Gift}
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {GIFT_CARDS.map((card) => (
              <div
                key={card.amount}
                className={`group relative bg-gradient-to-br ${card.color} rounded-3xl p-6 md:p-8 text-white cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl overflow-hidden`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-6 -translate-x-6" />
                <div className="relative z-10">
                  <span className="text-xs font-semibold uppercase tracking-wider opacity-80">{card.label}</span>
                  <div className="flex items-center gap-1 mt-2 mb-4">
                    <span className="text-4xl md:text-5xl font-bold">${card.amount}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-6">
                    <Gift className="w-4 h-4 opacity-80" />
                    <span className="text-sm opacity-80">Gift Card</span>
                  </div>
                  <button className="w-full bg-white/20 backdrop-blur-xl hover:bg-white/30 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 border border-white/20">
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 13. WARRANTY & PROTECTION ==================== */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 via-white to-purple-50/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="from-blue-100 to-cyan-100"
            title="Protection Plans"
            subtitle="Keep your devices safe with our extended warranty options"
            gradient="from-blue-600 to-cyan-600"
            icon={ShieldCheck}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {WARRANTY_PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border ${plan.popular ? 'border-purple-200 ring-2 ring-purple-100 md:scale-[1.02]' : 'border-gray-100'} transform hover:-translate-y-2`}
              >
                {plan.popular && (
                  <div className={`bg-gradient-to-r ${plan.color} text-white text-center py-2.5 text-sm font-bold`}>
                    MOST POPULAR
                  </div>
                )}
                <div className="p-6 md:p-8">
                  <div className={`w-14 h-14 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mb-6`}>
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">{plan.name}</h3>
                  <p className="text-gray-500 text-sm mb-4">{plan.period} Coverage</p>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">${plan.price}</span>
                    <span className="text-gray-400">/{plan.period}</span>
                  </div>
                  <div className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => toast.success(`${plan.name} plan selected!`)}
                    className={`w-full py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-[1.02] ${plan.popular ? `bg-gradient-to-r ${plan.color} text-white hover:opacity-90 shadow-lg` : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                  >
                    Get {plan.name} Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 14. FEATURES ==================== */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: Truck, title: "Free Shipping", desc: "On orders over $50" },
              { icon: Shield, title: "Secure Payment", desc: "100% secure transactions" },
              { icon: Headphones, title: "24/7 Support", desc: "Dedicated customer service" }
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center p-6 md:p-8 rounded-3xl bg-white/10 backdrop-blur-xl hover:bg-white/20 transition-all duration-300 group border border-white/10 hover:border-white/30">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-8 h-8 md:w-10 md:h-10" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3">{item.title}</h3>
                <p className="opacity-90 text-sm md:text-base">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 15. CUSTOMER STATS ==================== */}
      <section className="py-16 md:py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: Package, value: "50,000+", label: "Products", color: "from-blue-500 to-blue-600" },
              { icon: Users, value: "100,000+", label: "Happy Customers", color: "from-purple-500 to-purple-600" },
              { icon: Star, value: "4.8", label: "Average Rating", color: "from-yellow-500 to-orange-500" },
              { icon: Award, value: "10+", label: "Years Experience", color: "from-green-500 to-emerald-500" }
            ].map((stat, idx) => (
              <div key={idx} className="text-center group">
                <div className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <stat.icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-2">{stat.value}</div>
                <div className="text-gray-500 font-medium text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 16. WHY CHOOSE US ==================== */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="from-yellow-100 to-amber-100"
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
      <section className="py-16 md:py-24 bg-gradient-to-br from-white via-purple-50 to-white">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-6 md:p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                <div className="flex items-center mb-4 md:mb-6">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-14 h-14 md:w-16 md:h-16 rounded-full mr-4 ring-4 ring-blue-100" />
                  <div>
                    <h4 className="font-bold text-lg md:text-xl text-gray-900">{testimonial.name}</h4>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic text-base md:text-lg leading-relaxed">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 18. TECH BLOG ==================== */}
      <section className="py-16 md:py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="from-indigo-100 to-violet-100"
            title="Tech Blog"
            subtitle="Stay informed with the latest tech news, guides, and tips"
            gradient="from-indigo-600 to-violet-600"
            icon={BookOpen}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {BLOG_POSTS.map((post) => (
              <article
                key={post.id}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-indigo-200 transform hover:-translate-y-2"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xl px-3 py-1.5 rounded-full text-xs font-bold text-indigo-600">
                    {post.category}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                    <span>{post.date}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                  <Link
                    to="#"
                    className="inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:text-indigo-800 transition-colors"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 19. DOWNLOAD OUR APP ==================== */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-blue-500/15 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full mb-6 border border-white/20">
                <Smartphone className="w-5 h-5 text-purple-400" />
                <span className="text-purple-400 font-semibold text-sm">Mobile App</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Shop on the{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Go</span>
              </h2>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Download our app for exclusive mobile-only deals, real-time order tracking, and a seamless shopping experience.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  "Exclusive app-only discounts & offers",
                  "Real-time order tracking & notifications",
                  "One-tap reorder from purchase history",
                  "AR try-on for compatible products"
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                <button className="flex items-center gap-3 bg-white text-gray-900 px-6 py-3.5 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs opacity-80">Download on the</div>
                    <div className="text-sm font-bold -mt-0.5">App Store</div>
                  </div>
                </button>
                <button className="flex items-center gap-3 bg-white text-gray-900 px-6 py-3.5 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 1.33a1 1 0 010 1.722l-2.302 1.33-2.535-2.191 2.535-2.191zM5.864 3.457l10.937 6.333-2.302 2.302-8.635-8.635z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs opacity-80">Get it on</div>
                    <div className="text-sm font-bold -mt-0.5">Google Play</div>
                  </div>
                </button>
              </div>
            </div>
            <div className="hidden lg:flex justify-center">
              <div className="relative">
                <div className="w-72 h-[500px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-[3rem] shadow-2xl border-4 border-gray-700 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=700&fit=crop"
                    alt="Mobile App"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl animate-bounce">
                  <span className="text-white font-bold text-lg">50%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 20. SOCIAL MEDIA FEED ==================== */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 via-white to-pink-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="from-pink-100 to-rose-100"
            title="Follow Us"
            subtitle="Stay connected and see what's trending on our social channels"
            gradient="from-pink-600 to-rose-600"
            icon={Camera}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-8">
            {SOCIAL_POSTS.map((post) => (
              <div
                key={post.id}
                className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
              >
                <img
                  src={post.image}
                  alt="Social post"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <button className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white px-8 py-4 rounded-2xl font-bold hover:from-pink-600 hover:via-red-600 hover:to-yellow-600 transition-all duration-300 transform hover:scale-105 shadow-xl">
              <Camera className="w-5 h-5" />
              Follow @ElectroShop
            </button>
          </div>
        </div>
      </section>

      {/* ==================== 21. REFERRAL PROGRAM ==================== */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xl px-5 py-2.5 rounded-full mb-6">
              <Share2 className="w-5 h-5 text-white" />
              <span className="font-semibold text-sm">Referral Program</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Refer & Earn <span className="text-yellow-300">$20</span>
            </h2>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">Share ElectroShop with friends and earn rewards for every successful referral</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
            {[
              { step: "01", icon: Share2, title: "Share Your Link", desc: "Get your unique referral link from your account dashboard" },
              { step: "02", icon: Users, title: "Friend Signs Up", desc: "Your friend creates an account using your referral link" },
              { step: "03", icon: CreditCard, title: "You Both Earn", desc: "You get $20 credit and your friend gets 15% off first order" }
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 text-center border border-white/20 hover:bg-white/20 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="text-5xl font-black text-white/20 mb-4">{item.step}</div>
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-white/80 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <button className="inline-flex items-center gap-3 bg-white text-emerald-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl">
              <Share2 className="w-5 h-5" />
              Start Referring
            </button>
          </div>
        </div>
      </section>

      {/* ==================== 22. QUICK LINKS BAR ==================== */}
      <section className="py-12 md:py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
            {[
              { icon: Truck, label: "Track Order", desc: "Check delivery status" },
              { icon: HelpCircle, label: "Help Center", desc: "Get support & FAQ" },
              { icon: MapPin, label: "Store Locator", desc: "Find nearest store" },
              { icon: Gift, label: "Gift Cards", desc: "Send a gift card" },
              { icon: Store, label: "Sell With Us", desc: "Become a seller" }
            ].map((item, idx) => (
              <Link
                key={idx}
                to="#"
                className="flex flex-col items-center text-center p-4 md:p-5 rounded-2xl hover:bg-gray-50 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-gray-800 text-sm md:text-base group-hover:text-blue-600 transition-colors">{item.label}</span>
                <span className="text-gray-400 text-xs mt-1">{item.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 23. NEWSLETTER ==================== */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Mail className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-6" />
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
              className="flex-1 px-6 py-4 rounded-2xl text-gray-800 focus:outline-none focus:ring-4 focus:ring-white/30 text-base md:text-lg"
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
    </div>
  );
};

export default HomePage;
