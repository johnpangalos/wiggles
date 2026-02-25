import { createBrowserRouter, Navigate } from "react-router";
import { Login, Upload, Feed, Profile } from "@/pages";
import { MainLayout } from "@/layouts/main";
import { Auth0ProviderWithNavigate, RequireAuth } from "@/App";

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
