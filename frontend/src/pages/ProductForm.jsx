import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { 
  PhotoIcon,
  PlusIcon,
  TrashIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  XMarkIcon,
  FolderPlusIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const API_BASE = 'http://localhost:5000';

const ProductForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
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
  
  const [ratingAverage, setRatingAverage] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(isEdit);
  const [newFeature, setNewFeature] = useState('');
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [urlInputVisible, setUrlInputVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const brands = [
    'Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Realme', 'Oppo', 'Vivo',
    'Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'MSI',
    'Sony', 'Canon', 'Nikon', 'Fujifilm',
    'JBL', 'Bose', 'Sennheiser', 'Audio-Technica',
    'LG', 'Panasonic', 'Philips', 'Logitech', 'Other'
  ];

  useEffect(() => {
    fetchCategories();
    if (isEdit) fetchProduct();
  }, [id]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/categories`);
      const data = await res.json();
      if (data.success) setCategories(data.categories);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProduct = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/products/${id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (data.success) {
        const p = data.product;
        setFormData({
          name: p.name || '',
          description: p.description || '',
          price: p.price || '',
          discountPrice: p.discountPrice || '',
          category: p.category?._id || '',
          brand: p.brand || '',
          stock: p.stock || '',
          specifications: p.specifications || {},
          features: p.features || [],
          images: p.images || []
        });
        setRatingAverage(p.ratings?.average || 0);
        setRatingCount(p.ratings?.count || 0);
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      toast.error('Failed to load product');
    } finally {
      setFetchingProduct(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const uploadFiles = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const body = new FormData();
      Array.from(files).forEach(f => body.append('images', f));
      const res = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body
      });
      const data = await res.json();
      if (data.success && data.images) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...data.images]
        }));
        toast.success(`${data.images.length} image(s) uploaded`);
      } else {
        toast.error(data.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    uploadFiles(e.target.files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files);
    }
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleUrlAdd = () => {
    if (imageUrl.trim()) {
      const url = imageUrl.trim();
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, { url, publicId: '' }]
      }));
      setImageUrl('');
      setUrlInputVisible(false);
      toast.success('Image URL added');
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    setCreatingCategory(true);
    try {
      const res = await fetch(`${API_BASE}/api/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name: newCategoryName.trim() })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Category created!');
        setFormData(prev => ({ ...prev, category: data.category._id }));
        setNewCategoryName('');
        setShowCategoryInput(false);
        await fetchCategories();
      } else {
        toast.error(data.message || 'Failed to create category');
      }
    } catch (err) {
      console.error('Category creation error:', err);
      toast.error('Failed to create category');
    } finally {
      setCreatingCategory(false);
    }
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
        ? `${API_BASE}/api/products/${id}`
        : `${API_BASE}/api/products`;
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
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
          category: formData.category || undefined,
          ratings: {
            average: ratingAverage,
            count: ratingCount
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(isEdit ? 'Product updated!' : 'Product created!');
        navigate('/admin/products');
      } else {
        toast.error(data.message || 'Failed to save product');
      }
    } catch (err) {
      console.error('Error saving product:', err);
      toast.error('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingProduct) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-purple-500 border-t-transparent"></div>
          <p className="text-gray-400 text-sm">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-5 border-b border-white/10 flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h2 className="text-base font-bold text-white">Basic Information</h2>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/40 transition-all"
                    placeholder="e.g. Samsung Galaxy S24 Ultra"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Brand</label>
                  <select
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all appearance-none"
                  >
                    <option value="" className="bg-gray-900">Select Brand</option>
                    {brands.map(b => (
                      <option key={b} value={b} className="bg-gray-900">{b}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</label>
                    <button
                      type="button"
                      onClick={() => setShowCategoryInput(!showCategoryInput)}
                      className="flex items-center space-x-1 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      <FolderPlusIcon className="h-3.5 w-3.5" />
                      <span>New</span>
                    </button>
                  </div>
                  {showCategoryInput ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="flex-1 px-4 py-2.5 bg-white/5 border border-purple-500/40 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
                        placeholder="Category name"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleCreateCategory())}
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={handleCreateCategory}
                        disabled={creatingCategory || !newCategoryName.trim()}
                        className="px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-xl transition-colors disabled:opacity-40"
                      >
                        {creatingCategory ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-400 border-t-transparent"></div>
                        ) : (
                          <PlusIcon className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setShowCategoryInput(false); setNewCategoryName(''); }}
                        className="px-2 py-2 text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all appearance-none"
                    >
                      <option value="" className="bg-gray-900">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id} className="bg-gray-900">{cat.name}</option>
                      ))}
                    </select>
                  )}
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Price (INR) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Discount Price</label>
                  <input
                    type="number"
                    name="discountPrice"
                    value={formData.discountPrice}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all resize-none"
                  placeholder="Describe the product features, specifications, and selling points..."
                />
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                  <PhotoIcon className="h-4 w-4 text-indigo-400" />
                </div>
                <h2 className="text-base font-bold text-white">Product Images</h2>
                {uploading && (
                  <div className="flex items-center space-x-2 text-xs text-indigo-400">
                    <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-indigo-400 border-t-transparent"></div>
                    <span>Uploading...</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setUrlInputVisible(!urlInputVisible)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors text-xs font-medium"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span>Add URL</span>
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-colors text-xs font-medium disabled:opacity-40"
                >
                  <CloudArrowUpIcon className="h-4 w-4" />
                  <span>Upload</span>
                </button>
              </div>
            </div>

            {urlInputVisible && (
              <div className="px-5 pt-4 pb-2">
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-white/5 border border-blue-500/40 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                    placeholder="Paste image URL and press Enter"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleUrlAdd())}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleUrlAdd}
                    disabled={!imageUrl.trim()}
                    className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl transition-colors text-sm font-medium disabled:opacity-40"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => { setUrlInputVisible(false); setImageUrl(''); }}
                    className="px-2 py-2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="p-5">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              {formData.images.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative group aspect-square">
                        <img
                          src={img.url.startsWith('http') ? img.url : `${API_BASE}${img.url}`}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover rounded-xl bg-white/5"
                        />
                        <div className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="p-2 bg-red-500 rounded-lg text-white hover:bg-red-600 transition-colors"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                        {index === 0 && (
                          <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-purple-600 text-white text-[10px] font-bold rounded-md">Primary</span>
                        )}
                      </div>
                    ))}
                  </div>
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                      dragOver
                        ? 'border-purple-400 bg-purple-500/10'
                        : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'
                    }`}
                  >
                    <CloudArrowUpIcon className={`h-6 w-6 mx-auto mb-1.5 ${dragOver ? 'text-purple-400' : 'text-gray-600'}`} />
                    <p className={`text-xs ${dragOver ? 'text-purple-400' : 'text-gray-500'}`}>
                      {dragOver ? 'Drop here to add more' : 'Drag & drop or click to add more'}
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    dragOver
                      ? 'border-purple-400 bg-purple-500/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <PhotoIcon className={`h-10 w-10 mx-auto mb-3 ${dragOver ? 'text-purple-400' : 'text-gray-700'}`} />
                  <p className={`text-sm mb-1 font-medium ${dragOver ? 'text-purple-400' : 'text-gray-400'}`}>
                    Drag & drop images here
                  </p>
                  <p className="text-gray-600 text-xs mb-3">or click to browse</p>
                  <p className="text-gray-700 text-[11px]">JPG, PNG, GIF, WebP - Max 5MB per file</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-5 border-b border-white/10 flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="h-4 w-4 text-green-400" />
              </div>
              <h2 className="text-base font-bold text-white">Key Features</h2>
            </div>
            <div className="p-5">
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
                  placeholder="e.g. 120Hz AMOLED Display"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl transition-colors"
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>
              {formData.features.length > 0 ? (
                <div className="space-y-1.5">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between bg-white/5 px-3.5 py-2 rounded-lg group hover:bg-white/10 transition-colors">
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <CheckCircleIcon className="h-4 w-4 text-green-400/60 shrink-0" />
                        <span className="text-gray-300 text-sm truncate">{feature}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(index)}
                        className="p-1 text-gray-600 hover:text-red-400 transition-colors shrink-0"
                      >
                        <TrashIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-sm text-center py-3">No features added</p>
              )}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-5 border-b border-white/10 flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
              </div>
              <h2 className="text-base font-bold text-white">Specifications</h2>
            </div>
            <div className="p-5">
              <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <input
                  type="text"
                  value={specKey}
                  onChange={(e) => setSpecKey(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
                  placeholder="Key (e.g. Display)"
                />
                <input
                  type="text"
                  value={specValue}
                  onChange={(e) => setSpecValue(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
                  placeholder="Value (e.g. 6.5 inch AMOLED)"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSpecification())}
                />
                <button
                  type="button"
                  onClick={handleAddSpecification}
                  className="px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl transition-colors"
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>
              {Object.entries(formData.specifications).length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {Object.entries(formData.specifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between bg-white/5 px-3.5 py-2 rounded-lg group hover:bg-white/10 transition-colors">
                      <div className="flex items-center space-x-2 min-w-0">
                        <span className="text-purple-400/70 text-sm font-medium shrink-0">{key}</span>
                        <span className="text-gray-600 text-sm">:</span>
                        <span className="text-gray-300 text-sm truncate">{value}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecification(key)}
                        className="p-1 text-gray-600 hover:text-red-400 transition-colors shrink-0"
                      >
                        <TrashIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-sm text-center py-3">No specifications added</p>
              )}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-5 border-b border-white/10 flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <StarSolidIcon className="h-4 w-4 text-yellow-400" />
              </div>
              <h2 className="text-base font-bold text-white">Ratings & Reviews</h2>
            </div>
            <div className="p-5">
              <p className="text-gray-500 text-xs mb-4">Set the initial average rating and review count for this product. These values are normally auto-calculated from customer reviews, but you can override them here.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Average Rating</label>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRatingAverage(star === ratingAverage ? 0 : star)}
                          onMouseEnter={() => setHoveredStar(star)}
                          onMouseLeave={() => setHoveredStar(0)}
                          className="p-0.5 transition-transform hover:scale-110"
                        >
                          <StarSolidIcon
                            className={`h-7 w-7 transition-colors ${
                              star <= (hoveredStar || ratingAverage)
                                ? 'text-yellow-400'
                                : 'text-gray-700'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    {ratingAverage > 0 && (
                      <span className="text-sm text-gray-400 font-medium">{ratingAverage}.0</span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Review Count</label>
                  <input
                    type="number"
                    min="0"
                    value={ratingCount}
                    onChange={(e) => setRatingCount(Math.max(0, Number(e.target.value)))}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
            <Link
              to="/admin/products"
              className="px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-400 rounded-xl transition-colors text-sm font-medium text-center border border-white/10"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex items-center justify-center space-x-2 px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-green-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span className="text-sm">Saving...</span>
                </>
              ) : (
                <>
                  <CloudArrowUpIcon className="h-5 w-5" />
                  <span className="text-sm">{isEdit ? 'Update Product' : 'Create Product'}</span>
                </>
              )}
            </button>
          </div>
        </form>
    </div>
  );
};

export default ProductForm;
