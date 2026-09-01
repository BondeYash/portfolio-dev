import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        paper: "rgb(var(--paper) / <alpha-value>)",
        stock: "rgb(var(--stock) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        faded: "rgb(var(--faded) / <alpha-value>)",
        rule: "rgb(var(--rule) / <alpha-value>)",
        spot: "rgb(var(--spot) / <alpha-value>)",
        press: "rgb(var(--press) / <alpha-value>)",
      },
      fontFamily: {
        masthead: ["var(--font-masthead)", "Times New Roman", "serif"],
        hed: ["var(--font-hed)", "Georgia", "Times New Roman", "serif"],
        body: ["var(--font-body)", "Georgia", "Times New Roman", "serif"],
        cond: ["var(--font-cond)", "Haettenschweiler", "Impact", "sans-serif"],
        type: ["var(--font-type)", "Courier New", "monospace"],
      },
      letterSpacing: {
        news: "0.18em",
        wide2: "0.32em",
      },
      maxWidth: {
        broadsheet: "84rem",
        column: "38rem",
      },
      boxShadow: {
        sheet: "0 1px 0 rgb(var(--rule) / 0.35), 0 24px 60px -30px rgb(0 0 0 / 0.55)",
        leaf: "0 44px 90px -34px rgb(0 0 0 / 0.85), 0 4px 14px -6px rgb(0 0 0 / 0.5)",
      },
      backgroundImage: {
        newsprint:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.72' numOctaves='4' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        fibers:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='f'><feTurbulence type='turbulence' baseFrequency='.02 .6' numOctaves='2'/><feColorMatrix values='0 0 0 0 .35 0 0 0 0 .3 0 0 0 0 .22 0 0 0 .35 0'/></filter><rect width='100%' height='100%' filter='url(%23f)'/></svg>\")",
      },
      transitionTimingFunction: {
        press: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        ticker: {
          from: { transform: "translate3d(0,0,0)" },
          to: { transform: "translate3d(-50%,0,0)" },
        },
      },
      animation: {
        ticker: "ticker 42s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
