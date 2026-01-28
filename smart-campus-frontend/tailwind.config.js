/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // <--- IMPORTANT: Enables toggling via class
  theme: {
    extend: {
      colors: {
        campus: {
          bg: 'var(--bg-main)',       // Auto-switches
          card: 'var(--bg-card)',     // Auto-switches
          text: 'var(--text-main)',   // Auto-switches
          secondary: 'var(--text-muted)',
          border: 'var(--border-color)',
          primary: 'var(--accent)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}