module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      lineHeight: {
        12: "3rem",
      },
      translate: {
        "5-": "1.11rem",
      },
      height: {
        "10.5": "2.625rem",
        "13": "3.25rem",
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
        "1/3+": "34.5%",
        "1/4+": "27%",
        "1/6+": "17%",
        "1/7": "14.28%",
        "1/8": "12.5%",
      },
      width: {
        "13": "3.25rem",
        "22": "5.5rem",
        "30": "7.5rem",
        "38": "9.5rem",
        "46": "11.5rem",
        "50": "12.5rem",
        "5/12": "41.66%",
        "1/32": "3.125%",
        "2/32": "6.25%",
        "3/32": "9.375%",
        "4/32": "12.5%",
        "9/32": "28.125%",
        "10/100": "10%",
        "11/100": "11%",
        "3/24": "11%",
        "5/24": "20.83%",
        "9/24-": "36.00%",
        "9/24": "37.50%",
        "11/24": "45.83%",
        "13/24": "54.16%",
        "15/24": "62.50%",
        "15/24+": "64.00%",
        "17/24": "70.83%",
        "19/24": "79.17%",
        "20/24": "83.33%",
        "21/24": "87.5%",
      },
      margin: {
        0.25: "0.0625rem",
        8.5: "2.125rem",
        9.5: "2.375rem",
        18: "4.5rem",
        "-4.5": "-1.125rem",
        "-5.5": "-1.375rem",
        "-6.5": "-1.625rem",
        "20%": "20%",
        "40%": "40%",
        "60%": "60%",
        "80%": "80%",
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
        101: "1.005",
        102: "1.025",
      },
      minWidth: {
        "2/32": "5.00%",
        "1/4": "25.00%",
        "9/12": "75.00%",
        "30/32": "90.00%",
      },
      maxWidth: {
        "2/32": "5.00%",
        "9/12": "75.00%",
        "17/24": "70.83%",
        "30/32": "90.00%",
      },
      minHeight: {
        "2/3": "66.00%",
        "9/12": "75.00%",
        "17/24": "70.83%",
        "30/32": "90.00%",
      },
      maxHeight: {
        "2/3": "66.00%",
        "9/12": "75.00%",
        "17/24": "70.83%",
        "30/32": "90.00%",
      },
      borderRadius: {
        'sm+': '0.25rem',
      }
      // screens: {
      //   "3xl": "1843px",
      // },
    },
    fontSize: {
      tiny: ".63rem",
      xs: ".75rem",
      sm: ".875rem",
      "sm+": ".93rem",
      "sm++": ".96rem",
      base: "1rem",
      "base-": "1.03rem",
      "base+": "1.06rem",
      "lg-": "1.08rem",
      lg: "1.125rem",
      "lg+": "1.18rem",
      xl: "1.25rem",
      xxl: "1.30rem",
      "2xl": "1.5rem",
      "2.2xl": "1.55rem",
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
