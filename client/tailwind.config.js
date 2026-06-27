/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#0a0a0a",
        darkSurface: "#141414",
        darkCard: "#1f1f1f",
        primary: "#eab308", // Golden/Yellow
        primaryHover: "#ca8a04",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(234, 179, 8, 0.15)',
        'glow-strong': '0 0 30px rgba(234, 179, 8, 0.3)',
      }
    },
  },
  plugins: [],
}
