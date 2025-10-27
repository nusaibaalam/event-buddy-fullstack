import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef0ff",
          100: "#e0e3ff",
          200: "#c3c8ff",
          300: "#9ea6ff",
          400: "#7583ff",
          500: "#5b6bff", // main gradient start
          600: "#4c59f3",
          700: "#3f47d8",
          800: "#343bb0",
          900: "#2c348c",
        },
      },
      boxShadow: {
        card: "0 1px 3px rgb(0 0 0 / 0.08), 0 10px 25px rgb(93 95 239 / 0.15)",
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(80rem 40rem at 50% -10%, rgba(91,107,255,0.25), transparent 40%), radial-gradient(50rem 30rem at 100% 10%, rgba(91,107,255,0.15), transparent 50%), radial-gradient(50rem 30rem at 0% 10%, rgba(91,107,255,0.15), transparent 50%)",
      },
    },
  },
  plugins: [],
};

export default config;
