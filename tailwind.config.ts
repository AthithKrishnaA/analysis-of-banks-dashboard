import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        bank: {
          primary: "#1E3A8A",
          secondary: "#64748B",
          accent: "#E2E8F0",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
