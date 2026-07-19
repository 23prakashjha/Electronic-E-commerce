import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBagIcon,
  UsersIcon,
  CurrencyDollarIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CubeIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftIcon,
  Bars3Icon,
  XMarkIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const useAnimatedCounter = (target, duration = 1200) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (target === 0) return;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        ref.current = requestAnimationFrame(animate);
      }
    };
    ref.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(ref.current);
  }, [target, duration]);

  return count;
};

// eslint-disable-next-line no-unused-vars
const StatCard = ({ icon: Icon, label, value, prefix = '', color, delay }) => {
  const animatedValue = useAnimatedCounter(typeof value === 'number' ? value : 0);
  return (
    <div 
      className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{label}</p>
          <p className="text-3xl font-extrabold text-white mt-1">
            {prefix}{typeof value === 'number' ? animatedValue.toLocaleString() : value}
          </p>
        </div>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${color}`}>
          <Icon className="h-7 w-7" />
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0
  });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/admin/login');
      return;
    }

    fetchData();
  }, [isAuthenticated, user]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        fetch('http://localhost:5000/api/products?limit=100', { headers }),
        fetch('http://localhost:5000/api/orders?limit=50', { headers }),
        fetch('http://localhost:5000/api/users', { headers })
      ]);

      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();
      const usersData = await usersRes.json();

      if (productsData.success) setProducts(productsData.products);
      if (ordersData.success) setOrders(ordersData.orders);
      
      setStats({
        totalOrders: ordersData.orders?.length || 0,
        totalRevenue: 0,
        totalUsers: usersData.users?.length || 0,
        totalProducts: productsData.products?.length || 0
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        
        if (response.ok) {
          setProducts(products.filter(p => p._id !== productId));
          toast.success('Product deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ orderStatus: status })
      });
      
      if (response.ok) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, orderStatus: status } : order
        ));
        toast.success('Order status updated');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order status');
    }
  };

  const quickActions = [
    { to: '/admin/products/new', icon: PlusIcon, label: 'Add Product', sub: 'Create new listing', color: 'bg-emerald-500/20 text-emerald-400' },
    { to: '/admin/products', icon: CubeIcon, label: 'Products', sub: `${products.length} total`, color: 'bg-blue-500/20 text-blue-400' },
    { to: '/admin/orders', icon: ShoppingBagIcon, label: 'Orders', sub: `${orders.length} total`, color: 'bg-orange-500/20 text-orange-400' },
    { to: '/admin/users', icon: UsersIcon, label: 'Users', sub: `${stats.totalUsers} total`, color: 'bg-purple-500/20 text-purple-400' },
  ];

  const orderStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500/20 text-yellow-400',
      processing: 'bg-blue-500/20 text-blue-400',
      shipped: 'bg-indigo-500/20 text-indigo-400',
      delivered: 'bg-green-500/20 text-green-400',
      cancelled: 'bg-red-500/20 text-red-400',
    };
    return colors[status] || colors.pending;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-purple-500 border-t-transparent"></div>
          <p className="text-gray-400 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="bg-gray-900/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/admin/dashboard" className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-white font-bold text-lg hidden sm:block">Admin Panel</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                <div className="w-7 h-7 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">{user.name?.charAt(0).toUpperCase()}</span>
                </div>
                <span className="text-white text-sm font-medium">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-xl transition-all duration-200 border border-red-500/10"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>

            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white"
            >
              {mobileNavOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>

          {mobileNavOpen && (
            <div className="md:hidden pb-4 border-t border-white/10 mt-2 pt-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">{user.name?.charAt(0).toUpperCase()}</span>
                </div>
                <span className="text-white font-medium">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2.5 bg-red-500/10 text-red-400 rounded-xl w-full"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-6 sm:p-8 mb-8">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl"></div>
            <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-blue-400/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-xl animate-pulse"></div>
          </div>
          <div className="relative z-10">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Welcome back, {user.name}!</h1>
            <p className="text-purple-100/80 text-sm sm:text-base">Manage your products, orders, and customers from one place.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {quickActions.map((action) => (
            <Link 
              key={action.label}
              to={action.to} 
              className="flex items-center space-x-3 bg-white/5 backdrop-blur-xl p-3 sm:p-4 rounded-xl hover:bg-white/10 transition-all duration-200 border border-white/5 group"
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110 ${action.color}`}>
                <action.icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0">
                <p className="text-white font-semibold text-sm truncate">{action.label}</p>
                <p className="text-gray-500 text-xs truncate">{action.sub}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <StatCard icon={ShoppingBagIcon} label="Total Orders" value={stats.totalOrders} color="bg-blue-500/20 text-blue-400" delay={0} />
          <StatCard icon={CurrencyDollarIcon} label="Total Revenue" value={stats.totalRevenue} prefix="₹" color="bg-green-500/20 text-green-400" delay={100} />
          <StatCard icon={CubeIcon} label="Total Products" value={stats.totalProducts} color="bg-purple-500/20 text-purple-400" delay={200} />
          <StatCard icon={UsersIcon} label="Total Users" value={stats.totalUsers} color="bg-orange-500/20 text-orange-400" delay={300} />
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden mb-8">
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ChartBarIcon className="h-5 w-5 text-gray-400" />
              <h2 className="text-lg font-bold text-white">Products</h2>
            </div>
            <Link to="/admin/products/new" className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors">
              <PlusIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Add Product</span>
            </Link>
          </div>
          
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Product</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Price</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Stock</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.length > 0 ? (
                  products.slice(0, 8).map((product) => (
                    <tr key={product._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center space-x-3">
                          <img src={product.images?.[0]?.url || '/placeholder-product.jpg'} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-white/10" />
                          <div className="min-w-0">
                            <p className="text-white font-medium text-sm truncate max-w-[200px]">{product.name}</p>
                            <p className="text-gray-500 text-xs">{product.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-300 text-sm">{product.category?.name || 'N/A'}</td>
                      <td className="px-5 py-3 text-white font-semibold text-sm">₹{product.price?.toLocaleString()}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${product.stock > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <Link to={`/admin/products/${product._id}`} className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors" title="Edit">
                            <PencilIcon className="h-4 w-4" />
                          </Link>
                          <Link to={`/product/${product._id}`} target="_blank" className="p-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg transition-colors" title="View">
                            <EyeIcon className="h-4 w-4" />
                          </Link>
                          <button onClick={() => handleDeleteProduct(product._id)} className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors" title="Delete">
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-5 py-12 text-center">
                      <CubeIcon className="h-10 w-10 text-gray-700 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">No products yet</p>
                      <Link to="/admin/products/new" className="inline-flex items-center space-x-2 mt-3 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold">
                        <PlusIcon className="h-4 w-4" />
                        <span>Add First Product</span>
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y divide-white/5">
            {products.length > 0 ? (
              products.slice(0, 6).map((product) => (
                <div key={product._id} className="p-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-start space-x-3">
                    <img src={product.images?.[0]?.url || '/placeholder-product.jpg'} alt={product.name} className="w-12 h-12 rounded-lg object-cover bg-white/10 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">{product.name}</p>
                      <p className="text-gray-500 text-xs">{product.brand} &middot; {product.category?.name || 'N/A'}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-white font-bold text-sm">₹{product.price?.toLocaleString()}</span>
                        <div className="flex items-center space-x-1.5">
                          <Link to={`/admin/products/${product._id}`} className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg">
                            <PencilIcon className="h-3.5 w-3.5" />
                          </Link>
                          <Link to={`/product/${product._id}`} target="_blank" className="p-1.5 bg-purple-500/10 text-purple-400 rounded-lg">
                            <EyeIcon className="h-3.5 w-3.5" />
                          </Link>
                          <button onClick={() => handleDeleteProduct(product._id)} className="p-1.5 bg-red-500/10 text-red-400 rounded-lg">
                            <TrashIcon className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <CubeIcon className="h-10 w-10 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No products yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-5 border-b border-white/10">
            <h2 className="text-lg font-bold text-white">Recent Orders</h2>
          </div>
          
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Order ID</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Total</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.length > 0 ? (
                  orders.slice(0, 10).map((order) => (
                    <tr key={order._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-5 py-3 text-white font-mono text-xs">#{order._id?.slice(-8).toUpperCase()}</td>
                      <td className="px-5 py-3 text-white text-sm">{order.shippingAddress?.fullName || 'N/A'}</td>
                      <td className="px-5 py-3 text-white font-semibold text-sm">₹{order.totalAmount?.toLocaleString()}</td>
                      <td className="px-5 py-3">
                        <select
                          value={order.orderStatus || 'pending'}
                          onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                          className={`px-3 py-1 rounded-lg text-xs font-medium border-0 cursor-pointer ${orderStatusColor(order.orderStatus)}`}
                        >
                          <option value="pending" className="bg-gray-800">Pending</option>
                          <option value="processing" className="bg-gray-800">Processing</option>
                          <option value="shipped" className="bg-gray-800">Shipped</option>
                          <option value="delivered" className="bg-gray-800">Delivered</option>
                          <option value="cancelled" className="bg-gray-800">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-5 py-12 text-center">
                      <ShoppingBagIcon className="h-10 w-10 text-gray-700 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">No orders found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y divide-white/5">
            {orders.length > 0 ? (
              orders.slice(0, 6).map((order) => (
                <div key={order._id} className="p-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-mono text-xs">#{order._id?.slice(-8).toUpperCase()}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${orderStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">{order.shippingAddress?.fullName || 'N/A'}</span>
                    <span className="text-white font-bold text-sm">₹{order.totalAmount?.toLocaleString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <ShoppingBagIcon className="h-10 w-10 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No orders found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
