import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export const Login = () => {
  const { loginWithRedirect, isAuthenticated, isLoading, error } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/feed");
      return;
    }
    if (!isLoading && !error) {
      loginWithRedirect();
    }
  }, [isAuthenticated, isLoading, loginWithRedirect, navigate, error]);

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-red-600">Login error: {error.message}</p>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => loginWithRedirect()}
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex items-center justify-center">
      <div>Redirecting to login...</div>
    </div>
  );
};
