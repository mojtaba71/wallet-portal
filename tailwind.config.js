module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./src/**/*.scss"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "gray-50": "#F9F9F9",
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        blue: {
          100: "#E5EAFF",
          300: "#60A5FA",
          400: "#3A4DF8",
          500: "#2A3FF7",
          600: "#3D5EFF",
        },
        gray: {
          50: "#F2F2F2",
          200: "#9592A0",
          250: "#E5E4E7",
          350: "#F2F1F3",
          400: "#999999",
          600: "#625F6D",
          700: "#4A4750",
          800: "#333333",
          900: "#1C1B1F",
        },
      },
      fontFamily: {
        iransans: ["IranSans", "sans-serif"],
        inter: ["Inter", "system-ui", "sans-serif"],
        roboto: ["Roboto", "system-ui", "sans-serif"],
        "source-sans": ["Source Sans Pro", "system-ui", "sans-serif"],
        "open-sans": ["Open Sans", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0px 4px 27px 0px #00000040",
      },
    },
  },
  plugins: [],
};
