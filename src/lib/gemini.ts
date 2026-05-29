// Browser-side AI tutor client. Every Gemini call is routed through the
// serverless proxy at /api/gemini, so the API key lives on the server and is
// never shipped in the client bundle. The pure prompt/parse helpers live in
// gemini-core and are re-exported here so existing imports keep working.
import type {
  ChatTurn,
  Language,
  LessonContext,
  QuizQuestion,
} from "@/lib/gemini-core";

export type { ChatTurn, Language, LessonContext, QuizQuestion };
export { buildTutorSystemPrompt, parseQuizJSON } from "@/lib/gemini-core";

// Override the proxy endpoint via VITE_GEMINI_PROXY_URL (defaults to same-origin
// /api/gemini, which is what the Vercel function and the Vite dev server serve).
const PROXY_URL = import.meta.env.VITE_GEMINI_PROXY_URL || "/api/gemini";

async function callProxy<T>(payload: Record<string, unknown>): Promise<T> {
  let res: Response;
  try {
    res = await fetch(PROXY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(
      "Couldn't reach the AI service. Check your connection and try again."
    );
  }

  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    /* non-JSON response handled below */
  }

  if (!res.ok) {
    const message =
      data &&
      typeof data === "object" &&
      "error" in data &&
      typeof (data as { error: unknown }).error === "string"
        ? (data as { error: string }).error
        : `AI request failed (${res.status}).`;
    throw new Error(message);
  }
  return data as T;
}

export async function sendChat(
  history: ChatTurn[],
  prompt: string,
  language: Language,
  lesson: LessonContext
): Promise<string> {
  const { text } = await callProxy<{ text: string }>({
    action: "chat",
    history,
    prompt,
    language,
    lesson,
  });
  return text ?? "";
}

export async function explainTopic(
  topic: string,
  language: Language,
  lesson: LessonContext
): Promise<string> {
  const { text } = await callProxy<{ text: string }>({
    action: "explain",
    topic,
    language,
    lesson,
  });
  return text ?? "";
}

export async function generateQuiz(params: {
  subject: string;
  chapter: string;
  topic: string;
  level: string;
  language: Language;
}): Promise<QuizQuestion[]> {
  const { questions } = await callProxy<{ questions: QuizQuestion[] }>({
    action: "quiz",
    ...params,
  });
  return Array.isArray(questions) ? questions : [];
}
