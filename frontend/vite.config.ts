import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
<<<<<<< HEAD
  plugins: [react(), tsconfigPaths()],
  server: {
    port: 5176,
    strictPort: true,
  },
=======
	plugins: [react(), tsconfigPaths()],
	server: {
		port: 5180,
		strictPort: true,
	},
>>>>>>> 2e47b235b5045e1e09c5a74fa5f787f112510202
});
