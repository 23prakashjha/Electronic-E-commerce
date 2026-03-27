import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CubeIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || user.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/admin/login');
      return;
    }

    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products?limit=100', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

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
            <h1 className="text-3xl font-bold text-white">Manage Products</h1>
            <p className="text-gray-400 mt-1">{products.length} products total</p>
          </div>
          <Link
            to="/admin/products/new"
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-300"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Product</span>
          </Link>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <div className="relative max-w-md">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Product</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Brand</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Stock</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {currentProducts.length > 0 ? (
                  currentProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={product.images?.[0]?.url || '/placeholder-product.jpg'}
                            alt={product.name}
                            className="w-14 h-14 rounded-lg object-cover"
                          />
                          <div>
                            <p className="text-white font-medium">{product.name}</p>
                            <p className="text-gray-400 text-sm">{product.description?.slice(0, 50)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-300">{product.category?.name || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-300">{product.brand || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <span className="text-white font-bold text-lg">₹{product.price?.toLocaleString()}</span>
                          {product.discountPrice && (
                            <div>
                              <span className="text-gray-400 text-sm line-through">₹{product.discountPrice?.toLocaleString()}</span>
                              <span className="ml-2 text-green-400 text-sm">
                                -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          product.stock > 10 
                            ? 'bg-green-500/20 text-green-400' 
                            : product.stock > 0
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/admin/products/${product._id}`}
                            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </Link>
                          <Link
                            to={`/product/${product._id}`}
                            target="_blank"
                            className="p-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-colors"
                            title="View Product"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <CubeIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400 text-lg">No products found</p>
                      <Link
                        to="/admin/products/new"
                        className="inline-flex items-center space-x-2 mt-4 px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-semibold"
                      >
                        <PlusIcon className="h-5 w-5" />
                        <span>Add First Product</span>
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="p-4 border-t border-white/10 flex items-center justify-between">
              <p className="text-gray-400 text-sm">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length} products
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 bg-white/10 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      currentPage === index + 1
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 bg-white/10 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProductsPage;
