import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  FunnelIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import ProductCard from '../components/ProductCard';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    rating: searchParams.get('rating') || '',
    sort: searchParams.get('sort') || 'createdAt',
    order: searchParams.get('order') || 'desc',
    search: searchParams.get('search') || '',
  });

  const brands = [
    'Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Realme', 'Oppo', 'Vivo',
    'Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'MSI',
    'Sony', 'Canon', 'Nikon', 'Fujifilm',
    'JBL', 'Bose', 'Sennheiser', 'Audio-Technica',
    'LG', 'Panasonic', 'Philips', 'Logitech',
  ];

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [searchParams]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://electronic-e-commerce-8f68.onrender.com/api/categories');
      const data = await response.json();
      if (data.success) setCategories(data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(searchParams);
      if (!params.get('page')) params.set('page', '1');
      const response = await fetch(`https://electronic-e-commerce-8f68.onrender.com/api/products?${params.toString()}`);
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
        setTotalProducts(data.total);
        setCurrentPage(data.page);
        setTotalPages(data.pages);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach((k) => {
      if (newFilters[k]) params.set(k, newFilters[k]);
    });
    params.set('page', '1');
    setSearchParams(params);
  };

  const clearFilters = () => {
    const cleared = {
      category: '', brand: '', minPrice: '', maxPrice: '',
      rating: '', sort: 'createdAt', order: 'desc', search: '',
    };
    setFilters(cleared);
    setSearchParams({});
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeFilterPills = () => {
    const pills = [];
    const catObj = categories.find((c) => c._id === filters.category);
    if (catObj) pills.push({ key: 'category', label: catObj.name, value: filters.category });
    if (filters.brand) pills.push({ key: 'brand', label: filters.brand, value: filters.brand });
    if (filters.minPrice) pills.push({ key: 'minPrice', label: `Min ₹${filters.minPrice}`, value: filters.minPrice });
    if (filters.maxPrice) pills.push({ key: 'maxPrice', label: `Max ₹${filters.maxPrice}`, value: filters.maxPrice });
    if (filters.rating) pills.push({ key: 'rating', label: `${filters.rating}+ Stars`, value: filters.rating });
    if (filters.search) pills.push({ key: 'search', label: `"${filters.search}"`, value: filters.search });
    return pills;
  };

  const pills = activeFilterPills();
  const activeCategoryName = categories.find((c) => c._id === filters.category)?.name;

  const renderPagination = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    return (
      <nav className="flex items-center justify-center gap-2 mt-12" aria-label="Pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Prev
        </button>
        {start > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="w-10 h-10 text-sm rounded-lg border border-gray-300 bg-white font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              1
            </button>
            {start > 2 && <span className="px-1 text-gray-400">...</span>}
          </>
        )}
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`w-10 h-10 text-sm rounded-lg font-medium transition-all ${
              page === currentPage
                ? 'bg-gray-900 text-white border border-gray-900 shadow-md'
                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="px-1 text-gray-400">...</span>}
            <button
              onClick={() => handlePageChange(totalPages)}
              className="w-10 h-10 text-sm rounded-lg border border-gray-300 bg-white font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {totalPages}
            </button>
          </>
        )}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </nav>
    );
  };

  const sortOptions = [
    { value: 'createdAt-desc', label: 'Latest First' },
    { value: 'createdAt-asc', label: 'Oldest First' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
    { value: 'ratings.average-desc', label: 'Highest Rated' },
    { value: 'salesCount-desc', label: 'Best Selling' },
  ];

  const FilterPanel = ({ className = '' }) => (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
        <div className="relative">
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-colors bg-gray-50 placeholder:text-gray-400"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4.5 w-4.5 text-gray-400" />
        </div>
      </div>

      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-colors bg-gray-50"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Brand</label>
        <select
          value={filters.brand}
          onChange={(e) => handleFilterChange('brand', e.target.value)}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-colors bg-gray-50"
        >
          <option value="">All Brands</option>
          {brands.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range</label>
        <div className="flex gap-3">
          <input
            type="number"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            placeholder="Min"
            className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-colors bg-gray-50 placeholder:text-gray-400"
          />
          <input
            type="number"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            placeholder="Max"
            className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-colors bg-gray-50 placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="mb-2">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Rating</label>
        <select
          value={filters.rating}
          onChange={(e) => handleFilterChange('rating', e.target.value)}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-colors bg-gray-50"
        >
          <option value="">All Ratings</option>
          <option value="4">4+ Stars</option>
          <option value="3">3+ Stars</option>
          <option value="2">2+ Stars</option>
          <option value="1">1+ Stars</option>
        </select>
      </div>
    </div>
  );

  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-64 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-3.5 w-3.5 bg-gray-200 rounded" />
          ))}
        </div>
        <div className="h-6 bg-gray-200 rounded w-1/3 pt-2" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      {/* Mobile Drawer Backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Mobile Filter Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Filters</h2>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        <div className="overflow-y-auto h-[calc(100%-65px)] p-5">
          <FilterPanel className="!shadow-none !border-0 !p-0" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb / Heading */}
        <nav className="flex items-center text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">
            {activeCategoryName || 'All Products'}
          </span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {activeCategoryName || 'All Products'}
              </h1>
              {!loading && (
                <p className="text-gray-500 mt-1 text-sm">
                  Showing <span className="font-semibold text-gray-900">{products.length}</span> of{' '}
                  <span className="font-semibold text-gray-900">{totalProducts}</span> products
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile filter button */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FunnelIcon className="h-4 w-4" />
                Filters
                {pills.length > 0 && (
                  <span className="ml-1 w-5 h-5 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center">
                    {pills.length}
                  </span>
                )}
              </button>

              {/* Sort */}
              <div className="relative">
                <select
                  value={`${filters.sort}-${filters.order}`}
                  onChange={(e) => {
                    const [sort, order] = e.target.value.split('-');
                    handleFilterChange('sort', sort);
                    handleFilterChange('order', order);
                  }}
                  className="appearance-none pl-3 pr-9 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-colors cursor-pointer"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Active Filter Pills */}
        {pills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {pills.map((pill) => (
              <button
                key={pill.key}
                onClick={() => handleFilterChange(pill.key, '')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-full hover:bg-gray-700 transition-colors group"
              >
                {pill.label}
                <XMarkIcon className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full hover:bg-gray-200 transition-colors"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:w-72 flex-shrink-0">
            <div className="sticky top-24">
              <FilterPanel />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
                {totalPages > 1 && renderPagination()}
              </>
            ) : (
              <div className="text-center py-24 bg-white rounded-2xl border border-gray-200">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
                  <MagnifyingGlassIcon className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  We couldn't find any products matching your current filters. Try adjusting your search or browse all products.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
