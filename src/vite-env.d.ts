/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  // Optional override for the AI proxy endpoint (defaults to "/api/gemini").
  readonly VITE_GEMINI_PROXY_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
