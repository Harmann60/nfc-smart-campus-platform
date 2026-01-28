/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="london"]'], // Optional: helps some plugins
  theme: {
    extend: {
      colors: {
        // These map directly to the variables in index.css
        'campus-bg': 'var(--bg-main)',
        'campus-card': 'var(--bg-card)',
        'campus-text': 'var(--text-main)',
        'campus-secondary': 'var(--text-muted)',
        'campus-border': 'var(--border-color)',
        'campus-primary': 'var(--accent)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}