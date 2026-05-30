// Per-user course progress, stored in Firestore at users/{uid}.
// Shape: { progress: { [courseName]: number[] } } where each array holds the
// completed chapter numbers for that course. This mirrors the csprogress Redux
// slice so the UI consumers barely change.
import { doc, getDoc, setDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type ProgressMap = Record<string, number[]>;

// The courses we track. New users start with empty arrays for each.
export const initialProgress = (): ProgressMap => ({
  Javascript: [],
  "Frontend development": [],
  "Introduction to Backend Development with Nodejs and Express": [],
});

// Load a user's progress, creating the document with empty progress on first use.
export async function fetchProgress(uid: string): Promise<ProgressMap> {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    const initial = initialProgress();
    await setDoc(ref, { progress: initial });
    return initial;
  }

  const data = snap.data() as { progress?: ProgressMap } | undefined;
  return data?.progress ?? {};
}

// Record a completed chapter for a course. arrayUnion is idempotent, so calling
// this for an already-completed chapter is a no-op, and merge:true preserves the
// other courses' progress.
export async function markChapterComplete(
  uid: string,
  course: string,
  chapter: number
): Promise<void> {
  const ref = doc(db, "users", uid);
  await setDoc(
    ref,
    { progress: { [course]: arrayUnion(chapter) } },
    { merge: true }
  );
}
