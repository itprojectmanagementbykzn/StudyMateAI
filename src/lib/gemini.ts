// Single integration point for the Google Gen AI SDK (@google/genai).
// Powers the bilingual (English / Burmese) AI tutor, lesson explanations,
// and AI-generated quizzes. The model is configurable via VITE_GEMINI_MODEL.
import { GoogleGenAI } from "@google/genai";
import { getGeminiApiKey } from "@/lib/keys";
import { GEMINI_MODEL } from "@/lib/env";

export type Language = "en" | "my";

export interface LessonContext {
  title: string;
  chapter: number | string;
  subject: string;
}

export interface ChatTurn {
  role: "user" | "model";
  content: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

export function getGeminiModel(): string {
  return GEMINI_MODEL;
}

function getClient(): GoogleGenAI {
  const apiKey = getGeminiApiKey();
  if (!apiKey || !apiKey.startsWith("AIza")) {
    throw new Error(
      "Missing or invalid Gemini API key. Set VITE_GEMINI_API_KEY in your .env file."
    );
  }
  return new GoogleGenAI({ apiKey });
}

export function buildTutorSystemPrompt(
  language: Language,
  lesson: LessonContext
): string {
  if (language === "my") {
    return `သင်သည် StudyBuddy ဖြစ်သည်။ ကျောင်းသားတစ်ဦးကို မြန်မာဘာသာဖြင့် နားလည်လွယ်အောင် ရှင်းပြပေးသော ဆရာကောင်းတစ်ဦးအဖြစ် ကူညီပါ။

ကျောင်းသားသည် လတ်တလော "${lesson.title}" (Chapter ${lesson.chapter}) ကို ${lesson.subject} ဘာသာရပ်အောက်တွင် သင်ယူနေပါသည်။

အဖြေအားလုံးကို မြန်မာဘာသာဖြင့်သာ ဖြေပါ။ ပထမအဖြေတွင် အသေးစိတ်ရှင်းပြပြီး နောက်ဆက်တွဲအဖြေများတွင် တိုတိုနှင့်တိကျစွာ ဖြေပါ။ ကျောင်းသားသည် ပထမဆုံးအကြိမ် သင်ယူနေသည်ဟု ယူဆ၍ ရိုးရှင်းသော ဥပမာများဖြင့် ရှင်းပြပါ။`;
  }
  return `You are StudyBuddy — a friendly, helpful, and human-sounding AI tutor.

The student is currently learning "${lesson.title}" (Chapter ${lesson.chapter}) in ${lesson.subject}.

Respond in friendly, natural English. Start with a clear explanation, then give concise, solid guidance. Avoid sounding robotic — be like a helpful mentor. Assume the student is learning this for the first time and break concepts into simple ideas.`;
}

// The Gemini API expects multi-turn history to start with a user turn, so we
// drop any leading model greeting before sending.
function toContents(history: ChatTurn[], prompt: string) {
  const firstUserIndex = history.findIndex((m) => m.role === "user");
  const trimmed = firstUserIndex === -1 ? [] : history.slice(firstUserIndex);
  return [
    ...trimmed.map((m) => ({ role: m.role, parts: [{ text: m.content }] })),
    { role: "user", parts: [{ text: prompt }] },
  ];
}

export async function sendChat(
  history: ChatTurn[],
  prompt: string,
  language: Language,
  lesson: LessonContext
): Promise<string> {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: getGeminiModel(),
    contents: toContents(history, prompt),
    config: {
      systemInstruction: buildTutorSystemPrompt(language, lesson),
      temperature: 0.8,
    },
  });
  return response.text ?? "";
}

export async function explainTopic(
  topic: string,
  language: Language,
  lesson: LessonContext
): Promise<string> {
  const ai = getClient();
  const instruction =
    language === "my"
      ? "အောက်ပါ ခေါင်းစဉ်ကို မြန်မာဘာသာဖြင့်၊ ပထမဆုံးအကြိမ်သင်ယူသူတစ်ဦး နားလည်အောင် ရိုးရှင်းသော ဥပမာများဖြင့် ရှင်းပြပါ။ မြန်မာဘာသာဖြင့်သာ ဖြေပါ။"
      : "Explain the following topic clearly and simply, in friendly English, with concrete examples, for a first-time learner.";
  const prompt = `${instruction}

Subject: ${lesson.subject}
Chapter ${lesson.chapter}: ${lesson.title}
Topic: ${topic}`;
  const response = await ai.models.generateContent({
    model: getGeminiModel(),
    contents: prompt,
    config: { temperature: 0.7 },
  });
  return response.text ?? "";
}

export async function generateQuiz(params: {
  subject: string;
  chapter: string;
  topic: string;
  level: string;
  language: Language;
}): Promise<QuizQuestion[]> {
  const { subject, chapter, topic, level, language } = params;
  const ai = getClient();
  const langLine =
    language === "my"
      ? "Write every question, every option, and every answer in Burmese (Myanmar) language only."
      : "Write every question, option, and answer in English.";
  const prompt = `Create a ${level || "intermediate"} difficulty multiple-choice quiz with 5 questions about "${topic}" from chapter ${chapter} of "${subject}".
${langLine}
Return ONLY valid JSON: an array of 5 objects, each with exactly these keys:
- "question": string
- "options": array of exactly 4 strings
- "answer": string that exactly matches one of the options
Do not include markdown, code fences, or any text outside the JSON array.`;
  const response = await ai.models.generateContent({
    model: getGeminiModel(),
    contents: prompt,
    config: { temperature: 0.7, responseMimeType: "application/json" },
  });
  return parseQuizJSON(response.text ?? "");
}

// Tolerant parser: strips markdown fences and keeps only well-formed questions.
export function parseQuizJSON(raw: string): QuizQuestion[] {
  let text = (raw ?? "").trim();
  if (text.startsWith("```")) {
    text = text
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/, "")
      .trim();
  }
  try {
    const parsed: unknown = JSON.parse(text);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (q): q is QuizQuestion =>
        !!q &&
        typeof (q as QuizQuestion).question === "string" &&
        Array.isArray((q as QuizQuestion).options) &&
        typeof (q as QuizQuestion).answer === "string"
    );
  } catch {
    return [];
  }
}
