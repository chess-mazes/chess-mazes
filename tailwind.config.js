export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "chess-dark": "var(--chess-dark)",
        "chess-light": "var(--chess-light)",
      },
    },
  },
  plugins: [],
}