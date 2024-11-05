import { nextui } from '@nextui-org/react';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: '#8EAF9D',
            secondary: '#A6D8D4',
            accent: '#6B7D7D',
            complement: '#B9CDDA',
            highlight: '#D7DAE5',
            darkAccent: '#6B7D7D',
            cream: '#B9CDDA',
            white: '#fff',
          },
        },
      },
    }),
  ],
};
