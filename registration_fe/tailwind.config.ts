import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0D1117", // Dark background (GitHub-like)
        foreground: "#E6EDF3", // Light foreground
        primary: "#1F6FEB", // Vibrant blue for buttons
        danger: "#D0342C", // Red for warnings/errors
        success: "#2DA44E", // Green for success
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Modern font
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};

export default config;
