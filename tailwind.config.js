/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f5ff',
          100: '#e0e7ff',
          600: '#6366f1',
          700: '#4f46e5'
        },
        primary: {
          50: '#fff5fb',
          100: '#fbe7f6',
          300: '#f472b6',
          500: '#db2777',
          700: '#9f1239'
        },
        accent: {
          50: '#f6f5ff',
          300: '#a78bfa',
          600: '#7c3aed'
        }
      }
    }
  },
  plugins: []
};
