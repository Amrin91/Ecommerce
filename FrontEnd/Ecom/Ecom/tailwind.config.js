// tailwind.config.js
import flowbitePlugin from 'flowbite/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/flowbite/**/*.js',
  ],
  theme: {
    extend: {
      screens: {
        'between-1024-1400': { 'raw': '(min-width: 1024px) and (max-width: 1400px)' },
      },
    },
  },
  plugins: [flowbitePlugin],
};
