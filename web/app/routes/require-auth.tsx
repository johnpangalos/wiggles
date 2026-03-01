import { Outlet } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect } from "react";

export default function RequireAuthLayout({
  children,
}: {
  children?: React.ReactNode;
}): React.JSX.Element {
  const { isAuthenticated, isLoading, loginWithRedirect, error } = useAuth0();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !error) {
      loginWithRedirect({
        appState: { returnTo: window.location.pathname },
      });
    }
  }, [isLoading, isAuthenticated, loginWithRedirect, error]);

  if (isLoading) return <></>;

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-red-600">Authentication error: {error.message}</p>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => loginWithRedirect()}
        >
          Try again
        </button>
      </div>
    );
  }

  if (!isAuthenticated) return <></>;

  return <>{children ?? <Outlet />}</>;
}
