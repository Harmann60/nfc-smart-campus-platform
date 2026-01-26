/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'campus-bg': '#F6F6F6',      // Background
        'campus-text': '#8785A2',    // Dark Purple/Grey (Text & Sidebar)
        'campus-primary': '#FFC7C7', // Salmon (Buttons/Highlights)
        'campus-secondary': '#FFE2E2' // Mist Rose (Soft backgrounds)
      }
    },
  },
  plugins: [],
}