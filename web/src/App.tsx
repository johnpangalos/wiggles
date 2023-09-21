import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
  useNavigate,
  useRouteError,
} from "react-router-dom";
import { Login, Upload, Feed, Profile, loader, profileLoader } from "@/pages";
import { MainLayout } from "./layouts/main";
import { BreakpointProvider } from "@/hooks";
import { captureMessage, wrapCreateBrowserRouter } from "@sentry/react";
import { useQuery } from "@tanstack/react-query";
import { loginUrl } from "@/utils";
import { useEffect } from "react";
import { checkRegistration, register, unregister } from "./register-sw";
import { Button } from "./components";

const sentryCreateBrowserRouter = wrapCreateBrowserRouter(createBrowserRouter);

function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  if (error instanceof Error) captureMessage(error.message, "fatal");
  return <div>Dang!</div>;
}

function PageNotFound() {
  const navigate = useNavigate();
  return (
    <div className="h-full flex flex-col items-center max-w-xl pt-24 m-auto space-y-4">
      <div className="font-bold text-xl text-gray-700">
        Where do you think you&apos;re going?
      </div>
      <div>
        There is really nothing here to see, I mean like nothing. You don&apos;t
        have to leave but you can&apos;t stay here.
      </div>
      <div className="self-end">
        <Button onClick={() => navigate("/feed")}>Take me home</Button>
      </div>
    </div>
  );
}

const router = sentryCreateBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "feed",
        loader: loader,
        element: (
          <RequireAuth>
            <Feed />
          </RequireAuth>
        ),
      },

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
        element: (
          <RequireAuth>
            <Profile />
          </RequireAuth>
        ),
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "*",
        element: <PageNotFound />,
      },
      {
        index: true,
        Component: () => (
          <RequireAuth>
            <Navigate to="feed" />
          </RequireAuth>
        ),
      },
    ],
  },
]);

const App = () => {
  useEffect(() => {
    const registerSW = async () => {
      await unregister();
      const registration = await checkRegistration();
      if (registration === undefined) await register();
    };
    registerSW();
  }, []);
  return (
    <BreakpointProvider>
      <RouterProvider router={router} />
    </BreakpointProvider>
  );
};

function RequireAuth({ children }: { children: JSX.Element }): JSX.Element {
  const { error } = useQuery(["me"], () =>
    fetch(`${import.meta.env.VITE_API_URL}/me`).then((res) => res.json())
  );

  if (error) {
    window.location.replace(loginUrl);
    return <></>;
  }

  return children;
}

export default App;
