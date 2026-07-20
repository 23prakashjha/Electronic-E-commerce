const API_BASE = 'http://localhost:5000';

const getImageUrl = (url, fallback = '/placeholder-product.jpg') => {
  if (!url) return fallback;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${API_BASE}${url}`;
};

export default getImageUrl;
