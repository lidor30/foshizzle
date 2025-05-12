import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use root path as base since you're using a custom domain via CNAME
  base: "/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    // Ensure Vite correctly handles public directory assets
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: "./index.html",
      },
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
        },
      },
    },
  },
});
