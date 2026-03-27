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
  CubeIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || user.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/admin/login');
      return;
    }

    fetchOrders();
  }, []);

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

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.orderStatus === filterStatus);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
      case 'cancelled':
        return <XCircleIcon className="h-5 w-5 text-red-400" />;
      case 'shipped':
        return <TruckIcon className="h-5 w-5 text-blue-400" />;
      case 'processing':
        return <CubeIcon className="h-5 w-5 text-yellow-400" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'shipped':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'processing':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      case 'shipped':
        return 'bg-blue-500';
      case 'processing':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/admin" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span className="text-white font-bold text-xl">Admin Panel</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-white/10 px-4 py-2 rounded-xl">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">{user.name?.charAt(0).toUpperCase()}</span>
                </div>
                <span className="text-white font-medium">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-xl transition-all duration-300"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Manage Orders</h1>
            <p className="text-gray-400 mt-1">{orders.length} orders total</p>
          </div>
          <Link
            to="/admin"
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-300"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`p-4 rounded-xl border transition-all duration-300 ${
                filterStatus === status
                  ? 'bg-purple-600/20 border-purple-500 text-white'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="capitalize font-medium">{status}</span>
                <span className="text-2xl font-bold">
                  {status === 'all' ? orders.length : orders.filter(o => o.orderStatus === status).length}
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div key={order._id} className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-3">
                        <h3 className="text-xl font-bold text-white">Order #{order._id?.slice(-8).toUpperCase()}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.orderStatus)}`}>
                          {getStatusIcon(order.orderStatus)}
                          <span className="ml-1 capitalize">{order.orderStatus}</span>
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mt-1">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">₹{order.totalAmount?.toLocaleString()}</p>
                      <p className="text-gray-400 text-sm">{order.orderItems?.length || 0} items</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">Shipping Address</h4>
                      <div className="bg-white/5 rounded-xl p-4">
                        <p className="text-white font-medium">{order.shippingAddress?.fullName}</p>
                        <p className="text-gray-400 text-sm">{order.shippingAddress?.streetAddress}</p>
                        <p className="text-gray-400 text-sm">{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
                        <p className="text-gray-400 text-sm">{order.shippingAddress?.phone}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">Customer</h4>
                      <div className="bg-white/5 rounded-xl p-4">
                        <p className="text-white font-medium">{order.user?.name || 'Guest'}</p>
                        <p className="text-gray-400 text-sm">{order.user?.email || order.shippingAddress?.email || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Order Items</h4>
                    <div className="bg-white/5 rounded-xl p-4 space-y-3">
                      {order.orderItems?.map((item, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                          <div className="flex-1">
                            <p className="text-white font-medium">{item.name}</p>
                            <p className="text-gray-400 text-sm">Qty: {item.quantity} × ₹{item.price}</p>
                          </div>
                          <p className="text-white font-semibold">₹{(item.quantity * item.price).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div>
                      <label className="text-sm font-semibold text-gray-400 mr-3">Update Status:</label>
                      <select
                        value={order.orderStatus || 'pending'}
                        onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                        className={`px-4 py-2 rounded-xl border-0 cursor-pointer font-medium ${getStatusBgColor(order.orderStatus)} text-white`}
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
                      className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      <EyeIcon className="h-5 w-5" />
                      <span>View Details</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-12 text-center">
              <ShoppingBagIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No orders found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
