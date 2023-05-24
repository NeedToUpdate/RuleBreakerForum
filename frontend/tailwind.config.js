/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary
        primary: {
          100: '#F5FAFA', // Lightest
          200: '#EAF6F6',
          300: '#DFEDED',
          400: '#BFE0E0',
          500: '#9FD2D2', // Base
          600: '#8FBFBF',
          700: '#5F8080',
          800: '#466060',
          900: '#303F3F', // Darkest
        },
        // Secondary
        secondary: {
          100: '#F8F9FA', // Lightest
          200: '#E9ECEF',
          300: '#DEE2E6',
          400: '#CED4DA',
          500: '#ADB5BD', // Base
          600: '#6C757D',
          700: '#495057',
          800: '#343A40',
          900: '#212529', // Darkest
        },
        // Highlight
        highlight: {
          100: '#E6FEEA', // Lightest
          200: '#C3FBD1',
          300: '#A1F7B8',
          400: '#5BF086',
          500: '#15E954', // Base
          600: '#13D24D',
          700: '#0C8B34',
          800: '#096827',
          900: '#06451B', // Darkest
        },
      },
    },
  },
  plugins: [],
};
