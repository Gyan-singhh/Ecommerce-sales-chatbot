import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

function AuthLayout({ children, allowPublic = false }) {
  const { isLoggedIn, loading, initialized } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (initialized && !loading) {
      if (!isLoggedIn && !allowPublic) {
        if (location.pathname !== "/login") {
          sessionStorage.setItem("redirectPath", location.pathname);
        }
        navigate("/login");
      }

      if (isLoggedIn && (location.pathname === "/login" || location.pathname === "/register")) {
        const redirectPath = sessionStorage.getItem("redirectPath") || "/";
        sessionStorage.removeItem("redirectPath");
        navigate(redirectPath);
      }
    }
  }, [isLoggedIn, loading, allowPublic, location.pathname, navigate, initialized]);

  if (loading || !initialized) {
    return (
      <div className="h-screen flex justify-center items-center text-2xl">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}

export default AuthLayout;

