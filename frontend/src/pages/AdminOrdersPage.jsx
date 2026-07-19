import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBagIcon,
  EyeIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CubeIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/admin/login');
      return;
    }

    fetchOrders();
  }, [isAuthenticated, user]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders?limit=100', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.orderStatus === filterStatus);

  const statusCounts = (status) => {
    if (status === 'all') return orders.length;
    return orders.filter(o => o.orderStatus === status).length;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircleIcon className="h-4 w-4" />;
      case 'cancelled': return <XCircleIcon className="h-4 w-4" />;
      case 'shipped': return <TruckIcon className="h-4 w-4" />;
      case 'processing': return <CubeIcon className="h-4 w-4" />;
      default: return <ClockIcon className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'shipped': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'processing': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-500/20 text-green-400';
      case 'cancelled': return 'bg-red-500/20 text-red-400';
      case 'shipped': return 'bg-blue-500/20 text-blue-400';
      case 'processing': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getTimelineSteps = () => ['pending', 'processing', 'shipped', 'delivered'];

  const getTimelineIndex = (status) => {
    const steps = getTimelineSteps();
    const idx = steps.indexOf(status);
    return idx === -1 ? -1 : idx;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-purple-500 border-t-transparent"></div>
          <p className="text-gray-400 text-sm">Loading orders...</p>
        </div>
      </div>
    );
  }

  const filterOptions = [
    { key: 'all', label: 'All', color: 'bg-white/5 border-white/10 text-gray-300', activeColor: 'bg-purple-600/20 border-purple-500 text-white' },
    { key: 'pending', label: 'Pending', color: 'bg-white/5 border-white/10 text-gray-400', activeColor: 'bg-yellow-500/20 border-yellow-500 text-yellow-400' },
    { key: 'processing', label: 'Processing', color: 'bg-white/5 border-white/10 text-gray-400', activeColor: 'bg-blue-500/20 border-blue-500 text-blue-400' },
    { key: 'shipped', label: 'Shipped', color: 'bg-white/5 border-white/10 text-gray-400', activeColor: 'bg-indigo-500/20 border-indigo-500 text-indigo-400' },
    { key: 'delivered', label: 'Delivered', color: 'bg-white/5 border-white/10 text-gray-400', activeColor: 'bg-green-500/20 border-green-500 text-green-400' },
    { key: 'cancelled', label: 'Cancelled', color: 'bg-white/5 border-white/10 text-gray-400', activeColor: 'bg-red-500/20 border-red-500 text-red-400' },
  ];

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

            <button onClick={() => setMobileNavOpen(!mobileNavOpen)} className="md:hidden p-2 text-gray-400 hover:text-white">
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
              <button onClick={handleLogout} className="flex items-center space-x-2 px-4 py-2.5 bg-red-500/10 text-red-400 rounded-xl w-full">
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Manage Orders</h1>
            <p className="text-gray-400 mt-1 text-sm">{orders.length} orders total</p>
          </div>
          <Link
            to="/admin/dashboard"
            className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl transition-all duration-200 border border-white/10 text-sm"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 mb-8">
          {filterOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setFilterStatus(opt.key)}
              className={`p-2.5 sm:p-3 rounded-xl border transition-all duration-200 ${
                filterStatus === opt.key ? opt.activeColor : `${opt.color} hover:bg-white/10`
              }`}
            >
              <span className="text-xs sm:text-sm font-medium capitalize">{opt.label}</span>
              <p className="text-lg sm:text-xl font-bold mt-0.5">{statusCounts(opt.key)}</p>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              const timelineIdx = getTimelineIndex(order.orderStatus);
              const isCancelled = order.orderStatus === 'cancelled';
              const steps = getTimelineSteps();

              return (
                <div key={order._id} className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-colors">
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                      <div className="min-w-0">
                        <div className="flex items-center flex-wrap gap-2">
                          <h3 className="text-lg font-bold text-white">#{order._id?.slice(-8).toUpperCase()}</h3>
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.orderStatus)}`}>
                            {getStatusIcon(order.orderStatus)}
                            <span className="capitalize">{order.orderStatus}</span>
                          </span>
                        </div>
                        <p className="text-gray-500 text-xs mt-1">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="text-left sm:text-right shrink-0">
                        <p className="text-xl font-extrabold text-white">₹{order.totalAmount?.toLocaleString()}</p>
                        <p className="text-gray-500 text-xs">{order.orderItems?.length || 0} items</p>
                      </div>
                    </div>

                    {!isCancelled && (
                      <div className="mb-5 px-2">
                        <div className="flex items-center justify-between relative">
                          <div className="absolute top-3 left-0 right-0 h-0.5 bg-white/10"></div>
                          <div 
                            className="absolute top-3 left-0 h-0.5 bg-purple-500 transition-all duration-500" 
                            style={{ width: timelineIdx >= 0 ? `${(timelineIdx / (steps.length - 1)) * 100}%` : '0%' }}
                          ></div>
                          {steps.map((step, idx) => (
                            <div key={step} className="relative flex flex-col items-center z-10">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                                idx <= timelineIdx 
                                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' 
                                  : 'bg-gray-800 text-gray-500 border border-white/10'
                              }`}>
                                {idx < timelineIdx ? <CheckCircleIcon className="h-3.5 w-3.5" /> : idx + 1}
                              </div>
                              <span className={`text-xs mt-1.5 capitalize hidden sm:block ${idx <= timelineIdx ? 'text-purple-300' : 'text-gray-600'}`}>{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-white/5 rounded-xl p-3.5">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Shipping</h4>
                        <p className="text-white font-medium text-sm">{order.shippingAddress?.fullName}</p>
                        <p className="text-gray-400 text-xs">{order.shippingAddress?.streetAddress}</p>
                        <p className="text-gray-400 text-xs">{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
                        <p className="text-gray-400 text-xs">{order.shippingAddress?.phone}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3.5">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Customer</h4>
                        <p className="text-white font-medium text-sm">{order.user?.name || 'Guest'}</p>
                        <p className="text-gray-400 text-xs">{order.user?.email || order.shippingAddress?.email || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Items</h4>
                      <div className="bg-white/5 rounded-xl p-3.5 space-y-2.5">
                        {order.orderItems?.map((item, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-white/10 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-medium text-sm truncate">{item.name}</p>
                              <p className="text-gray-500 text-xs">Qty: {item.quantity} x ₹{item.price?.toLocaleString()}</p>
                            </div>
                            <p className="text-white font-semibold text-sm shrink-0">₹{(item.quantity * item.price).toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-white/10">
                      <div className="flex items-center gap-3">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Status:</label>
                        <select
                          value={order.orderStatus || 'pending'}
                          onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border-0 cursor-pointer ${getStatusBgColor(order.orderStatus)}`}
                        >
                          <option value="pending" className="bg-gray-800">Pending</option>
                          <option value="processing" className="bg-gray-800">Processing</option>
                          <option value="shipped" className="bg-gray-800">Shipped</option>
                          <option value="delivered" className="bg-gray-800">Delivered</option>
                          <option value="cancelled" className="bg-gray-800">Cancelled</option>
                        </select>
                      </div>
                      <Link
                        to={`/orders/${order._id}`}
                        className="flex items-center space-x-1.5 text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium"
                      >
                        <EyeIcon className="h-4 w-4" />
                        <span>View Details</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-12 text-center">
              <ShoppingBagIcon className="h-14 w-14 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No orders found</p>
              <p className="text-gray-600 text-sm mt-1">
                {filterStatus !== 'all' ? `No ${filterStatus} orders` : 'Orders will appear here'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
