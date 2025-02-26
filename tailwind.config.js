/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'shopify': {
          green: '#008060',
          'green-dark': '#004C3F',
          'green-light': '#C1F0D0',
          surface: '#f6f6f7',
          text: '#202223',
          'text-secondary': '#6D7175',
          border: '#E1E3E5',
          'border-dark': '#8C9196',
          focus: '#5C6AC4'
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'San Francisco', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'sans-serif']
      }
    },
  },
  plugins: [],
};