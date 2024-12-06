/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        md: "2rem",
      },
      screens: {
        sm: "375px",
        md: "768px",
        lg: "1200px",
      },
    },

    extend: {},
  },
  plugins: [require("daisyui")],
};
