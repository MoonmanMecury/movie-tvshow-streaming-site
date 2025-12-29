/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#0f0f0f",
          gray: "#1f1f1f",
          red: "#e50914"
        }
      },
      aspectRatio: {
        'poster': '2/3',
        'video': '16/9',
      },
    },
  },
  plugins: [],
}