import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CubeIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import getImageUrl from '../utils/getImageUrl';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/admin/login');
      return;
    }

    fetchProducts();
  }, [isAuthenticated, user]);

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
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-purple-500 border-t-transparent"></div>
          <p className="text-gray-400 text-sm">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Manage Products</h1>
            <p className="text-gray-400 mt-1 text-sm">{filteredProducts.length} of {products.length} products</p>
          </div>
          <Link
            to="/admin/products/new"
            className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-lg shadow-emerald-600/20"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Product</span>
          </Link>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search by name, brand, or category..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all text-sm"
              />
              {searchTerm && (
                <button onClick={() => { setSearchTerm(''); setCurrentPage(1); }} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Product</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Brand</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Price</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Stock</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Rating</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {currentProducts.length > 0 ? (
                  currentProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center space-x-3">
                          <img
                            src={getImageUrl(product.images?.[0]?.url)}
                            alt={product.name}
                            className="w-11 h-11 rounded-lg object-cover bg-white/10"
                          />
                          <div className="min-w-0">
                            <p className="text-white font-medium text-sm truncate max-w-[220px]">{product.name}</p>
                            <p className="text-gray-500 text-xs truncate max-w-[220px]">{product.description?.slice(0, 50)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-300 text-sm">{product.category?.name || 'N/A'}</td>
                      <td className="px-5 py-3 text-gray-300 text-sm">{product.brand || 'N/A'}</td>
                      <td className="px-5 py-3">
                        <div>
                          <span className="text-white font-bold text-sm">₹{product.price?.toLocaleString()}</span>
                          {product.discountPrice && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500 text-xs line-through">₹{product.discountPrice?.toLocaleString()}</span>
                              <span className="text-green-400 text-xs font-medium">
                                -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.stock > 10 
                            ? 'bg-green-500/20 text-green-400' 
                            : product.stock > 0
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <StarSolidIcon
                                key={s}
                                className={`h-3.5 w-3.5 ${s <= Math.round(product.ratings?.average || 0) ? 'text-yellow-400' : 'text-gray-700'}`}
                              />
                            ))}
                          </div>
                          <span className="text-gray-300 text-sm font-medium">{(product.ratings?.average || 0).toFixed(1)}</span>
                          <span className="text-gray-600 text-xs">({product.ratings?.count || 0})</span>
                        </div>
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
                    <td colSpan="7" className="px-5 py-12 text-center">
                      <CubeIcon className="h-12 w-12 text-gray-700 mx-auto mb-3" />
                      <p className="text-gray-400 text-sm mb-3">No products found</p>
                      <Link to="/admin/products/new" className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold">
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
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <div key={product._id} className="p-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-start space-x-3">
                    <img src={getImageUrl(product.images?.[0]?.url)} alt={product.name} className="w-14 h-14 rounded-lg object-cover bg-white/10 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">{product.name}</p>
                      <p className="text-gray-500 text-xs">{product.brand || 'N/A'} &middot; {product.category?.name || 'N/A'}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-white font-bold text-sm">₹{product.price?.toLocaleString()}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          product.stock > 10 ? 'bg-green-500/20 text-green-400' : product.stock > 0 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {product.stock > 0 ? `${product.stock}` : 'OOS'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <StarSolidIcon
                              key={s}
                              className={`h-3 w-3 ${s <= Math.round(product.ratings?.average || 0) ? 'text-yellow-400' : 'text-gray-700'}`}
                            />
                          ))}
                        </div>
                        <span className="text-gray-400 text-xs">{(product.ratings?.average || 0).toFixed(1)} ({product.ratings?.count || 0})</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <Link to={`/admin/products/${product._id}`} className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg" title="Edit">
                          <PencilIcon className="h-3.5 w-3.5" />
                        </Link>
                        <Link to={`/product/${product._id}`} target="_blank" className="p-1.5 bg-purple-500/10 text-purple-400 rounded-lg" title="View">
                          <EyeIcon className="h-3.5 w-3.5" />
                        </Link>
                        <button onClick={() => handleDeleteProduct(product._id)} className="p-1.5 bg-red-500/10 text-red-400 rounded-lg" title="Delete">
                          <TrashIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <CubeIcon className="h-12 w-12 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No products found</p>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="p-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-gray-500 text-xs">
                {indexOfFirstItem + 1}&ndash;{Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length}
              </p>
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed border border-white/5"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </button>
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  if (totalPages > 7) {
                    if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                      return (
                        <button
                          key={index}
                          onClick={() => setCurrentPage(page)}
                          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === page
                              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                              : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }
                    if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={index} className="text-gray-600 px-1">...</span>;
                    }
                    return null;
                  }
                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed border border-white/5"
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
    </div>
  );
};

export default AdminProductsPage;
