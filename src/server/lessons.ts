// Server-side source of the lesson catalog. Re-exports the single source of
// truth (CSData) so the /api/lessons function can serve it without the client
// having to bundle the content. Relative import (no "@/" alias) so it can be
// bundled by Vercel and loaded by the Vite config.
import ComputerScienceData, {
  type SubjectDataType,
} from "../components/SubjectData/ComputerScience/CSData";

export function getLessonCatalog(): SubjectDataType[] {
  return [ComputerScienceData];
}
