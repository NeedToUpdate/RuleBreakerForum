/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary
        primary: {
          100: '#E6F6FE', // Lightest
          200: '#CDEDFB',
          300: '#B4E3F8',
          400: '#7BD1F3',
          500: '#42BEEE', // Base
          600: '#3BAAE6',
          700: '#2699BF',
          800: '#1F7490',
          900: '#174F61', // Darkest
        },
        // Secondary
        secondary: {
          100: '#FFEFE6', // Lightest
          200: '#FFD9CC',
          300: '#FFC3B2',
          400: '#FF987F',
          500: '#FF6C4C', // Base
          600: '#E66144',
          700: '#993F2D',
          800: '#732F22',
          900: '#4D2017', // Darkest
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
