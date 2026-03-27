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
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartItemsCount, isInCart, addToCart } = useCart();

  useEffect(() => {
    fetchCategories();
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
    <nav className="bg-white/95 backdrop-blur-xl shadow-xl sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Shifted to starting left side */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center transform transition-all duration-300 hover:scale-110 hover:rotate-3">
                <span className="text-white font-bold text-xl animate-pulse">E</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-ping"></div>
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">E</span>
              <span className="text-2xl font-bold text-gray-800">-Shop</span>
            </div>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:block flex-1 max-w-2xl mx-6">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-3 pr-32 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-300 bg-gray-50/50 text-lg"
              />
              <button
                type="submit"
                className="absolute right-2 top-1.5 px-8 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Search
              </button>
            </form>
          </div>

          {/* Desktop Navigation - Login/Register shifted to ending right side */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Navigation Links */}
            <Link
              to="/"
              className={`relative text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium ${
                isActivePath('/') ? 'text-blue-600' : ''
              }`}
            >
              Home
              {isActivePath('/') && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform transition-all duration-300"></div>
              )}
            </Link>

            <Link
              to="/products"
              className={`relative text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium ${
                isActivePath('/products') ? 'text-blue-600' : ''
              }`}
            >
              Products
              {isActivePath('/products') && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform transition-all duration-300"></div>
              )}
            </Link>
            <Link
                to="/about"
                className="block text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 py-2"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="block text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 py-2"
                
              >
                Contact
              </Link>

            {/* Action Icons */}
            <div className="flex items-center space-x-4 pl-4 border-l border-gray-200">
              {/* Wishlist */}
              <Link to="/wishlist" className="relative group">
                <div className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-300">
                  <HeartIcon className="h-6 w-6 text-gray-700 group-hover:text-red-500 transition-colors duration-300" />
                </div>
              </Link>

              {/* Cart */}
              <Link to="/cart" className="relative group">
                <div className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-300">
                  <ShoppingBagIcon className="h-6 w-6 text-gray-700 group-hover:text-blue-600 transition-colors duration-300" />
                  {getCartItemsCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold shadow-lg">
                      {getCartItemsCount()}
                    </span>
                  )}
                </div>
              </Link>
            </div>

            {/* Login/Register - Shifted to ending right side */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/cart"
                  className="relative p-2 text-gray-700 hover:text-blue-600 transition-all duration-300 transform hover:scale-110"
                >
                  <ShoppingBagIcon className="h-6 w-6" />
                  {getCartItemsCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                      {getCartItemsCount()}
                    </span>
                  )}
                </Link>

                <Link
                  to="/wishlist"
                  className="p-2 text-gray-700 hover:text-blue-600 transition-all duration-300 transform hover:scale-110"
                >
                  <HeartIcon className="h-6 w-6" />
                </Link>

                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 text-gray-700 hover:text-blue-600 transition-all duration-300 transform hover:scale-110">
                    <UserIcon className="h-8 w-8" />
                    <ChevronDownIcon className="h-4 w-4 transform transition-transform duration-300 group-hover:rotate-180" />
                  </button>
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-100">
                    <Link
                      to="/profile"
                      className="block px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-200 rounded-xl"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-200 rounded-xl"
                    >
                      Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 transition-all duration-200 rounded-xl"
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
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-300"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6 text-gray-700" />
              ) : (
                <Bars3Icon className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4 px-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-12 pr-32 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-300 text-gray-700 placeholder-gray-400"
            />
            <MagnifyingGlassIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <button
              type="submit"
              className="absolute right-2 top-1.5 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100">
          <div className="px-4 py-6 space-y-6">
            <div className="space-y-3">
              <Link
                to="/"
                className="block text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="block text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                to="/about"
                className="block text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="block text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-around">
                <Link
                  to="/wishlist"
                  className="flex flex-col items-center space-y-1 text-gray-700 hover:text-red-500 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <HeartIcon className="h-6 w-6" />
                  <span className="text-xs">Wishlist</span>
                </Link>
                <Link
                  to="/cart"
                  className="flex flex-col items-center space-y-1 text-gray-700 hover:text-blue-600 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShoppingBagIcon className="h-6 w-6" />
                  <span className="text-xs">Cart ({getCartItemsCount()})</span>
                </Link>
              </div>
            </div>
            
            {isAuthenticated ? (
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-600">{user?.email}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Link
                    to="/profile"
                    className="block py-2 text-gray-700 hover:text-blue-600 transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block py-2 text-gray-700 hover:text-blue-600 transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="block py-2 text-gray-700 hover:text-blue-600 transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left py-2 text-red-600 hover:text-red-700 transition-all duration-300"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-t border-gray-200 pt-6 space-y-3">
                <Link
                  to="/login"
                  className="block w-full text-center text-gray-700 hover:text-blue-600 font-medium py-3 border border-gray-300 rounded-xl hover:border-blue-500 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
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
