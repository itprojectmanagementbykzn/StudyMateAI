import { vi, describe, it, expect, beforeEach } from "vitest";

// Mock Firestore so the data layer is tested without any real SDK/network.
// vi.hoisted lets the mock factory (hoisted above imports) reference the mocks.
const { getDoc, setDoc, doc, arrayUnion } = vi.hoisted(() => ({
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  doc: vi.fn((_db: unknown, col: string, id: string) => ({ col, id })),
  arrayUnion: vi.fn((value: unknown) => ({ __arrayUnion: value })),
}));

vi.mock("firebase/firestore", () => ({ doc, getDoc, setDoc, arrayUnion }));
vi.mock("@/lib/firebase", () => ({ db: {} }));

import {
  fetchProgress,
  markChapterComplete,
  initialProgress,
} from "@/lib/progress";

describe("fetchProgress", () => {
  beforeEach(() => {
    getDoc.mockReset();
    setDoc.mockReset();
    doc.mockClear();
  });

  it("creates the doc with empty progress when it does not exist", async () => {
    getDoc.mockResolvedValue({ exists: () => false });

    const result = await fetchProgress("uid-1");

    expect(setDoc).toHaveBeenCalledTimes(1);
    expect(result).toEqual(initialProgress());
  });

  it("returns the stored progress when the doc exists", async () => {
    const stored = { Javascript: [1, 2] };
    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ progress: stored }),
    });

    const result = await fetchProgress("uid-1");

    expect(result).toEqual(stored);
    expect(setDoc).not.toHaveBeenCalled();
  });
});

describe("markChapterComplete", () => {
  beforeEach(() => {
    setDoc.mockReset();
    arrayUnion.mockClear();
  });

  it("merges an arrayUnion for the given course", async () => {
    await markChapterComplete("uid-1", "Javascript", 3);

    expect(arrayUnion).toHaveBeenCalledWith(3);
    expect(setDoc).toHaveBeenCalledWith(
      expect.anything(),
      { progress: { Javascript: { __arrayUnion: 3 } } },
      { merge: true }
    );
  });
});
