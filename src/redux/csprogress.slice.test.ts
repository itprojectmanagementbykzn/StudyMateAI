import { vi, describe, it, expect } from "vitest";

// The slice pulls initialProgress() from the progress data layer, which imports
// the Firebase app. Mock it so no real SDK initializes during the unit test.
vi.mock("@/lib/firebase", () => ({ db: {} }));

import reducer, {
  setProgress,
  setProgressStatus,
  addCompletedChapter,
  resetProgress,
} from "@/redux/csprogress.slice";

const initial = reducer(undefined, { type: "@@INIT" });

describe("csprogress slice", () => {
  it("starts idle with empty per-course progress", () => {
    expect(initial.userId).toBeNull();
    expect(initial.status).toBe("idle");
    expect(initial.progress.Javascript).toEqual([]);
  });

  it("loads progress and marks the status ready", () => {
    const state = reducer(
      initial,
      setProgress({ userId: "u1", progress: { Javascript: [1, 2] } })
    );
    expect(state.userId).toBe("u1");
    expect(state.status).toBe("ready");
    expect(state.progress.Javascript).toEqual([1, 2]);
  });

  it("updates the load status", () => {
    expect(reducer(initial, setProgressStatus("loading")).status).toBe(
      "loading"
    );
    expect(reducer(initial, setProgressStatus("error")).status).toBe("error");
  });

  it("adds a completed chapter without duplicating", () => {
    const withOne = reducer(
      initial,
      addCompletedChapter({ course: "Javascript", chapter: 1 })
    );
    expect(withOne.progress.Javascript).toEqual([1]);

    const again = reducer(
      withOne,
      addCompletedChapter({ course: "Javascript", chapter: 1 })
    );
    expect(again.progress.Javascript).toEqual([1]);

    const two = reducer(
      withOne,
      addCompletedChapter({ course: "Javascript", chapter: 2 })
    );
    expect(two.progress.Javascript).toEqual([1, 2]);
  });

  it("resets progress back to the initial shape", () => {
    const loaded = reducer(
      initial,
      setProgress({ userId: "u1", progress: { Javascript: [1, 2, 3] } })
    );
    const reset = reducer(loaded, resetProgress());
    expect(reset.userId).toBeNull();
    expect(reset.status).toBe("idle");
    expect(reset.progress.Javascript).toEqual([]);
  });
});
