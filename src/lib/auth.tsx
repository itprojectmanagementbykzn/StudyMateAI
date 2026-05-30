// Firebase-backed auth state for the whole app. A single onAuthStateChanged
// listener feeds a React context so any component can read the current user.
//
// `status` starts as "loading" because Firebase restores the session
// asynchronously on a fresh page load. Guards must wait for it to resolve to
// "authed" / "guest" instead of treating the initial null user as signed-out —
// otherwise a hard refresh would bounce an authenticated user to the home page.
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";

export type AuthStatus = "loading" | "authed" | "guest";

interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  status: "loading",
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setStatus(nextUser ? "authed" : "guest");
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, status }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
