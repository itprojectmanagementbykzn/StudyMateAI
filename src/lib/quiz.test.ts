import { vi, describe, it, expect, beforeEach } from "vitest";

// Mock the Gemini client so no network/proxy call happens; we only assert the
// params quiz.ts forwards. Both English and Burmese now route through Gemini.
// vi.hoisted lets the mock factory (hoisted above imports) reference the mock.
const { generateQuiz } = vi.hoisted(() => ({ generateQuiz: vi.fn() }));
vi.mock("@/lib/gemini", () => ({ generateQuiz }));

import { fetchQuizQuestions } from "@/lib/quiz";

describe("fetchQuizQuestions", () => {
  beforeEach(() => {
    generateQuiz.mockReset();
    generateQuiz.mockResolvedValue([
      { question: "Q", options: ["a", "b", "c", "d"], answer: "a" },
    ]);
  });

  it("routes English quizzes through Gemini with option mapped to level", async () => {
    const result = await fetchQuizQuestions({
      subject: "Computer Science",
      chapter: "1",
      topic: "variables",
      option: "beginner",
      language: "en",
    });

    expect(generateQuiz).toHaveBeenCalledWith({
      subject: "Computer Science",
      chapter: "1",
      topic: "variables",
      level: "beginner",
      language: "en",
    });
    expect(result).toHaveLength(1);
  });

  it("routes Burmese quizzes through Gemini too", async () => {
    await fetchQuizQuestions({
      subject: "Computer Science",
      chapter: "2",
      topic: "loops",
      option: "advanced",
      language: "my",
    });

    expect(generateQuiz).toHaveBeenCalledWith({
      subject: "Computer Science",
      chapter: "2",
      topic: "loops",
      level: "advanced",
      language: "my",
    });
  });

  it("defaults nullish fields to safe values", async () => {
    await fetchQuizQuestions({
      subject: null,
      chapter: null,
      topic: null,
      option: null,
      language: "en",
    });

    expect(generateQuiz).toHaveBeenCalledWith({
      subject: "",
      chapter: "",
      topic: "",
      level: "intermediate",
      language: "en",
    });
  });
});
