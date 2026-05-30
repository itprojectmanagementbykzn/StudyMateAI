import { vi, describe, it, expect, beforeEach } from "vitest";

// Mock the SDK so no real network/auth happens. The mock records the args it is
// called with and returns whatever the test queues up.
const generateContent = vi.fn();
vi.mock("@google/genai", () => ({
  GoogleGenAI: class {
    models = { generateContent };
  },
}));

import { runGemini } from "@/server/geminiHandler";

const lesson = { title: "Loops", chapter: 6, subject: "Computer Science" };

describe("runGemini", () => {
  beforeEach(() => generateContent.mockReset());

  it("returns 503 and does not call the SDK when no API key is set", async () => {
    const result = await runGemini(
      { action: "chat", prompt: "hi", language: "en", lesson },
      {}
    );
    expect(result.status).toBe(503);
    expect(generateContent).not.toHaveBeenCalled();
  });

  it("returns 400 for a missing action", async () => {
    const result = await runGemini({ foo: "bar" }, { apiKey: "k" });
    expect(result.status).toBe(400);
  });

  it("returns 400 for an unknown action", async () => {
    const result = await runGemini({ action: "explode" }, { apiKey: "k" });
    expect(result.status).toBe(400);
  });

  it("returns 400 for a chat request with no prompt", async () => {
    const result = await runGemini(
      { action: "chat", prompt: "", language: "en", lesson },
      { apiKey: "k" }
    );
    expect(result.status).toBe(400);
    expect(generateContent).not.toHaveBeenCalled();
  });

  it("proxies a chat request and returns the model text", async () => {
    generateContent.mockResolvedValue({ text: "hello there" });
    const result = await runGemini(
      { action: "chat", prompt: "hi", language: "en", lesson },
      { apiKey: "k" }
    );
    expect(result.status).toBe(200);
    expect(result.body).toEqual({ text: "hello there" });
    expect(generateContent).toHaveBeenCalledOnce();
  });

  it("parses quiz JSON returned by the model", async () => {
    generateContent.mockResolvedValue({
      text: JSON.stringify([
        { question: "q", options: ["a", "b", "c", "d"], answer: "a" },
      ]),
    });
    const result = await runGemini(
      {
        action: "quiz",
        subject: "CS",
        chapter: "6",
        topic: "loops",
        level: "easy",
        language: "en",
      },
      { apiKey: "k" }
    );
    expect(result.status).toBe(200);
    expect(result.body).toEqual({
      questions: [{ question: "q", options: ["a", "b", "c", "d"], answer: "a" }],
    });
  });

  it("maps unexpected SDK failures to a 502", async () => {
    // A malformed (null) SDK response makes the handler throw internally; it
    // should be caught and surfaced as a 502 rather than crashing.
    generateContent.mockResolvedValue(null);
    const result = await runGemini(
      { action: "explain", topic: "loops", language: "my", lesson },
      { apiKey: "k" }
    );
    expect(result.status).toBe(502);
    expect(typeof (result.body as { error: string }).error).toBe("string");
  });
});
