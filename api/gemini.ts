// Vercel serverless function: the AI proxy. Holds GEMINI_API_KEY server-side
// and forwards chat / explain / quiz requests to Gemini, so the key is never
// shipped in the client bundle. All logic lives in the shared handler.
import type { VercelRequest, VercelResponse } from "./_types";
import { runGemini } from "../src/server/geminiHandler";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed. Use POST." });
    return;
  }

  const result = await runGemini(req.body, {
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL,
  });

  res.status(result.status).json(result.body);
}
