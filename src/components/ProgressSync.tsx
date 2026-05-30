// Bridges Firebase auth -> Firestore progress -> Redux. Renders nothing.
// When a user signs in, it loads their progress into the csprogress slice; when
// they sign out, it clears it. Mounted once near the app root, inside both the
// Redux Provider and the AuthProvider.
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "@/lib/auth";
import { fetchProgress } from "@/lib/progress";
import {
  setProgress,
  setProgressStatus,
  resetProgress,
} from "@/redux/csprogress.slice";

export const ProgressSync = () => {
  const { user, status } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    if (status === "guest") {
      dispatch(resetProgress());
      return;
    }
    if (status !== "authed" || !user) return;

    let cancelled = false;
    dispatch(setProgressStatus("loading"));
    fetchProgress(user.uid)
      .then((progress) => {
        if (!cancelled) dispatch(setProgress({ userId: user.uid, progress }));
      })
      .catch(() => {
        if (!cancelled) dispatch(setProgressStatus("error"));
      });

    return () => {
      cancelled = true;
    };
  }, [status, user, dispatch]);

  return null;
};

export default ProgressSync;
