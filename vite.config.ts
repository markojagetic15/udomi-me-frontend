import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    port: 3000,
  },

  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        // Framework code changes rarely — its own chunk stays cached across deploys.
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          data: ['@tanstack/react-query', 'axios', 'i18next', 'react-i18next'],
        },
      },
    },
  },

  resolve: {
    alias: {
      _features: path.resolve(__dirname, 'src/_features/'),
      _entities: path.resolve(__dirname, 'src/_entities/'),
      _shared: path.resolve(__dirname, 'src/_shared/'),
      _pages: path.resolve(__dirname, 'src/_pages/'),
      _app: path.resolve(__dirname, 'src/_app/'),
      _widgets: path.resolve(__dirname, 'src/_widgets/'),
      _assets: path.resolve(__dirname, 'src/_assets/'),
    },
  },
});
