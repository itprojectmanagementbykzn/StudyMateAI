// Centralized, configurable environment values.
// Backend URL and Gemini model can be overridden via .env (see .env.example).
export const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ||
  "https://hackathon-20uq.onrender.com";

// Latest Gemini Flash. Defaults to the auto-updating "latest" alias so the app
// keeps working as Google rolls model versions; pin a specific version via
// VITE_GEMINI_MODEL (e.g. "gemini-2.5-flash") if you need reproducibility.
export const GEMINI_MODEL =
  (import.meta.env.VITE_GEMINI_MODEL as string | undefined) ||
  "gemini-flash-latest";
