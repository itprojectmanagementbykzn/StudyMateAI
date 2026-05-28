// Resolves the Gemini API key from the Vite environment.
export function getGeminiApiKey(): string | null {
  return import.meta.env.VITE_GEMINI_API_KEY || null;
}
