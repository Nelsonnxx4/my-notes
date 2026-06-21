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
				primary: "#4C6FFF",

				noteYellow: "#FCEAA8",
				notePink: "#F7CBE9",
				noteBlue: "#CFEFFF",
				noteGreen: "#D8F5C8",
				notePeach: "#FADFCF",
			},
		},
	},
	darkMode: "class",
	plugins: [heroui()],
};
