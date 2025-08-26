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
        }
      }
    }
  },
  plugins: []
};
