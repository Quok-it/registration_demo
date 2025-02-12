import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Scans all files inside src/
    "./pages/**/*.{js,ts,jsx,tsx,mdx}", // Next.js pages (in case it's outside src/)
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Components
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // App directory (if using App Router)
    "./public/**/*.html", // If using static HTML files
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
