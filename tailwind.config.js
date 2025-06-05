/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",       // App Router
    "./pages/**/*.{js,ts,jsx,tsx}",     // Caso ainda use Pages Router
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        testeverde: "#00ff00",
      },
      fontFamily: {
        sans: ['"Caveat"', 'cursive'],
      },
    },
  },
  plugins: [],
}