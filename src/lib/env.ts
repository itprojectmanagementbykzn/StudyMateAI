// Centralized, configurable environment values.
// Backend URL and Gemini model can be overridden via .env (see .env.example).
export const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ||
  "https://hackathon-20uq.onrender.com";

// Latest Gemini Flash model. Pinned for predictable behavior; override with
// VITE_GEMINI_MODEL (e.g. "gemini-flash-latest" for the rolling alias).
export const GEMINI_MODEL =
  (import.meta.env.VITE_GEMINI_MODEL as string | undefined) ||
  "gemini-3.5-flash";
