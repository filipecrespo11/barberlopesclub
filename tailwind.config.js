/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fffbeb',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
        },
      },
      fontFamily: {
        sans: ["Roboto", "ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", 'Segoe UI', 'Helvetica Neue', "Arial", 'Noto Sans', "sans-serif"],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'pulse-slow': 'pulse 2s infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
    },
  },
  plugins: [],
}