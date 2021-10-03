module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      height: {
        "1/6+": "17%",
        "1/7": "14.28%",
        "1/8": "12.5%",
      },
      width: {
        "1/32": "3.125%",
        "2/32": "6.25%",
        "3/32": "9.375%",
        "4/32": "12.5%",
        "9/32": "28.125%",
        "13/24": "54.16%",
      },
      margin: {
        0.25: "0.0625rem",
        4.5: "1.125rem",
      },
      padding: {
        0.75: "0.1875rem",
      },
      invert: {
        25: ".25",
        50: ".5",
        75: ".75",
      },
      outline: {
        blue: "0.15rem solid #6dc9ff",
      },
      scale: {
        97: "0.975",
        102: "1.025",
      },
      minWidth: {
        "2/32": "5.00%",
        "30/32": "90.00%",
      },
    },
    maxWidth: {
      "2/32": "5.00%",
      "30/32": "90.00%",
    },
    fontSize: {
      tiny: ".63rem",
      xs: ".75rem",
      sm: ".875rem",
      "sm+": ".93rem",
      base: "1rem",
      "base-": "1.03rem",
      "base+": "1.06rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "2.5xl": "1.6rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "4rem",
      "7xl": "5rem",
    },
    borderWidth: {
      DEFAULT: "1px",
      0: "0",
      2: "2px",
      3: "3px",
      4: "4px",
      6: "6px",
      8: "8px",
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
