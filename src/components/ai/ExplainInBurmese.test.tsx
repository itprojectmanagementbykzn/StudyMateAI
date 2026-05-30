import { vi, describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import languageReducer from "@/redux/language.slice";

// The component only calls Gemini on click; mock it so the import is light.
vi.mock("@/lib/gemini", () => ({
  explainTopic: vi.fn().mockResolvedValue("explanation"),
}));

import ExplainInBurmese from "@/components/ai/ExplainInBurmese";

const renderWithLanguage = (language: "en" | "my") => {
  const store = configureStore({
    reducer: { language: languageReducer },
    preloadedState: { language: { language } },
  });
  return render(
    <Provider store={store}>
      <ExplainInBurmese
        topic="Variables"
        lesson={{ title: "JavaScript", chapter: 1, subject: "Computer Science" }}
      />
    </Provider>
  );
};

describe("ExplainInBurmese", () => {
  it("renders the English label by default", () => {
    renderWithLanguage("en");
    expect(
      screen.getByRole("button", { name: /explain in burmese/i })
    ).toBeInTheDocument();
  });

  it("renders the Burmese label when the language is Burmese", () => {
    renderWithLanguage("my");
    expect(screen.getByText("မြန်မာလို ရှင်းပြပါ")).toBeInTheDocument();
  });
});
