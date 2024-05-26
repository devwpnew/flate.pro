module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./@modules/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      flex: {
        2: "2 2 0%",
      },
    },

    screens: {
      sm: "450px",
      // => @media (min-width: 320px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1440px",
      // => @media (min-width: 1200px) { ... }

      // 'xl': '1200px',
      // => @media (min-width: 1280px) { ... }

      // '2xl': '1200px',
      // => @media (min-width: 1536px) { ... }
    },
    colors: {
      transparent: "transparent",
      inherit: "inherit",
      blue: "#4BA5F8",
      bluelight2: "#EFF6FF",
      bluelight: "#3D82F6",
      bluelighter: "#F0F6FE",
      bluefocus: "#E0EBFE",
      bluedeep: "#2563EB",
      grey: "#666666",
      greyC4: "#C4C4C4",
      greyF3: "#F3F4F6",
      greyA0: "#A0A3A9",
      green: "#4DBD37",
      red: "#F4505B",
      greylight: "#F8FAFC",
      greyextralight: "#FCFCFC",
      greymiddle: "#A0A0A0",
      greyborder: "#E5E7EB",
      primary: "#1F1F1F",
      white: "#ffffff",
      yellow: "rgba(249, 216, 94, 0.15)",
      red: "#F23C34",
      red_light: "#F4505B",
      red_200: "#fecaca",
      orange: "#F8BE1A",
      backdrop: "rgba(0, 0, 0, 0.7)",
      blue_500: "rgba(4,104,255,.1)",
    },
    fontSize: {
      exs: ".625rem",
      xs: ".75rem",
      sm: "14px",
      tiny: ".875rem",
      base: "16px",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "4rem",
      "7xl": "5rem",
    },
    gridTemplateRows: {
      "home-layout": "auto auto",
    },
  },
  plugins: [],
};
