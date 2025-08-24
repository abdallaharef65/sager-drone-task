/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        signature: ["Great Vibes"],
      },
      screens: {
        mobile: "270px",
      },
      colors: {
        clifford: "#da373d",
      },
    },
  },
  plugins: [],
};
