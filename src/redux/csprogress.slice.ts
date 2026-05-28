// src/redux/progress.slice.ts
import { createSlice } from "@reduxjs/toolkit";
import {ComputerScienceProgressApi} from "@/api/Subject/csprogress.api"
interface SubProgressType {
  userId: string | null;
  progress: {
    [courseName: string]: number[];
  };
}

const initialState: SubProgressType = {
  userId: null,
  progress: {
    Javascript: [],
    "Frontend development": [],
    "Introduction to Backend Development with Nodejs and Express": [],
  },
};

const progressSlice = createSlice({
  name: "csprogress",
  initialState,
  reducers: {
    resetProgress: (state) => {
      state.progress = {
        Javascript: [],
        "Frontend development": [],
        "Introduction to Backend Development with Nodejs and Express": [],
      };
    },
  },
  extraReducers: (builder) => {
      builder.addMatcher(ComputerScienceProgressApi.endpoints.getProgress.matchFulfilled, (state, action) => {
        state.userId = action.payload.userId;
        state.progress = action.payload.progress;
      });
      builder.addMatcher(ComputerScienceProgressApi.endpoints.updateProgress.matchFulfilled, (state, action) => {
        state.userId = action.payload.userId;
        state.progress= action.payload.progress;
      });
    },
});

export const { resetProgress } = progressSlice.actions;
export default progressSlice.reducer;

