/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-green': '#22c55e',
        'primary-green-dark': '#16a34a',
        'primary-orange': '#f97316',
        'dark': '#0a0f1e',
        'dark2': '#111827',
        'card': '#1a2235',
        'card2': '#1e283b',
        'text': '#e2e8f0',
        'muted': '#94a3b8',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
