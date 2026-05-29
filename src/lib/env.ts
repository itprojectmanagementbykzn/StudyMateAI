// Centralized, configurable client-side environment values.
// The backend URL can be overridden via .env (see .env.example).
// NOTE: the Gemini API key and model now live server-side (see /api/gemini and
// .env.example) so the secret is never exposed to the browser.
export const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ||
  "https://hackathon-20uq.onrender.com";
