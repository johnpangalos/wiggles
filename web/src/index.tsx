import { createRoot } from "react-dom/client";

import "./styles/index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// import { initializeApp } from "firebase/app";

// const config = {
//   apiKey: "AIzaSyDcx5xDlQS3ixEFF8mESoxUzTk9f56uQhA",
//   authDomain: "wiggles-f0bd9.firebaseapp.com",
//   databaseURL: "https://wiggles-f0bd9.firebaseio.com",
//   projectId: "wiggles-f0bd9",
//   storageBucket: "wiggles-f0bd9.appspot.com",
//   messagingSenderId: "837754270874",
// };

// initializeApp(config);

const queryClient = new QueryClient();

const container = document.getElementById("root");
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
root.render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
