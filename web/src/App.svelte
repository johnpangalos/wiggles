<script lang="ts">
  import { getApp } from "firebase/app";
  import Button, { Variant } from "./lib/Button.svelte";
  import Loading from "./lib/Loading.svelte";
  import {
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithRedirect,
  } from "firebase/auth";
  import Feed from "./views/Feed.svelte";
  import DarkModeToggle from "./lib/DarkModeToggle.svelte";

  import { darkMode } from "./stores";

  const firebaseApp = getApp();
  const auth = getAuth(firebaseApp);
  const provider = new GoogleAuthProvider();

  enum LogInState {
    LoggedIn,
    LoggedOut,
    Loading,
  }

  let loginState: LogInState = LogInState.Loading;
  // let darkMode = localStorage.getItem("darkMode") === "true";
  onAuthStateChanged(auth, function (user) {
    if (user) loginState = LogInState.LoggedIn;
    else loginState = LogInState.LoggedOut;
  });

  function login() {
    loginState = LogInState.Loading;

    signInWithRedirect(auth, provider)
      .then(() => {
        loginState = LogInState.LoggedIn;
      })
      .catch((_error) => {
        loginState = LogInState.LoggedOut;
      });
  }

  let isDarkMode = false;
  darkMode.subscribe((val) => (isDarkMode = val));
</script>

<main class:dark={isDarkMode}>
  <div class="w-full h-screen text-gray-800 dark:bg-gray-800 dark:text-white">
    {#if loginState === LogInState.LoggedOut}
      <div class="flex flex-col items-center justify-center h-full">
        <div class="flex justify-end w-full p-3">
          <DarkModeToggle />
        </div>
        <div class="flex-1" />
        <div class="flex items-center justify-center h-full">
          <div class="flex flex-col p-6 bg-gray-100 rounded dark:bg-gray-700">
            <div class="text-xl font-bold">You are logged out!</div>
            <div class="pb-6">Please log in to view content.</div>
            <div class="self-end">
              <Button variant={Variant.Text} on:click={login}>Log in</Button>
            </div>
          </div>
        </div>
        <div class="flex-1" />
      </div>
    {:else if loginState === LogInState.LoggedIn}
      <Feed />
    {:else}
      <div class="flex items-center justify-center h-full">
        <Loading />
      </div>
    {/if}
  </div>
</main>
