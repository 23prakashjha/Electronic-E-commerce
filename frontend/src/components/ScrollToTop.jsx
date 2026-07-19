import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowUpIcon } from '@heroicons/react/24/outline';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!showTopBtn) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-[999] w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-110 flex items-center justify-center scroll-top-btn"
      aria-label="Scroll to top"
    >
      <ArrowUpIcon className="h-5 w-5" />
    </button>
  );
};

export default ScrollToTop;
