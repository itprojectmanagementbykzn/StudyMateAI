// src/redux/latestlession.slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LatestlessonType {
  chapter: number;
  title: string;
  subject: string;
  topic: string[];
}

const initialState: LatestlessonType = {
  chapter: 2,
  title: "Math operation in Javascript",
  subject: "ComputerScience",
  topic: ["Arithemtics operations in JS", "String Vs Number"],
};

const latestLessonSlice = createSlice({
  name: "latestlesson",
  initialState,
  reducers: {
    setLatestLesson: (state, action: PayloadAction<LatestlessonType>) => {
      return action.payload; // overwrite the entire state
    },
  },
});

export const { setLatestLesson } = latestLessonSlice.actions;
export default latestLessonSlice.reducer;
