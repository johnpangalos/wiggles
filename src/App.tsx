import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  withRouter,
} from "react-router-dom";
import { matchPath } from "react-router-dom";
import { useDispatch } from "redux-react-hook";

import { Constants } from "./constants";
import { Loading, BottomNavigation } from "./components";
import { Fade } from "./components/transitions";
import { Login, Feed, Profile } from "./containers";
import { Upload } from "./pages/Upload";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const distpatch = useDispatch();

  useEffect(() => {
    let callback: any = null;
    let metadataRef: any = null;
    let metadataUnsub: any = null;
    const unsubscribe = window.firebase
      .auth()
      .onAuthStateChanged((res: any) => {
        if (callback && metadataUnsub) metadataUnsub();

        if (res) {
          metadataRef = window.db.collection("metadata");
          callback = async (snapshot: any) => {
            res.getIdToken(true);
            const idToken = await window.firebase
              .auth()
              .currentUser.getIdTokenResult();
            setUser(idToken);
            distpatch({ type: Constants.UPDATE_USER, payload: idToken });
            setLoading(false);
          };
          metadataUnsub = metadataRef.onSnapshot(callback);
        } else {
          setLoading(false);
        }
      });
    return () => unsubscribe();
  }, [distpatch]);

  const signOut = () => {
    window.firebase.auth().signOut();
    setUser(null);
  };

  return (
    <div id="App" className="h-full text-gray-800">
      <Router>
        <div className="flex flex-col w-full h-full">
          <div className="flex-1 w-full overflow-y-auto overflow-x-hidden">
            {loading ? (
              <Fade appear in={loading} addEndListener={() => null}>
                <Loading />
              </Fade>
            ) : (
              <>
                <PrivateRoute
                  signOut={signOut}
                  user={user}
                  exact
                  path={["/upload", "/upload/:currentTab"]}
                  component={(args: any) => <Upload user={user} {...args} />}
                />
                <PrivateRoute
                  exact
                  signOut={signOut}
                  user={user}
                  path="/"
                  component={() => <Feed />}
                />
                <PrivateRoute
                  signOut={signOut}
                  user={user}
                  path="/profile"
                  component={() => <Profile signOut={signOut} user={user} />}
                />
                <PublicRoute
                  path="/login"
                  component={() => <Login user={user} />}
                />
              </>
            )}
          </div>

          {user && (
            <Fade appear in={!loading} addEndListener={() => null}>
              <BottomNavigation />
            </Fade>
          )}
        </div>
      </Router>
    </div>
  );
};

const PublicRoute = withRouter<any, any>(
  ({ location, component: Component, user, ...rest }: any) => (
    <Fade
      addEndListener={() => null}
      mountOnEnter
      unmountOnExit
      appear
      in={locationEqualToPath(location.pathname, rest.path)}
    >
      <Route {...rest} render={(props) => <Component {...props} />} />
    </Fade>
  )
);

const locationEqualToPath = (name: string, path: string | string[]) => {
  if (typeof path === "string") return name === path;
  return path.some((item) => matchPath(name, item));
};

const PrivateRoute = withRouter<any, any>(
  ({ location, component: Component, user, signOut, ...rest }: any) => {
    return (
      <Route
        {...rest}
        render={(props) =>
          user ? (
            <Fade
              addEndListener={() => null}
              mountOnEnter
              unmountOnExit
              appear
              in={locationEqualToPath(location.pathname, rest.path)}
            >
              <Component {...props} />
            </Fade>
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location },
              }}
            />
          )
        }
      />
    );
  }
);

export default App;
