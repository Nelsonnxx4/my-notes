import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        Primary100: "#926bf4",
        Primary200: "#7c3aed",
        Secondary100: "#f9fafb",
        Secondary200: "#e0e0e1",
        Accent100: "#34d399",
        Accent200: "#10b981",
        Hightlight: "#f59e0b",
        Text: "#111827",
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};
