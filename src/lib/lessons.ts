// Client-side access to the lesson catalog served by /api/lessons. Uses the
// bundled CSData as initial/fallback data so the UI renders instantly and still
// works offline or before the API responds, then refreshes from the backend.
import { useQuery } from "@tanstack/react-query";
import ComputerScienceData, {
  type SubjectDataType,
} from "@/components/SubjectData/ComputerScience/CSData";

const FALLBACK_CATALOG: SubjectDataType[] = [ComputerScienceData];

export async function fetchLessonCatalog(): Promise<SubjectDataType[]> {
  const res = await fetch("/api/lessons");
  if (!res.ok) {
    throw new Error(`Failed to load lessons (${res.status}).`);
  }
  const data: unknown = await res.json();
  const subjects = (data as { subjects?: unknown })?.subjects;
  return Array.isArray(subjects) && subjects.length > 0
    ? (subjects as SubjectDataType[])
    : FALLBACK_CATALOG;
}

export function useLessonCatalog() {
  return useQuery({
    queryKey: ["lessons"],
    queryFn: fetchLessonCatalog,
    initialData: FALLBACK_CATALOG,
    staleTime: 1000 * 60 * 60,
  });
}
