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

  resolve: {
    alias: [
      {
        find: '@assets',
        replacement: path.resolve(__dirname, './src/assets'),
      },
      {
        find: '@pages',
        replacement: path.resolve(__dirname, './src/pages'),
      },
      {
        find: '@tests',
        replacement: path.resolve(__dirname, './src/tests'),
      },
      {
        find: '@entities',
        replacement: path.resolve(__dirname, './src/entities'),
      },
      {
        find: '@features',
        replacement: path.resolve(__dirname, './src/features'),
      },
      {
        find: '@widgets',
        replacement: path.resolve(__dirname, './src/widgets'),
      },
      {
        find: '@shared',
        replacement: path.resolve(__dirname, './src/shared'),
      },
      {
        find: '@app',
        replacement: path.resolve(__dirname, './src/app'),
      },
    ],
  },
});
