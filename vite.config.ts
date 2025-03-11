
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from 'fs';
import type { ViteDevServer } from 'vite';
import type { Connect } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    fs: {
      // Allow serving files from project root
      allow: ['./'],
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    // Custom plugin to handle Markdown files for blog posts
    {
      name: 'markdown-posts',
      configureServer(server: ViteDevServer) {
        server.middlewares.use((req: Connect.IncomingMessage, res: Connect.ServerResponse<Connect.IncomingMessage>, next: Connect.NextFunction) => {
          if (req.url?.startsWith('/src/content/')) {
            try {
              const filePath = path.join(process.cwd(), req.url);
              if (fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath, 'utf-8');
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/markdown');
                res.end(content);
                return;
              }
            } catch (e) {
              console.error(e);
            }
          }
          next();
        });
      }
    }
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
