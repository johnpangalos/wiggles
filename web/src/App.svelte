<script lang="ts">
  import { getApp } from "firebase/app";
  import Loading from "./lib/Loading.svelte";
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  import Feed from "./views/Feed.svelte";
  import Login from "./views/Login.svelte";

  import { darkMode, loggedIn, LogInState } from "./stores";

  const firebaseApp = getApp();
  const auth = getAuth(firebaseApp);

  onAuthStateChanged(auth, function (user) {
    if (user) loggedIn.set(LogInState.LoggedIn);
    else loggedIn.set(LogInState.LoggedOut);
  });

  let isDarkMode = false;
  let loginState = LogInState.Loading;
  darkMode.subscribe((val) => (isDarkMode = val));
  loggedIn.subscribe((val) => (loginState = val));
</script>

<main class:dark={isDarkMode}>
  <div class="w-full h-m-screen text-gray-800 dark:bg-gray-800 dark:text-white">
    {#if loginState === LogInState.LoggedOut}
      <Login />
    {:else if loginState === LogInState.LoggedIn}
      <Feed />
    {:else}
      <div class="flex items-center justify-center h-full">
        <Loading />
      </div>
    {/if}
  </div>
</main>
