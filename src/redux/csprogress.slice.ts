// Per-user Computer Science progress, sourced from Firestore (see src/lib/progress.ts
// and src/components/ProgressSync.tsx). The slice holds the completed chapter
// numbers per course plus a load status for the UI.
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { initialProgress, type ProgressMap } from "@/lib/progress";

export type ProgressStatus = "idle" | "loading" | "ready" | "error";

interface CSProgressState {
  userId: string | null;
  progress: ProgressMap;
  status: ProgressStatus;
}

const initialState: CSProgressState = {
  userId: null,
  progress: initialProgress(),
  status: "idle",
};

const progressSlice = createSlice({
  name: "csprogress",
  initialState,
  reducers: {
    setProgressStatus: (state, action: PayloadAction<ProgressStatus>) => {
      state.status = action.payload;
    },
    setProgress: (
      state,
      action: PayloadAction<{ userId: string; progress: ProgressMap }>
    ) => {
      state.userId = action.payload.userId;
      state.progress = action.payload.progress;
      state.status = "ready";
    },
    // Optimistically mark a chapter complete after a passing quiz, so the UI
    // updates without re-reading Firestore.
    addCompletedChapter: (
      state,
      action: PayloadAction<{ course: string; chapter: number }>
    ) => {
      const { course, chapter } = action.payload;
      const existing = state.progress[course] ?? [];
      if (!existing.includes(chapter)) {
        state.progress[course] = [...existing, chapter];
      }
    },
    resetProgress: (state) => {
      state.userId = null;
      state.progress = initialProgress();
      state.status = "idle";
    },
  },
});

export const {
  setProgress,
  setProgressStatus,
  addCompletedChapter,
  resetProgress,
} = progressSlice.actions;
export default progressSlice.reducer;
