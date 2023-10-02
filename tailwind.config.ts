import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        foodPattern: 'url("/i-like-food.svg")',
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: [
      {
        bookLight: {
          "primary": "#2f5b7f",
          "secondary": "#cfb8ea",
          "accent": "#6531a5",
          "neutral": "#0369a1",
          "base-100": "#e2f1fd",
          "info": "#0586f3",
          "success": "#80ced1",
          "warning": "#efd8bd",
          "error": "#e58b8b",
        },
        bookDark: {
          "primary": "#fbcc55",
          "secondary": "#1e063c",
          "accent": "#91e826",
          "neutral": "#F9F6FE",
          "base-100": "#3B3B98",
          "info": "#0586f3",
          "success": "#80ced1",
          "warning": "#efd8bd",
          "error": "#e58b8b",
        },
        bookDarkAlt: {
          "primary": "#fbcc55",
          "secondary": "#1e063c",
          "accent": "#91e826",
          "neutral": "#3B3B98",
          "base-100": "#F9F6FE",
          "info": "#0586f3",
          "success": "#80ced1",
          "warning": "#efd8bd",
          "error": "#e58b8b",
        },
      },
    ],
  },
} satisfies Config;
