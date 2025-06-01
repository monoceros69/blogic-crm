import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  build: {
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    
    // Code splitting configuration
    rollupOptions: {
      output: {
        manualChunks: {
          // React ecosystem in its own chunk
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // Form handling libraries
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          
          // Data fetching and state management
          'query-vendor': ['@tanstack/react-query', '@tanstack/react-query-devtools', 'axios'],
          
          // Icons (only if used extensively)
          'icons': ['react-icons'],
          
          // Utilities
          'utils': ['bcryptjs'],
        },
      },
    },
    
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
  },
  
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})