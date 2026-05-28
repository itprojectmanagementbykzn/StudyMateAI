import { describe, it, expect } from "vitest";
import authReducer, { logout } from "@/redux/auth.slice";

describe("auth slice", () => {
  it("starts unauthenticated", () => {
    expect(authReducer(undefined, { type: "@@INIT" })).toEqual({
      accessToken: null,
      isAuthenticated: false,
    });
  });

  it("clears the token and auth flag on logout", () => {
    const state = authReducer(
      { accessToken: "a-token", isAuthenticated: true },
      logout()
    );
    expect(state.accessToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
