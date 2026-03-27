import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  PhotoIcon,
  PlusIcon,
  TrashIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const ProductForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    category: '',
    brand: '',
    stock: '',
    specifications: {},
    features: [],
    images: []
  });
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(isEdit);
  const [newFeature, setNewFeature] = useState('');
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');

  const brands = [
    'Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Realme', 'Oppo', 'Vivo',
    'Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'MSI',
    'Sony', 'Canon', 'Nikon', 'Fujifilm',
    'JBL', 'Bose', 'Sennheiser', 'Audio-Technica',
    'LG', 'Panasonic', 'Philips', 'Logitech', 'Other'
  ];

  useEffect(() => {
    fetchCategories();
    if (isEdit) {
      fetchProduct();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        const product = data.product;
        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price || '',
          discountPrice: product.discountPrice || '',
          category: product.category?._id || '',
          brand: product.brand || '',
          stock: product.stock || '',
          specifications: product.specifications || {},
          features: product.features || [],
          images: product.images || []
        });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
    } finally {
      setFetchingProduct(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUrlAdd = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, { url, publicId: '' }]
      }));
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleAddSpecification = () => {
    if (specKey.trim() && specValue.trim()) {
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specKey]: specValue
        }
      }));
      setSpecKey('');
      setSpecValue('');
    }
  };

  const handleRemoveSpecification = (key) => {
    const newSpecs = { ...formData.specifications };
    delete newSpecs[key];
    setFormData(prev => ({ ...prev, specifications: newSpecs }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEdit 
        ? `http://localhost:5000/api/products/${id}`
        : 'http://localhost:5000/api/products';
      
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
          stock: Number(formData.stock),
          category: formData.category || undefined
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(isEdit ? 'Product updated successfully!' : 'Product created successfully!');
        navigate('/admin');
      } else {
        toast.error(data.message || 'Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingProduct) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/admin"
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
            <h1 className="text-xl font-bold text-white">
              {isEdit ? 'Edit Product' : 'Add New Product'}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-bold text-white mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  placeholder="Enter product name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Brand</label>
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                  <option value="" className="text-gray-900">Select Brand</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand} className="text-gray-900">{brand}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                  <option value="" className="text-gray-900">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id} className="text-gray-900">{cat.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Stock *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  placeholder="Enter stock quantity"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Price *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  placeholder="Enter price"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Discount Price</label>
                <input
                  type="number"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  placeholder="Enter discounted price"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                placeholder="Enter product description"
              />
            </div>
          </div>

          {/* Images */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Product Images</h2>
              <button
                type="button"
                onClick={handleImageUrlAdd}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl transition-colors"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Add Image URL</span>
              </button>
            </div>
            
            {formData.images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img.url}
                      alt={`Product ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <TrashIcon className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center">
                <PhotoIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No images added yet</p>
                <button
                  type="button"
                  onClick={handleImageUrlAdd}
                  className="mt-4 text-purple-400 hover:text-purple-300"
                >
                  Add Image URL
                </button>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-bold text-white mb-6">Key Features</h2>
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                placeholder="Enter a feature"
                onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl transition-colors"
              >
                <PlusIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-2">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center justify-between bg-white/5 px-4 py-2 rounded-lg">
                  <span className="text-gray-300">{feature}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-bold text-white mb-6">Specifications</h2>
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={specKey}
                onChange={(e) => setSpecKey(e.target.value)}
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                placeholder="Specification name (e.g., Display)"
              />
              <input
                type="text"
                value={specValue}
                onChange={(e) => setSpecValue(e.target.value)}
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                placeholder="Specification value (e.g., 6.5 inch)"
              />
              <button
                type="button"
                onClick={handleAddSpecification}
                className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl transition-colors"
              >
                <PlusIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(formData.specifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between bg-white/5 px-4 py-2 rounded-lg">
                  <span className="text-gray-300">{key}: {value}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSpecification(key)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-4">
            <Link
              to="/admin"
              className="px-6 py-3 bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 rounded-xl transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <CloudArrowUpIcon className="h-5 w-5" />
                  <span>{isEdit ? 'Update Product' : 'Create Product'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
