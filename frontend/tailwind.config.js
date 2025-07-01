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
      colors: {
        mainColor: "#926bf4",
        mainColor200: "#7c3aed",
        assistColor100: "#f9fafb",
        assistColor200: "#e0e0e1",
        accent100: "#34d399",
        accent200: "#10b981",
        hightlight: "#f59e0b",
        text: "#111827",
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};
