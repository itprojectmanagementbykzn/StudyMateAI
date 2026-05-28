import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { tagTypeData } from "./tagTypes";
import { RootState } from "@/redux/store";
import { API_BASE_URL } from "@/lib/env";
export const baseAPI = createApi({
  reducerPath: "base",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const { accessToken: token } = state.auth;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: Object.values(tagTypeData) as string[],
  endpoints: () => ({}),
});
