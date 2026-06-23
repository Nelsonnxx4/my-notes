import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        noteYellow: "#FDF1D1",
        notePink: "#F7CBE9",
        noteBlue: "#CFEFFF",
        noteGreen: "#D1F5E0",
        // App brand colors
        Primary100: "#926bf4",
        Primary200: "#7c3aed",
        Secondary100: "#f9fafb",
        Secondary200: "#e0e0e1",
        Accent100: "#34d399",
        Accent200: "#10b981",
        Highlight: "#f59e0b",
        Text: "#111827",
      },
      colors: {
        primary: "#7c3aed",
      },
      fontFamily: {
        sans: ["Raleway", "Roboto", "sans-serif"],
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};
