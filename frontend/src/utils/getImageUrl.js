const API_BASE = 'https://electronic-e-commerce-8f68.onrender.com';

const getImageUrl = (url, fallback = '/placeholder-product.jpg') => {
  if (!url) return fallback;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${API_BASE}${url}`;
};

export default getImageUrl;
