// Vercel serverless function: serves the lesson/chapter catalog as JSON so the
// client can fetch content from the backend instead of hardcoding it. Cached at
// the edge since the catalog changes rarely.
import type { VercelRequest, VercelResponse } from "./_types";
import { getLessonCatalog } from "../src/server/lessons";

export default function handler(req: VercelRequest, res: VercelResponse): void {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed. Use GET." });
    return;
  }

  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=86400"
  );
  res.status(200).json({ subjects: getLessonCatalog() });
}
