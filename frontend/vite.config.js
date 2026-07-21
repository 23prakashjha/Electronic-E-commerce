import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react', 'react-dom']
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://electronic-e-commerce-8f68.onrender.com',
        changeOrigin: true
      },
      '/uploads': {
        target: 'https://electronic-e-commerce-8f68.onrender.com',
        changeOrigin: true
      }
    }
  }
})
