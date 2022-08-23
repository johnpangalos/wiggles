import React from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import { Login, Feed, Profile } from "./containers";
import { useAuth } from "@/hooks";
import { Upload } from "./pages/Upload";
import { MainLayout } from "./layouts/main";

const App = () => {
  return (
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
  );
};

function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (!loading && user === null)
    return <Navigate to="/login" state={{ from: location }} replace />;

  return children;
}
export default App;
