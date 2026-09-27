import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/ui/Spinner";

// Guards routes that only make sense for a signed-out visitor, such as
// login and register. A user who is already authenticated is redirected
// straight to their dashboard instead of being allowed to, for example,
// register a second account while logged in.
function GuestRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Spinner label="Loading…" />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default GuestRoute;
