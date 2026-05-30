// src/redux/persist.ts
import storage from "redux-persist/lib/storage";
// Auth is no longer persisted here — Firebase Auth owns session persistence.
// csprogress is intentionally omitted too; it's reloaded from Firestore on sign-in.
const persistSlices = ["latestLesson", "csoverallprogress", "language"];
export const persistConfig = {
  key: "root",
  storage: storage,
  devTools: true,
  whitelist: persistSlices,
};
