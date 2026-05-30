// Framework-agnostic core of the Gemini proxy. It owns the API key and talks to
// Google's SDK server-side, so the secret never reaches the browser. Both the
// Vercel function (api/gemini.ts) and the Vite dev middleware (vite.config.ts)
// call runGemini() and translate the result into their own response object.
//
// NOTE: imports here use relative paths (not the "@/" alias) so the file can be
// bundled by Vercel and loaded by the Vite config, neither of which resolves the
// alias.
import { GoogleGenAI } from "@google/genai";
import {
  buildExplainPrompt,
  buildQuizPrompt,
  buildTutorSystemPrompt,
  parseQuizJSON,
  toContents,
  DEFAULT_GEMINI_MODEL,
  type ChatTurn,
  type Language,
  type LessonContext,
} from "../lib/gemini-core";

export interface GeminiHandlerOptions {
  apiKey?: string;
  model?: string;
}

export interface GeminiResult {
  status: number;
  body: unknown;
}

interface ChatBody {
  action: "chat";
  history?: ChatTurn[];
  prompt: string;
  language: Language;
  lesson: LessonContext;
}

interface ExplainBody {
  action: "explain";
  topic: string;
  language: Language;
  lesson: LessonContext;
}

interface QuizBody {
  action: "quiz";
  subject: string;
  chapter: string;
  topic: string;
  level: string;
  language: Language;
}

export async function runGemini(
  body: unknown,
  opts: GeminiHandlerOptions
): Promise<GeminiResult> {
  if (!opts.apiKey) {
    return {
      status: 503,
      body: {
        error:
          "AI is not configured: the server is missing the GEMINI_API_KEY environment variable.",
      },
    };
  }

  if (!body || typeof body !== "object" || !("action" in body)) {
    return { status: 400, body: { error: "Invalid request: missing 'action'." } };
  }

  const model = opts.model || DEFAULT_GEMINI_MODEL;
  const ai = new GoogleGenAI({ apiKey: opts.apiKey });
  const action = (body as { action: unknown }).action;

  try {
    switch (action) {
      case "chat": {
        const { history = [], prompt, language, lesson } = body as ChatBody;
        if (!prompt) {
          return { status: 400, body: { error: "Missing 'prompt'." } };
        }
        const response = await ai.models.generateContent({
          model,
          contents: toContents(history, prompt),
          config: {
            systemInstruction: buildTutorSystemPrompt(language, lesson),
            temperature: 0.8,
          },
        });
        return { status: 200, body: { text: response.text ?? "" } };
      }
      case "explain": {
        const { topic, language, lesson } = body as ExplainBody;
        if (!topic) {
          return { status: 400, body: { error: "Missing 'topic'." } };
        }
        const response = await ai.models.generateContent({
          model,
          contents: buildExplainPrompt(topic, language, lesson),
          config: { temperature: 0.7 },
        });
        return { status: 200, body: { text: response.text ?? "" } };
      }
      case "quiz": {
        const { subject, chapter, topic, level, language } = body as QuizBody;
        const response = await ai.models.generateContent({
          model,
          contents: buildQuizPrompt({ subject, chapter, topic, level, language }),
          config: { temperature: 0.7, responseMimeType: "application/json" },
        });
        return {
          status: 200,
          body: { questions: parseQuizJSON(response.text ?? "") },
        };
      }
      default:
        return {
          status: 400,
          body: { error: `Unknown action: ${String(action)}` },
        };
    }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Gemini request failed.";
    return { status: 502, body: { error: message } };
  }
}
