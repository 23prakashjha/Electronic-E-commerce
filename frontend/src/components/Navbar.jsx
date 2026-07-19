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
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartItemsCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    navigate('/');
  };

  const isActivePath = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white text-center py-2 text-xs sm:text-sm font-medium relative z-[60] overflow-hidden">
        <div className="flex items-center justify-center gap-2">
          <span className="inline-block animate-pulse">🔥</span>
          <span>Free Shipping on orders over ₹500 | Use code <span className="font-bold">ELECTRO10</span> for 10% off</span>
          <span className="inline-block animate-pulse">🔥</span>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-xl shadow-blue-500/5' 
          : 'bg-white/90 backdrop-blur-xl'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group flex-shrink-0">
              <div className="relative">
                <div className="w-9 h-9 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg group-hover:shadow-xl">
                  <span className="text-white font-bold text-lg sm:text-2xl">E</span>
                </div>
                <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-ping"></div>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Electro</span>
                <span className="text-xl sm:text-2xl font-bold text-gray-800">Shop</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 rounded-xl transition-all duration-300 font-semibold text-sm ${
                    isActivePath(link.path) 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                  {isActivePath(link.path) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></span>
                  )}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-2">
              <div className="h-8 w-px bg-gray-200"></div>

              <Link to="/wishlist" className="relative group">
                <div className="p-2.5 rounded-xl hover:bg-gray-50 transition-all duration-300">
                  <HeartIcon className="h-5 w-5 text-gray-600 group-hover:text-red-500 transition-colors duration-300" />
                </div>
              </Link>

              <Link to="/cart" className="relative group">
                <div className="p-2.5 rounded-xl hover:bg-gray-50 transition-all duration-300">
                  <ShoppingBagIcon className="h-5 w-5 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
                  {getCartItemsCount() > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold shadow-lg animate-bounce">
                      {getCartItemsCount()}
                    </span>
                  )}
                </div>
              </Link>

              <div className="h-8 w-px bg-gray-200"></div>

              {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-gray-50 transition-all duration-300">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center ring-2 ring-transparent group-hover:ring-blue-200 transition-all duration-300">
                      <span className="text-white font-bold text-sm">{user?.name?.charAt(0).toUpperCase()}</span>
                    </div>
                    <ChevronDownIcon className="h-4 w-4 text-gray-500 transform transition-transform duration-300 group-hover:rotate-180" />
                  </button>
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-100 overflow-hidden z-50">
                    <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                      <p className="font-bold text-gray-900">{user?.name}</p>
                      <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <div className="p-2">
                      <Link to="/profile" className="block px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 rounded-xl font-medium text-sm">
                        My Profile
                      </Link>
                      <Link to="/orders" className="block px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 rounded-xl font-medium text-sm">
                        My Orders
                      </Link>
                      <Link to="/wishlist" className="block px-4 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 rounded-xl font-medium text-sm">
                        My Wishlist
                      </Link>
                      {user?.role === 'admin' && (
                        <>
                          <div className="border-t border-gray-100 mt-1 pt-1">
                            <p className="px-4 py-1 text-xs font-bold text-purple-500 uppercase tracking-wider">Admin Panel</p>
                          </div>
                          <Link to="/admin/dashboard" className="block px-4 py-2.5 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 rounded-xl font-medium text-sm">
                            Dashboard
                          </Link>
                          <Link to="/admin/products" className="block px-4 py-2.5 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 rounded-xl font-medium text-sm">
                            Manage Products
                          </Link>
                          <Link to="/admin/orders" className="block px-4 py-2.5 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 rounded-xl font-medium text-sm">
                            Manage Orders
                          </Link>
                        </>
                      )}
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 transition-all duration-200 rounded-xl font-medium text-sm mt-1 border-t border-gray-100 pt-3">
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login" className="px-4 py-2 text-gray-600 hover:text-blue-600 font-semibold transition-all duration-300 rounded-xl hover:bg-gray-50 text-sm">
                    Login
                  </Link>
                  <Link to="/register" className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm">
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center space-x-1">
              <Link to="/cart" className="relative p-2">
                <ShoppingBagIcon className="h-6 w-6 text-gray-700" />
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[10px] rounded-full min-w-[16px] h-[16px] flex items-center justify-center font-bold">
                    {getCartItemsCount()}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-xl hover:bg-gray-50 transition-all duration-300"
              >
                {isMenuOpen ? (
                  <XMarkIcon className="h-6 w-6 text-gray-700" />
                ) : (
                  <Bars3Icon className="h-6 w-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden px-4 pb-3">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-11 pr-20 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-300 text-sm text-gray-700 placeholder-gray-400"
            />
            <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold rounded-lg">
              Search
            </button>
          </form>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden" onClick={() => setIsMenuOpen(false)} />
      )}

      {/* Mobile Menu */}
      <div className={`fixed top-0 right-0 h-full w-[300px] max-w-[85vw] bg-white shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Electro</span>
            <span className="text-lg font-bold text-gray-800">Shop</span>
          </div>
          <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-xl hover:bg-gray-50">
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-72px)] pb-8">
          {/* User Info */}
          {isAuthenticated && (
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Nav Links */}
          <div className="p-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 font-semibold transition-all duration-300 rounded-xl text-sm ${
                  isActivePath(link.path) ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Admin Links - Mobile (only for admin users) */}
          {isAuthenticated && user?.role === 'admin' && (
            <div className="p-4 border-t border-gray-100">
              <p className="px-4 py-1 text-xs font-bold text-purple-500 uppercase tracking-wider mb-1">Admin Panel</p>
              <Link to="/admin/dashboard" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:text-purple-600 font-semibold transition-all duration-300 rounded-xl hover:bg-purple-50 text-sm">
                Dashboard
              </Link>
              <Link to="/admin/products" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:text-purple-600 font-semibold transition-all duration-300 rounded-xl hover:bg-purple-50 text-sm">
                Manage Products
              </Link>
              <Link to="/admin/orders" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:text-purple-600 font-semibold transition-all duration-300 rounded-xl hover:bg-purple-50 text-sm">
                Manage Orders
              </Link>
            </div>
          )}

          {/* Action Links */}
          <div className="px-4 py-2 border-t border-gray-100 mt-2 space-y-1">
            <Link to="/wishlist" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-red-500 transition-all duration-300 rounded-xl hover:bg-gray-50 text-sm">
              <HeartIcon className="h-5 w-5" />
              <span className="font-semibold">My Wishlist</span>
            </Link>
            <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-blue-600 transition-all duration-300 rounded-xl hover:bg-gray-50 text-sm">
              <ShoppingBagIcon className="h-5 w-5" />
              <span className="font-semibold">Cart ({getCartItemsCount()})</span>
            </Link>
          </div>

          {/* Auth Actions */}
          <div className="px-4 pt-4 border-t border-gray-100 mt-2 space-y-2">
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="block w-full text-center py-3 border-2 border-gray-200 rounded-xl font-semibold text-sm hover:border-blue-500 hover:text-blue-600 transition-all" onClick={() => setIsMenuOpen(false)}>
                  My Profile
                </Link>
                <Link to="/orders" className="block w-full text-center py-3 border-2 border-gray-200 rounded-xl font-semibold text-sm hover:border-blue-500 hover:text-blue-600 transition-all" onClick={() => setIsMenuOpen(false)}>
                  My Orders
                </Link>
                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="block w-full text-center py-3 text-red-600 border-2 border-red-200 rounded-xl font-semibold text-sm hover:bg-red-50 transition-all">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block w-full text-center py-3 border-2 border-gray-200 rounded-xl font-semibold text-sm hover:border-blue-500 hover:text-blue-600 transition-all" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-xl text-sm shadow-lg" onClick={() => setIsMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
