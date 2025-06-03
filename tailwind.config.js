/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./docs/**/*.html",
    "./docs/**/*.js" // Include JS files in case you add classes dynamically
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#2F3E46',
        'accent': '#E07A5F',
        'bg-light': '#f1f1f2',
        'text-dark': '#1c1c1c',
        'heading-color': '#27296d',
        'theme-blue-static': '#27296d',
        'bg-dark': '#1D2021',
        'text-light': '#F0F3F4',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'dancing-script': ['"Dancing Script"', 'cursive'],
      }
    },
  },
  plugins: [],
  darkMode: 'class', // Enables dark mode based on a class on the html tag
}