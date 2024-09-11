// const defaultTheme = require("tailwindcss/defaultTheme");

import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */

export default {
  content: ["./src/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Open Sans", ...defaultTheme.fontFamily.sans],
        serif: ["Fraunces", ...defaultTheme.fontFamily.serif],
        mono: ["IBM Plex Mono", ...defaultTheme.fontFamily.mono],
      },
      colors: {
        indigo: {
          500: "#416cbb",
        },
        primary: {
          200: "#E7DDED",
          600: "#4B2163",
        },
        secondary: {
          200: "#C5EDD8",
          // 400: "#82AB95",
          400: "#6B8D72",
        },
        pink: {
          500: "#F84084",
        },
        neutral: {
          200: "#F0DCB8",
        },
      },
    },
  },
};
