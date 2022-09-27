import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { Login, Upload, Feed, Profile } from "@/pages";
import { MainLayout } from "./layouts/main";
import { BreakpointProvider } from "@/hooks";
import { SW } from "@/sw";
import { useQuery } from "@tanstack/react-query";

const App = () => {
  return (
    <BreakpointProvider>
      <div id="App" className="h-full text-gray-800">
        <Router>
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
        </Router>
      </div>

      <SW />
    </BreakpointProvider>
  );
};

function RequireAuth({ children }: { children: JSX.Element }) {
  const { error } = useQuery(["me"], () =>
    fetch(`${import.meta.env.VITE_API_URL}/me`).then((res) => res.json())
  );

  if (error) return <Navigate to="/login" state={{ from: location }} replace />;

  return children;
}
export default App;
