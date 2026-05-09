/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sasuke': ['Cinzel', 'serif'],
        'zoro': ['Bangers', 'cursive'],
        'yuta': ['Special Elite', 'cursive'],
        'gohan': ['Orbitron', 'sans-serif'],
        'ichigo': ['Russo One', 'sans-serif'],
        'igris': ['MedievalSharp', 'cursive'],
        'goku': ['Luckiest Guy', 'cursive'],
        'jinwoo': ['Exo 2', 'sans-serif'],
      },
      colors: {
        'system-blue': 'var(--system-color, #00d2ff)',
        'system-dark': '#0a0a0a',
        'system-black': '#000000',
      },
      boxShadow: {
        'neon': '0 0 5px var(--system-color, #00d2ff), 0 0 20px var(--system-color, #00d2ff)',
        'neon-heavy': '0 0 10px var(--system-color, #00d2ff), 0 0 40px var(--system-color, #00d2ff), 0 0 60px var(--system-color, #00d2ff)',
      },
      backgroundImage: {
        'system-gradient': 'linear-gradient(180deg, rgba(0, 210, 255, 0.1) 0%, rgba(0, 0, 0, 0) 100%)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: 1, filter: 'brightness(1)' },
          '50%': { opacity: 0.7, filter: 'brightness(1.5)' },
        }
      }
    },
  },
  plugins: [],
}
