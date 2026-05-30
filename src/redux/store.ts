import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import { persistConfig } from "./persist";
import latestLessonReducer from "./latestlession.slice";
import ComputerSciencePogressReducer from "./csprogress.slice";
import CSOverallporgress from "./csoverallprogress.slice";
import languageReducer from "./language.slice";

const rootReducer = combineReducers({
  latestLesson: latestLessonReducer,
  csprogress: ComputerSciencePogressReducer,
  csoverallprogress: CSOverallporgress,
  language: languageReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer as any, // eslint-disable-line @typescript-eslint/no-explicit-any
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);

// Inferred types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
