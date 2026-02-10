import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import dotenv from 'dotenv';
import environment from 'vite-plugin-environment';

// Load environment variables
dotenv.config();

// Official Internet Identity provider URL
const OFFICIAL_II_URL = 'https://identity.ic0.app';

// Validate and set Internet Identity URL
const getInternetIdentityURL = () => {
  const configuredURL = process.env.II_URL;
  
  // If no URL is configured or it's not the official II URL, use the official one
  if (!configuredURL || !configuredURL.includes('identity.ic0.app')) {
    console.warn('Using official Internet Identity provider URL');
    return OFFICIAL_II_URL;
  }
  
  return configuredURL;
};

// Set the validated II_URL
process.env.II_URL = getInternetIdentityURL();

export default defineConfig({
  plugins: [
    react(),
    environment('all', { prefix: 'VITE_' }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:4943',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  define: {
    'process.env.II_URL': JSON.stringify(process.env.II_URL),
  },
});
