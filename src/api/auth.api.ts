// src/api/auth.api.ts
import { baseAPI } from "./base.config";

export const authApi = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
    login: builder.mutation<{ token: string }, { email: string; password: string }>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),
    signup: builder.mutation<{ token: string }, { email: string; password: string; name:string ,studentid:string }>({
      query: (body) => ({
        url: "auth/signup",
        method: "POST",
        body,
      }),
    }),
  }),
})

export const { useLoginMutation, useSignupMutation } = authApi;
