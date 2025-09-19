/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Orbitron"', ...defaultTheme.fontFamily.sans],
        mono: ['Menlo', 'Monaco', ...defaultTheme.fontFamily.mono],
      },
      colors: {
        'emam-green': '#307c3c',
        'emam-accent': '#55D226',
        'primary': '#307c3c',
        'background': {
          light: '#f7f7f7',
          dark: '#1a1a1a',
        },
        'card': {
          light: '#ffffff',
          dark: '#242424',
        },
        'text-main': {
          light: '#1a1a1a',
          dark: '#f7f7f7',
        },
        'text-muted': {
          light: '#6b7280',
          dark: '#9ca3af',
        },
      },
      animation: {
        'spin-slow': 'spin 10s linear infinite',
        'blink': 'blink 1s step-end infinite',
        'float-around': 'float-around 15s ease-in-out infinite', // New multi-directional float
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'float-around': { // New keyframes for complex movement
          '0%, 100%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(20px, 40px)' },
          '50%': { transform: 'translate(-30px, -10px)' },
          '75%': { transform: 'translate(10px, -30px)' },
        },
      },
    },
  },
  plugins: [],
}