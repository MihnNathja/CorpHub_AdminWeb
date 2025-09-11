/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        "fade-in": "fadeIn 0.2s ease-in-out",
        "fade-out": "fadeOut 0.2s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(-5px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeOut: {
          "0%": { opacity: 1, transform: "translateY(0)" },
          "100%": { opacity: 0, transform: "translateY(-5px)" },
        },
      },
      colors: {
        primary: "#2563EB", // màu xanh chủ đạo
        secondary: "#F3F4F6", // màu nền nhẹ
      },
      borderRadius: {
        xl: "1rem",
      },
      boxShadow: {
        dropdown: "0 4px 6px rgba(0,0,0,0.1)",
      },
    },
  },
  plugins: [],
};
