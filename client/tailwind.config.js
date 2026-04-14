/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        panel: '#1f1f1f',
        board: '#0a0a0a',
      },
    },
  },
  plugins: [],
}

