import React, { useState, useEffect } from 'react';
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
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0
  });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || user.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/admin/login');
      return;
    }

    fetchData();
  }, []);

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
      if (usersData.success) setUsers(usersData.users);
      
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

  const user = JSON.parse(localStorage.getItem('user') || '{}');

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
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user.name}!</h1>
          <p className="text-purple-100">Manage your products, orders, and customers from here.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Link to="/admin/products/new" className="flex items-center space-x-3 bg-white/10 backdrop-blur-xl p-4 rounded-xl hover:bg-white/20 transition-all duration-300">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <PlusIcon className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-white font-semibold">Add Product</p>
              <p className="text-gray-400 text-sm">Create new product</p>
            </div>
          </Link>
          
          <Link to="/admin" className="flex items-center space-x-3 bg-white/10 backdrop-blur-xl p-4 rounded-xl hover:bg-white/20 transition-all duration-300">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <CubeIcon className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-white font-semibold">Manage Products</p>
              <p className="text-gray-400 text-sm">{products.length} products</p>
            </div>
          </Link>
          
          <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-xl p-4 rounded-xl">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <ShoppingBagIcon className="h-6 w-6 text-orange-400" />
            </div>
            <div>
              <p className="text-white font-semibold">View Orders</p>
              <p className="text-gray-400 text-sm">{orders.length} orders</p>
            </div>
          </div>
          
          <Link to="/" className="flex items-center space-x-3 bg-white/10 backdrop-blur-xl p-4 rounded-xl hover:bg-white/20 transition-all duration-300">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <ArrowLeftIcon className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="text-white font-semibold">Go to Store</p>
              <p className="text-gray-400 text-sm">View your store</p>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Orders</p>
                <p className="text-3xl font-bold text-white">{stats.totalOrders}</p>
              </div>
              <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                <ShoppingBagIcon className="h-7 w-7 text-blue-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-white">₹0</p>
              </div>
              <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center">
                <CurrencyDollarIcon className="h-7 w-7 text-green-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Products</p>
                <p className="text-3xl font-bold text-white">{stats.totalProducts}</p>
              </div>
              <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center">
                <CubeIcon className="h-7 w-7 text-purple-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
              </div>
              <div className="w-14 h-14 bg-orange-500/20 rounded-2xl flex items-center justify-center">
                <UsersIcon className="h-7 w-7 text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Products</h2>
            <Link to="/admin/products/new" className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-300">
              <PlusIcon className="h-5 w-5" />
              <span>Add Product</span>
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Product</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Stock</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img src={product.images?.[0]?.url || '/placeholder-product.jpg'} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                          <div>
                            <p className="text-white font-medium">{product.name}</p>
                            <p className="text-gray-400 text-sm">{product.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{product.category?.name || 'N/A'}</td>
                      <td className="px-6 py-4 text-white font-semibold">₹{product.price?.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${product.stock > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Link to={`/admin/products/${product._id}`} className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors">
                            <PencilIcon className="h-4 w-4" />
                          </Link>
                          <Link to={`/product/${product._id}`} target="_blank" className="p-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-colors">
                            <EyeIcon className="h-4 w-4" />
                          </Link>
                          <button onClick={() => handleDeleteProduct(product._id)} className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors">
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <CubeIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No products found. Add your first product!</p>
                      <Link to="/admin/products/new" className="inline-flex items-center space-x-2 mt-4 px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-semibold">
                        <PlusIcon className="h-5 w-5" />
                        <span>Add Product</span>
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden mt-8">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">Recent Orders</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Order ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Total</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {orders.length > 0 ? (
                  orders.slice(0, 10).map((order) => (
                    <tr key={order._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-white font-mono text-sm">{order._id?.slice(-8)}</td>
                      <td className="px-6 py-4 text-white font-medium">{order.shippingAddress?.fullName || 'N/A'}</td>
                      <td className="px-6 py-4 text-white font-semibold">₹{order.totalAmount?.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <select
                          value={order.orderStatus || 'pending'}
                          onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                          className="px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer bg-gray-500/20 text-gray-400"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <ShoppingBagIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No orders found yet.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
