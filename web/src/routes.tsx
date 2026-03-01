import { createBrowserRouter, Navigate, Outlet } from "react-router";
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
          { path: "login", lazy: () => import("./routes/login") },
          {
            element: (
              <RequireAuth>
                <Outlet />
              </RequireAuth>
            ),
            children: [
              { path: "feed", lazy: () => import("./routes/feed") },
              { path: "upload", lazy: () => import("./routes/upload") },
              { path: "profile", lazy: () => import("./routes/profile") },
            ],
          },
          { index: true, element: <Navigate to="feed" /> },
          { path: "*", element: <Navigate to="feed" /> },
        ],
      },
    ],
  },
]);
