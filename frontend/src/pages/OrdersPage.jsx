import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBagIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  EyeIcon,
  ArrowLeftIcon,
  FunnelIcon,
  BoltIcon,
  CreditCardIcon,
  MapPinIcon,
  XMarkIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to view your orders');
        return;
      }

      const response = await fetch('http://localhost:5000/api/orders/my-orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircleIcon className="h-5 w-5 text-emerald-500" />;
      case 'cancelled':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'shipped':
        return <TruckIcon className="h-5 w-5 text-blue-500" />;
      case 'processing':
        return <ClockIcon className="h-5 w-5 text-amber-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border border-red-200';
      case 'shipped':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'processing':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'pending':
        return 'bg-gray-50 text-gray-700 border border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  const filteredOrders = filterStatus === 'all' ? orders : orders.filter((order) => order.orderStatus === filterStatus);

  const statusCounts = {
    all: orders.length,
    pending: orders.filter((o) => o.orderStatus === 'pending').length,
    processing: orders.filter((o) => o.orderStatus === 'processing').length,
    shipped: orders.filter((o) => o.orderStatus === 'shipped').length,
    delivered: orders.filter((o) => o.orderStatus === 'delivered').length,
    cancelled: orders.filter((o) => o.orderStatus === 'cancelled').length,
  };

  const statusFilters = [
    { value: 'all', label: 'All Orders', count: statusCounts.all },
    { value: 'pending', label: 'Pending', count: statusCounts.pending },
    { value: 'processing', label: 'Processing', count: statusCounts.processing },
    { value: 'shipped', label: 'Shipped', count: statusCounts.shipped },
    { value: 'delivered', label: 'Delivered', count: statusCounts.delivered },
    { value: 'cancelled', label: 'Cancelled', count: statusCounts.cancelled },
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const orderTimeline = ['pending', 'processing', 'shipped', 'delivered'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-500 mt-2">Loading your orders...</p>
          </div>

          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-5 bg-gray-200 rounded w-32" />
                  <div className="h-5 bg-gray-200 rounded w-20" />
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-500 mt-2">Track and manage your orders</p>
        </div>

        {/* Filter Pills - Horizontally scrollable on mobile */}
        <div className="mb-6 sm:mb-8 -mx-4 sm:mx-0 px-4 sm:px-0">
          <div className="flex sm:flex-wrap gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setFilterStatus(filter.value)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
                  filterStatus === filter.value
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                {filter.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-md font-bold ${
                  filterStatus === filter.value
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-5">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
                <div className="p-5 sm:p-6">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-lg font-bold text-gray-900">
                          Order #{order._id.slice(-8)}
                        </h3>
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        ₹{order.totalPrice.toLocaleString('en-IN')}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.orderItems.length} {order.orderItems.length === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                  </div>

                  {/* Status Timeline */}
                  <div className="hidden sm:flex items-center gap-1 mb-5 px-2">
                    {orderTimeline.map((step, i) => {
                      const stepIndex = orderTimeline.indexOf(order.orderStatus);
                      const isActive = i <= stepIndex && order.orderStatus !== 'cancelled';
                      const isCurrent = step === order.orderStatus;
                      return (
                        <React.Fragment key={step}>
                          <div className="flex flex-col items-center gap-1.5">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                              isCurrent
                                ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-md shadow-blue-500/20'
                                : isActive
                                ? 'bg-blue-500'
                                : 'bg-gray-200'
                            }`}>
                              {isActive ? (
                                <CheckCircleIcon className="h-4 w-4 text-white" />
                              ) : (
                                <span className="text-xs font-bold text-gray-500">{i + 1}</span>
                              )}
                            </div>
                            <span className={`text-[10px] font-semibold capitalize ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                              {step}
                            </span>
                          </div>
                          {i < orderTimeline.length - 1 && (
                            <div className={`flex-1 h-0.5 mb-5 rounded-full transition-all duration-300 ${
                              i < stepIndex && order.orderStatus !== 'cancelled' ? 'bg-blue-400' : 'bg-gray-200'
                            }`} />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>

                  {/* Order Items Preview */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {order.orderItems.slice(0, 4).map((item, index) => (
                        <div key={index} className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-100">
                          <img
                            src={item.image || '/placeholder-product.jpg'}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-lg shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="font-medium text-gray-900 text-sm truncate">{item.name}</h4>
                            <p className="text-xs text-gray-500">
                              Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {order.orderItems.length > 4 && (
                      <p className="text-sm text-gray-500 mt-3 font-medium">
                        +{order.orderItems.length - 4} more items
                      </p>
                    )}
                  </div>

                  {/* Shipping Address */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <MapPinIcon className="h-4 w-4 text-gray-400" />
                      <h4 className="text-sm font-semibold text-gray-700">Shipping Address</h4>
                    </div>
                    <div className="text-sm text-gray-500 ml-6">
                      <p>{order.shippingAddress.fullName}, {order.shippingAddress.phone}</p>
                      <p>{order.shippingAddress.streetAddress}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                    </div>
                  </div>

                  {/* Status Message & Actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.orderStatus)}
                      <span className="text-sm font-medium text-gray-600">
                        {order.orderStatus === 'pending' && 'Order is pending confirmation'}
                        {order.orderStatus === 'processing' && 'Order is being processed'}
                        {order.orderStatus === 'shipped' && `Shipped${order.deliveredAt ? ` on ${formatDate(order.deliveredAt)}` : ''}`}
                        {order.orderStatus === 'delivered' && `Delivered${order.deliveredAt ? ` on ${formatDate(order.deliveredAt)}` : ''}`}
                        {order.orderStatus === 'cancelled' && 'Order has been cancelled'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-semibold text-sm bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors"
                      >
                        <EyeIcon className="h-4 w-4" />
                        View Details
                      </button>

                      {order.orderStatus === 'pending' && (
                        <button className="text-red-500 hover:text-red-700 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-red-50 transition-colors">
                          Cancel
                        </button>
                      )}

                      {order.orderStatus === 'delivered' && (
                        <button className="text-purple-600 hover:text-purple-700 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-purple-50 transition-colors">
                          Reorder
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center bg-white rounded-3xl shadow-xl shadow-gray-200/40 p-10 sm:p-16 border border-gray-100">
            <div className="w-28 h-28 bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-gray-200/50">
              <ShoppingBagIcon className="h-14 w-14 text-gray-300" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              {filterStatus === 'all' ? 'No orders yet' : `No ${filterStatus} orders`}
            </h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
              {filterStatus === 'all'
                ? 'Start shopping to see your orders here'
                : `You don't have any ${filterStatus} orders`}
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Continue Shopping
            </Link>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 rounded-t-3xl z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Order Details
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    #{selectedOrder._id.slice(-8)} &middot; {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Timeline in Modal */}
              <div className="bg-gray-50 rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  {orderTimeline.map((step, i) => {
                    const stepIndex = orderTimeline.indexOf(selectedOrder.orderStatus);
                    const isActive = i <= stepIndex && selectedOrder.orderStatus !== 'cancelled';
                    const isCurrent = step === selectedOrder.orderStatus;
                    return (
                      <React.Fragment key={step}>
                        <div className="flex flex-col items-center gap-2">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isCurrent
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-md shadow-blue-500/20'
                              : isActive
                              ? 'bg-blue-500'
                              : 'bg-gray-200'
                          }`}>
                            {isActive ? (
                              <CheckCircleIcon className="h-5 w-5 text-white" />
                            ) : (
                              <span className="text-sm font-bold text-gray-500">{i + 1}</span>
                            )}
                          </div>
                          <span className={`text-xs font-semibold capitalize ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                            {step}
                          </span>
                        </div>
                        {i < orderTimeline.length - 1 && (
                          <div className={`flex-1 h-1 rounded-full mx-2 ${
                            i < stepIndex && selectedOrder.orderStatus !== 'cancelled' ? 'bg-blue-400' : 'bg-gray-200'
                          }`} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
                {selectedOrder.orderStatus === 'cancelled' && (
                  <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 rounded-xl px-4 py-2.5 border border-red-200">
                    <XCircleIcon className="h-5 w-5" />
                    <span className="text-sm font-semibold">This order has been cancelled</span>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <ShoppingBagIcon className="h-5 w-5 text-gray-400" />
                  Order Items
                </h3>
                <div className="space-y-3">
                  {selectedOrder.orderItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <img
                        src={item.image || '/placeholder-product.jpg'}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-xl shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">{item.name}</h4>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {item.quantity} × ₹{item.price.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <span className="font-bold text-gray-900 shrink-0">
                        ₹{(item.quantity * item.price).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment & Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Payment Info */}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <CreditCardIcon className="h-5 w-5 text-gray-400" />
                    Payment Information
                  </h3>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Method</span>
                      <span className="font-semibold text-gray-900 capitalize">{selectedOrder.paymentInfo.method}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status</span>
                      <span className={`font-semibold capitalize px-2 py-0.5 rounded-md text-xs ${
                        selectedOrder.paymentInfo.status === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {selectedOrder.paymentInfo.status}
                      </span>
                    </div>
                    {selectedOrder.paymentInfo.paidAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Paid on</span>
                        <span className="font-semibold text-gray-900">{formatDate(selectedOrder.paymentInfo.paidAt)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-3">Order Summary</h3>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-semibold text-gray-900">₹{selectedOrder.itemsPrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Shipping</span>
                      <span className="font-semibold">
                        {selectedOrder.shippingPrice === 0 ? (
                          <span className="text-emerald-600">FREE</span>
                        ) : (
                          <span className="text-gray-900">₹{selectedOrder.shippingPrice.toLocaleString('en-IN')}</span>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tax (18% GST)</span>
                      <span className="font-semibold text-gray-900">₹{selectedOrder.taxPrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between pt-2.5 border-t border-gray-200">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        ₹{selectedOrder.totalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
