/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          burgundy: '#6B1D2F',
          darkBurgundy: '#4A1221',
          deepMaroon: '#360914',
          gold: '#C5A059',
          lightGold: '#E5C07B',
          softBlush: '#FDF7F5',
          paleRose: '#F9ECE8',
          cardBg: '#FFFFFF',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        cinzel: ['"Cinzel"', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
        script: ['"Great Vibes"', 'cursive'],
        alex: ['"Alex Brush"', 'cursive'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
