import { describe, it, expect } from "vitest";
import languageReducer, {
  setLanguage,
  toggleLanguage,
} from "@/redux/language.slice";

describe("language slice", () => {
  it("defaults to English", () => {
    expect(languageReducer(undefined, { type: "@@INIT" })).toEqual({
      language: "en",
    });
  });

  it("sets the language explicitly", () => {
    expect(languageReducer({ language: "en" }, setLanguage("my"))).toEqual({
      language: "my",
    });
  });

  it("toggles between English and Burmese", () => {
    expect(languageReducer({ language: "en" }, toggleLanguage())).toEqual({
      language: "my",
    });
    expect(languageReducer({ language: "my" }, toggleLanguage())).toEqual({
      language: "en",
    });
  });
});
