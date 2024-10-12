/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: { 
      colors: {
      primary: '#E2471D',
      secondary: '#643045'
      },
      fontFamily: {
        custom: ['usherwood', 'sans-serif'],
      },
    },
  },
  plugins: [],
};