import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';
import tailwindcss from 'tailwindcss';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },

  server: {
    port: 3000,
  },

  build: {
    target: 'esnext',
  },

  define: { global: 'window' },

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
