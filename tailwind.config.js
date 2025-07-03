/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        primaryLight: "#3b82f6",
        primaryDark: "#1d4ed8",
        accent: { DEFAULT: "#60a5fa" },
        brandBackground: "#eff6ff",
      },
    },
  },
  plugins: [],
};
