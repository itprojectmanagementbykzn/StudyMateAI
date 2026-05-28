import { vi, describe, it, expect } from "vitest";

// Avoid loading the real SDK when importing the helper under test.
vi.mock("@google/genai", () => ({ GoogleGenAI: class {} }));

import { parseQuizJSON, buildTutorSystemPrompt } from "@/lib/gemini";

describe("parseQuizJSON", () => {
  it("parses a clean JSON array of questions", () => {
    const raw = JSON.stringify([
      { question: "What is a variable?", options: ["a", "b", "c", "d"], answer: "a" },
    ]);
    const result = parseQuizJSON(raw);
    expect(result).toHaveLength(1);
    expect(result[0].answer).toBe("a");
  });

  it("strips markdown code fences before parsing", () => {
    const raw =
      '```json\n[{"question":"Q","options":["a","b","c","d"],"answer":"a"}]\n```';
    expect(parseQuizJSON(raw)).toHaveLength(1);
  });

  it("returns [] for invalid JSON and drops malformed entries", () => {
    expect(parseQuizJSON("not json at all")).toEqual([]);
    const mixed = JSON.stringify([
      { question: "ok", options: ["a", "b"], answer: "a" },
      { question: 123, options: "nope" },
    ]);
    expect(parseQuizJSON(mixed)).toHaveLength(1);
  });
});

describe("buildTutorSystemPrompt", () => {
  const lesson = { title: "Loops", chapter: 6, subject: "Computer Science" };

  it("builds an English prompt that includes the lesson title", () => {
    const prompt = buildTutorSystemPrompt("en", lesson);
    expect(prompt).toContain("StudyBuddy");
    expect(prompt).toContain("Loops");
  });

  it("builds a Burmese prompt when language is 'my'", () => {
    const prompt = buildTutorSystemPrompt("my", lesson);
    expect(prompt).toContain("မြန်မာ");
    expect(prompt).toContain("Loops");
  });
});
