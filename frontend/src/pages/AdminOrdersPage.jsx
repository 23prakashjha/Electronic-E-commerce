import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBagIcon,
  EyeIcon,
  ArrowLeftIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CubeIcon,
  XMarkIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
  CalendarIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import getImageUrl from '../utils/getImageUrl';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingOrder, setEditingOrder] = useState(null);
  const [trackingForm, setTrackingForm] = useState({
    orderStatus: '',
    trackingNumber: '',
    estimatedDelivery: '',
    currentLocation: '',
    deliveryPartnerName: '',
    deliveryPartnerPhone: '',
    deliveryPartnerVehicle: '',
    trackingNote: ''
  });
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
      const response = await fetch('https://electronic-e-commerce-8f68.onrender.com/api/orders?limit=100', {
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

  const handleUpdateOrderStatus = async (orderId) => {
    try {
      const response = await fetch(`https://electronic-e-commerce-8f68.onrender.com/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          orderStatus: trackingForm.orderStatus,
          trackingNumber: trackingForm.trackingNumber || undefined,
          estimatedDelivery: trackingForm.estimatedDelivery || undefined,
          currentLocation: trackingForm.currentLocation || undefined,
          deliveryPartner: {
            name: trackingForm.deliveryPartnerName || undefined,
            phone: trackingForm.deliveryPartnerPhone || undefined,
            vehicleNumber: trackingForm.deliveryPartnerVehicle || undefined
          },
          trackingNote: trackingForm.trackingNote || undefined
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrders(orders.map(order => 
          order._id === orderId ? data.order : order
        ));
        setEditingOrder(null);
        setTrackingForm({
          orderStatus: '',
          trackingNumber: '',
          estimatedDelivery: '',
          currentLocation: '',
          deliveryPartnerName: '',
          deliveryPartnerPhone: '',
          deliveryPartnerVehicle: '',
          trackingNote: ''
        });
        toast.success('Order updated successfully');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    }
  };

  const openTrackingForm = (order) => {
    setEditingOrder(order._id);
    setTrackingForm({
      orderStatus: order.orderStatus || 'pending',
      trackingNumber: order.trackingNumber || '',
      estimatedDelivery: order.estimatedDelivery ? new Date(order.estimatedDelivery).toISOString().split('T')[0] : '',
      currentLocation: order.currentLocation || '',
      deliveryPartnerName: order.deliveryPartner?.name || '',
      deliveryPartnerPhone: order.deliveryPartner?.phone || '',
      deliveryPartnerVehicle: order.deliveryPartner?.vehicleNumber || '',
      trackingNote: ''
    });
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
      <div className="flex items-center justify-center py-20">
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
                            <img src={getImageUrl(item.image)} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-white/10 shrink-0" />
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
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => openTrackingForm(order)}
                          className="flex items-center space-x-1.5 text-yellow-400 hover:text-yellow-300 transition-colors text-sm font-medium"
                        >
                          <PencilSquareIcon className="h-4 w-4" />
                          <span>Update Tracking</span>
                        </button>
                        <Link
                          to={`/orders/${order._id}`}
                          className="flex items-center space-x-1.5 text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium"
                        >
                          <EyeIcon className="h-4 w-4" />
                          <span>View Details</span>
                        </Link>
                      </div>
                    </div>

                    {editingOrder === order._id && (
                      <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10 space-y-3">
                        <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                          <PencilSquareIcon className="h-4 w-4 text-yellow-400" />
                          Update Tracking Details
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-gray-400 mb-1 block">Status</label>
                            <select
                              value={trackingForm.orderStatus}
                              onChange={(e) => setTrackingForm({...trackingForm, orderStatus: e.target.value})}
                              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                            >
                              <option value="pending" className="bg-gray-800">Pending</option>
                              <option value="processing" className="bg-gray-800">Processing</option>
                              <option value="shipped" className="bg-gray-800">Shipped</option>
                              <option value="delivered" className="bg-gray-800">Delivered</option>
                              <option value="cancelled" className="bg-gray-800">Cancelled</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs text-gray-400 mb-1 block">Tracking Number</label>
                            <input
                              type="text"
                              value={trackingForm.trackingNumber}
                              onChange={(e) => setTrackingForm({...trackingForm, trackingNumber: e.target.value})}
                              placeholder="e.g. TRK123456789"
                              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-600"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-400 mb-1 block">Current Location</label>
                            <input
                              type="text"
                              value={trackingForm.currentLocation}
                              onChange={(e) => setTrackingForm({...trackingForm, currentLocation: e.target.value})}
                              placeholder="e.g. Mumbai Warehouse"
                              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-600"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-400 mb-1 block">Estimated Delivery</label>
                            <input
                              type="date"
                              value={trackingForm.estimatedDelivery}
                              onChange={(e) => setTrackingForm({...trackingForm, estimatedDelivery: e.target.value})}
                              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-400 mb-1 block">Delivery Partner Name</label>
                            <input
                              type="text"
                              value={trackingForm.deliveryPartnerName}
                              onChange={(e) => setTrackingForm({...trackingForm, deliveryPartnerName: e.target.value})}
                              placeholder="e.g. Rahul Kumar"
                              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-600"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-400 mb-1 block">Delivery Partner Phone</label>
                            <input
                              type="text"
                              value={trackingForm.deliveryPartnerPhone}
                              onChange={(e) => setTrackingForm({...trackingForm, deliveryPartnerPhone: e.target.value})}
                              placeholder="e.g. +91 9876543210"
                              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-600"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-400 mb-1 block">Vehicle Number</label>
                            <input
                              type="text"
                              value={trackingForm.deliveryPartnerVehicle}
                              onChange={(e) => setTrackingForm({...trackingForm, deliveryPartnerVehicle: e.target.value})}
                              placeholder="e.g. MH-12-AB-1234"
                              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-600"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-400 mb-1 block">Tracking Note</label>
                            <input
                              type="text"
                              value={trackingForm.trackingNote}
                              onChange={(e) => setTrackingForm({...trackingForm, trackingNote: e.target.value})}
                              placeholder="e.g. Package out for delivery"
                              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-gray-600"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => handleUpdateOrderStatus(order._id)}
                            className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={() => setEditingOrder(null)}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-gray-300 rounded-lg text-sm font-medium transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
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
  );
};

export default AdminOrdersPage;
