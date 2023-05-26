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
          50: '#CEEFEF', // Lightest
          100: '#9EDFDF',
          200: '#6ECFCF',
          300: '#3FC0BF',
          400: '#10B0AF',
          500: '#029B9B', // Base
          600: '#027F7F',
          700: '#023436', // Provided 700 shade
          800: '#021A1A',
          900: '#020000', // Darkest
        },
        // Secondary
        secondary: {
          50: '#FFFFFF', // Lightest
          100: '#F2F6F8',
          200: '#E5ECF1',
          300: '#D8E2EA',
          400: '#CBDAE3',
          500: '#BBC7CE', // Provided color (Assumed as 500)
          600: '#9DA4A8',
          700: '#7E8182',
          800: '#5F5E5C',
          900: '#40403B', // Darkest
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
