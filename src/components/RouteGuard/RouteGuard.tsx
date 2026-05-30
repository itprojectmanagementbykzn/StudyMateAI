// src/components/RouteGuard.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";

interface Props {
  children: JSX.Element;
}

export const RouteGuard: React.FC<Props> = ({ children }) => {
  const { status } = useAuth();

  // Firebase restores the session asynchronously; wait for it before deciding,
  // so a hard refresh doesn't bounce an authenticated user to the home page.
  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-medium text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (status === "guest") {
    return <Navigate to="/" replace />;
  }

  return children;
};
