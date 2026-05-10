
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { copyFileSync } from "node:fs";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8000,
  },
  plugins: [
    react(),
    {
      // GitHub Pages serves 404.html for unknown paths; making it a copy of
      // index.html lets BrowserRouter handle deep links like /blog/<slug>.
      name: "spa-fallback-404",
      apply: "build",
      closeBundle() {
        copyFileSync(
          path.resolve(__dirname, "dist/index.html"),
          path.resolve(__dirname, "dist/404.html"),
        );
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
