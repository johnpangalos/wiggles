import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { Login, Upload, Feed, Profile } from "@/pages";
import { MainLayout } from "./layouts/main";
import { BreakpointProvider } from "@/hooks";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { checkRegistration, register, unregister } from "./register-sw";
import { setTokenAccessor } from "@/utils";

function Auth0ProviderWithNavigate({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();

  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin + "/feed",
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      }}
      onRedirectCallback={(appState) => {
        navigate(appState?.returnTo || "/feed");
      }}
    >
      <TokenAccessorSetup />
      {children}
    </Auth0Provider>
  );
}

function TokenAccessorSetup() {
  const { getAccessTokenSilently } = useAuth0();
  useEffect(() => {
    setTokenAccessor(getAccessTokenSilently);
  }, [getAccessTokenSilently]);
  return null;
}

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
      <div id="App" className="h-[100svh] overflow-hidden text-gray-800">
        <Router>
          <Auth0ProviderWithNavigate>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route
                  path="feed"
                  element={
                    <RequireAuth>
                      <Feed />
                    </RequireAuth>
                  }
                />
                <Route path="login" element={<Login />} />

                <Route
                  path={"upload"}
                  element={
                    <RequireAuth>
                      <Upload />
                    </RequireAuth>
                  }
                />
                <Route
                  path="profile"
                  element={
                    <RequireAuth>
                      <Profile />
                    </RequireAuth>
                  }
                />
                <Route path="/" element={<Navigate to="feed" />} />
                <Route path="*" element={<Navigate to="feed" />} />
              </Route>
            </Routes>
          </Auth0ProviderWithNavigate>
        </Router>
      </div>
    </BreakpointProvider>
  );
};

function RequireAuth({ children }: { children: JSX.Element }): JSX.Element {
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

  return children;
}
export default App;
