import type { Config } from "tailwindcss";

export default {
  content: [""],
  theme: {
    extend: {
      screens: {
        sm: "640px",
        md: "968px",
        lg: "1024px",
        xl: "1280px",
      },
    },
    colors: {
      dark: "#030303",
      light: "#f2f2f2",
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    styled: true,
    themes: [
      {
        mytheme: {
          primary: "#ecc06f",
          dark: "#030303",
          light: "#f2f2f2",
          success: "#36d399",
          warning: "#fbbd23",
          error: "#f87272",
        },
      },
    ],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: "dark",
  },
} satisfies Config;
