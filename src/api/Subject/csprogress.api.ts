// src/api/csprogress.api.ts
import { baseAPI } from "../base.config";

interface SubProgressType {
  userId: string;
  // The backend nests the per-course progress map under progress.progress.
  progress: {
    progress: {
      [courseName: string]: number[];
    };
  };
}

export const ComputerScienceProgressApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // GET full progress of current user
    getProgress: builder.query<SubProgressType, void>({
      query: () => ({
        url: "/api/csprogress",
      }),
    }),

    // PATCH progress (update by subject & chapter)
    updateProgress: builder.mutation<
      SubProgressType,
      { subject: string; chapterId: number }
    >({
      query: ({ subject, chapterId }) => ({
        url: `/api/csprogress/${subject}/${chapterId}`,
        method: "PATCH",
      }),
    }),
  }),
});

export const { useGetProgressQuery, useUpdateProgressMutation } =
  ComputerScienceProgressApi;
