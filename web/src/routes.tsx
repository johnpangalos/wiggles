import { createBrowserRouter, Navigate, useRouteError } from "react-router";
import { Login, Upload, Feed, Profile } from "@/pages";
import { feedLoader } from "@/pages/Feed";
import { profileAction, profileLoader } from "@/pages/Profile";
import { MainLayout } from "@/layouts/main";
import { Auth0ProviderWithNavigate, RequireAuth } from "@/App";

function ProfileErrorBoundary() {
  const error = useRouteError() as Error;
  return (
    <div className="h-full flex flex-col p-6 overflow-auto">
      <h1 className="text-xl font-bold text-red-600 mb-2">
        Something went wrong
      </h1>
      <p className="text-gray-800 mb-4">{error?.message ?? String(error)}</p>
      {error?.stack && (
        <pre className="text-xs text-gray-600 whitespace-pre-wrap bg-gray-100 p-4 rounded overflow-auto">
          {error.stack}
        </pre>
      )}
    </div>
  );
}

export const router = createBrowserRouter([
  {
    element: <Auth0ProviderWithNavigate />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          {
            path: "feed",
            loader: feedLoader,
            element: (
              <RequireAuth>
                <Feed />
              </RequireAuth>
            ),
          },
          { path: "login", element: <Login /> },
          {
            path: "upload",
            element: (
              <RequireAuth>
                <Upload />
              </RequireAuth>
            ),
          },
          {
            path: "profile",
            loader: profileLoader,
            action: profileAction,
            errorElement: <ProfileErrorBoundary />,
            element: (
              <RequireAuth>
                <Profile />
              </RequireAuth>
            ),
          },
          { index: true, element: <Navigate to="feed" /> },
          { path: "*", element: <Navigate to="feed" /> },
        ],
      },
    ],
  },
]);
