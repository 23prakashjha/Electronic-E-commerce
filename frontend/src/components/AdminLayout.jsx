import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Bars3Icon } from '@heroicons/react/24/outline';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin' || path === '/admin/dashboard') return 'Dashboard';
    if (path === '/admin/products') return 'Products';
    if (path === '/admin/products/new') return 'Add Product';
    if (path.match(/^\/admin\/products\/[^/]+$/)) return 'Edit Product';
    if (path === '/admin/orders') return 'Orders';
    if (path === '/admin/users') return 'Users';
    return 'Admin';
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        <header className="sticky top-0 z-30 bg-gray-900/80 backdrop-blur-xl border-b border-white/10 h-16 flex items-center px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <h1 className="ml-3 lg:ml-0 text-lg font-bold text-white">{getPageTitle()}</h1>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
