// Global, persisted UI/AI language preference (English / Burmese).
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Language = "en" | "my";

interface LanguageState {
  language: Language;
}

const initialState: LanguageState = {
  language: "en",
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
    },
    toggleLanguage: (state) => {
      state.language = state.language === "en" ? "my" : "en";
    },
  },
});

export const { setLanguage, toggleLanguage } = languageSlice.actions;
export default languageSlice.reducer;
