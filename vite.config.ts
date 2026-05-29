import { defineConfig, loadEnv, type Connect, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { ServerResponse } from "http";
import { runGemini } from "./src/server/geminiHandler";
import { getLessonCatalog } from "./src/server/lessons";

// During `vite dev` the /api routes are served here using the SAME handlers as
// the deployed Vercel serverless functions, so the AI tutor and lesson catalog
// work locally with `npm run dev` (no `vercel dev` required). The Gemini key is
// read from the environment server-side and never exposed to the browser.
function apiDevServer(env: Record<string, string>): Plugin {
  return {
    name: "studymate-api-dev",
    configureServer(server) {
      server.middlewares.use(
        "/api/lessons",
        (_req: Connect.IncomingMessage, res: ServerResponse) => {
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ subjects: getLessonCatalog() }));
        }
      );

      server.middlewares.use(
        "/api/gemini",
        (
          req: Connect.IncomingMessage,
          res: ServerResponse,
          next: Connect.NextFunction
        ) => {
          if (req.method !== "POST") {
            next();
            return;
          }
          const chunks: Buffer[] = [];
          req.on("data", (chunk: Buffer) => chunks.push(chunk));
          req.on("end", () => {
            void (async () => {
              let body: unknown = {};
              try {
                const raw = Buffer.concat(chunks).toString("utf8");
                body = raw ? JSON.parse(raw) : {};
              } catch {
                body = {};
              }
              const result = await runGemini(body, {
                apiKey: env.GEMINI_API_KEY,
                model: env.GEMINI_MODEL,
              });
              res.statusCode = result.status;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(result.body));
            })();
          });
        }
      );
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      mode === "development" && componentTagger(),
      apiDevServer(env),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
