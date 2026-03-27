import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBagIcon, 
  UserIcon, 
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  HeartIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartItemsCount, isInCart, addToCart } = useCart();

  useEffect(() => {
    fetchCategories();
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    setIsProfileOpen(false);
    navigate('/');
  };

  const handleQuickAddToCart = (productId) => {
    if (!isInCart(productId)) {
      addToCart({ _id: productId });
      toast.success('Added to cart');
    }
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-xl shadow-xl' 
        : 'bg-white/80 backdrop-blur-xl'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg">
                <span className="text-white font-bold text-2xl">E</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-ping"></div>
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Electro</span>
              <span className="text-2xl font-bold text-gray-800">Shop</span>
            </div>
          </Link>


          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Link
                to="/"
                className={`relative px-4 py-2 rounded-xl transition-all duration-300 font-semibold ${
                  isActivePath('/') 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                Home
              </Link>
              <Link
                to="/products"
                className={`relative px-4 py-2 rounded-xl transition-all duration-300 font-semibold ${
                  isActivePath('/products') 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                Products
              </Link>
              <Link
                to="/about"
                className={`relative px-4 py-2 rounded-xl transition-all duration-300 font-semibold ${
                  isActivePath('/about') 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                About
              </Link>
              <Link
                to="/contact"
                className={`relative px-4 py-2 rounded-xl transition-all duration-300 font-semibold ${
                  isActivePath('/contact') 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                Contact
              </Link>
              <Link
                to="/admin/login"
                className={`relative px-4 py-2 rounded-xl transition-all duration-300 font-semibold ${
                  isActivePath('/admin') 
                    ? 'text-purple-600 bg-purple-50' 
                    : 'text-purple-600 hover:text-purple-700 hover:bg-purple-50'
                }`}
              >
                Admin
              </Link>
            </div>

            <div className="h-8 w-px bg-gray-200"></div>

            <div className="flex items-center space-x-2">
              <Link to="/wishlist" className="relative group">
                <div className="p-3 rounded-2xl hover:bg-gray-50 transition-all duration-300">
                  <HeartIcon className="h-6 w-6 text-gray-700 group-hover:text-red-500 transition-colors duration-300" />
                </div>
              </Link>

              <Link to="/cart" className="relative group">
                <div className="p-3 rounded-2xl hover:bg-gray-50 transition-all duration-300">
                  <ShoppingBagIcon className="h-6 w-6 text-gray-700 group-hover:text-blue-600 transition-colors duration-300" />
                  {getCartItemsCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg animate-bounce">
                      {getCartItemsCount()}
                    </span>
                  )}
                </div>
              </Link>
            </div>

            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 rounded-2xl hover:bg-gray-50 transition-all duration-300">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <ChevronDownIcon className="h-4 w-4 text-gray-600 transform transition-transform duration-300 group-hover:rotate-180" />
                </button>
                <div className="absolute top-full right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-100 overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <p className="font-bold text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <div className="p-2">
                    <Link
                      to="/profile"
                      className="block px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-200 rounded-xl font-medium"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-200 rounded-xl font-medium"
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/wishlist"
                      className="block px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-200 rounded-xl font-medium"
                    >
                      My Wishlist
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-200 rounded-xl font-medium"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-gray-700 hover:text-blue-600 font-bold transition-all duration-300 rounded-xl hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-3 rounded-2xl hover:bg-gray-50 transition-all duration-300"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-7 w-7 text-gray-700" />
              ) : (
                <Bars3Icon className="h-7 w-7 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        <div className="md:hidden pb-4 px-2">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-14 pr-28 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all duration-300 text-gray-700 placeholder-gray-400 font-medium"
            />
            <MagnifyingGlassIcon className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100">
          <div className="px-4 py-6 space-y-4">
            <div className="space-y-1">
              <Link
                to="/"
                className="block px-4 py-3 text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 rounded-xl hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="block px-4 py-3 text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 rounded-xl hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                to="/about"
                className="block px-4 py-3 text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 rounded-xl hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="block px-4 py-3 text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 rounded-xl hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-around">
                <Link
                  to="/wishlist"
                  className="flex flex-col items-center space-y-1 text-gray-700 hover:text-red-500 transition-all duration-300 p-3 rounded-xl hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <HeartIcon className="h-6 w-6" />
                  <span className="text-xs font-medium">Wishlist</span>
                </Link>
                <Link
                  to="/cart"
                  className="flex flex-col items-center space-y-1 text-gray-700 hover:text-blue-600 transition-all duration-300 p-3 rounded-xl hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShoppingBagIcon className="h-6 w-6" />
                  <span className="text-xs font-medium">Cart ({getCartItemsCount()})</span>
                </Link>
              </div>
            </div>
            
            {isAuthenticated ? (
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-2xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <Link
                    to="/profile"
                    className="block py-3 text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 rounded-xl hover:bg-gray-50 px-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block py-3 text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 rounded-xl hover:bg-gray-50 px-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  <Link
                    to="/admin/login"
                    className="block py-3 text-purple-600 hover:text-purple-700 font-semibold transition-all duration-300 rounded-xl hover:bg-purple-50 px-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left py-3 text-red-600 hover:text-red-700 font-semibold transition-all duration-300 rounded-xl hover:bg-red-50 px-4"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <Link
                  to="/login"
                  className="block w-full text-center text-gray-700 hover:text-blue-600 font-bold py-3.5 border-2 border-gray-200 rounded-2xl hover:border-blue-500 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3.5 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
