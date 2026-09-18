/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          pink: '#FADADD',
          blue: '#DCEBF7',
          green: '#DCFAD9',
          yellow: '#FEFCE8',
          lavender: '#E8DAEF',
          mint: '#D0F0C0',
        },
      },
    },
  },
  plugins: [],
}