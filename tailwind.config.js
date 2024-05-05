/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    colors: {
      ...colors,
      gray: {
        100: '#F1F4F7',
        200: '#F2F3F5',
        300: '#E8ECEF',
        400: '#A9A9A9',
        500: '#727272',
        800: '#242424',
        900: '#131313',
      },
      theme: '#36CE00',
    },
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    ({ addUtilities }) => {
      addUtilities({
        '.blockquote': {
          '@apply py-1 px-4 my-1 bg-gray-200 dark:bg-gray-800 rounded !border-l-4 !border-l-gray-400 dark:!border-l-gray-500':
            {},
        },
        '.word-break': {
          wordBreak: 'break-word',
        },
      })
    },
  ],
}
