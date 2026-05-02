import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite config for a beginner-friendly setup:
// - React support via @vitejs/plugin-react
// - dev server proxy so calls to /health and /meetings go to your Express API
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Any request from the browser to /health will be forwarded to http://localhost:3000/health
      "/health": "http://localhost:3000",
      // Same for meetings routes
      "/meetings": "http://localhost:3000",
    },
  },
});

