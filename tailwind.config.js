/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#000000', // Pure pitch black
          900: '#08090c', // Deep black sidebar/cards
          850: '#0e1015', // Dark elevated surface
          800: '#15171f', // Dark button/item hover
          750: '#1d212b',
          700: '#262a37',
          600: '#323748'
        },
        ocean: {
          900: '#0C2D48',
          800: '#145DA0',
          700: '#0E86D4',
          600: '#0284C7',
          500: '#0EA5E9',
          400: '#38BDF8'
        },
        turquoise: {
          600: '#0891B2',
          500: '#06B6D4',
          400: '#22D3EE',
          300: '#67E8F9',
          200: '#A5F3FC'
        },
        gold: {
          600: '#CA8A04',
          500: '#EAB308',
          400: '#FACC15',
          300: '#FDE047'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Playfair Display"', 'serif']
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.45)',
        'glow-red': '0 0 25px -5px rgba(239, 68, 68, 0.65)',
        'glow-gold': '0 0 25px -5px rgba(234, 179, 8, 0.45)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }
    },
  },
  plugins: [],
}

