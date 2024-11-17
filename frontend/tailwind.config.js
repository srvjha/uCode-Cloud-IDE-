/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
      textShadow: {
        glow: '0 0 3px rgba(255, 255, 255, 0.8), 0 0 2px rgba(255, 255, 255, 0.6)',
      },
      colors: {
        'editor-bg': '#020008',
      },
    },
  },
  plugins: [
    require('tailwindcss-textshadow'),
  ],
}

