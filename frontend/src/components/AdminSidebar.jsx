import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  ShoppingBagIcon,
  UsersIcon,
  CubeIcon,
  PlusIcon,
  ArrowRightOnRectangleIcon,
  ArrowUpRightIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/admin/dashboard', icon: HomeIcon, label: 'Dashboard' },
  { to: '/admin/products', icon: CubeIcon, label: 'Products' },
  { to: '/admin/products/new', icon: PlusIcon, label: 'Add Product' },
  { to: '/admin/orders', icon: ShoppingBagIcon, label: 'Orders' },
  { to: '/admin/users', icon: UsersIcon, label: 'Users' },
];

const AdminSidebar = ({ open, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const isActive = (path) => {
    if (path === '/admin/dashboard') return location.pathname === '/admin/dashboard' || location.pathname === '/admin';
    if (path === '/admin/products/new') return location.pathname === '/admin/products/new';
    if (path === '/admin/products') return location.pathname === '/admin/products' || location.pathname.match(/^\/admin\/products\/[^/]+$/);
    return location.pathname === path;
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-gray-900 border-r border-white/10 z-50
        flex flex-col transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
          <Link to="/admin/dashboard" className="flex items-center space-x-3" onClick={onClose}>
            <div className="w-9 h-9 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-white font-bold text-lg">Admin Panel</span>
          </Link>
          <button onClick={onClose} className="lg:hidden p-1 text-gray-400 hover:text-white">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={`
                  flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${active
                    ? 'bg-purple-600/20 text-purple-400 border border-purple-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }
                `}
              >
                <item.icon className={`h-5 w-5 ${active ? 'text-purple-400' : 'text-gray-500'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          <Link
            to="/"
            target="_blank"
            onClick={onClose}
            className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200 border border-transparent"
          >
            <ArrowUpRightIcon className="h-5 w-5 text-gray-500" />
            <span>View Homepage</span>
          </Link>

          <div className="flex items-center space-x-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 mt-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-xs">{user?.name?.charAt(0).toUpperCase()}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-sm font-medium truncate">{user?.name}</p>
              <p className="text-gray-500 text-xs capitalize">{user?.role}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 w-full border border-transparent"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
