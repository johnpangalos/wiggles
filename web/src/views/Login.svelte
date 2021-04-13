<script lang="ts">
  import DarkModeToggle from "../lib/DarkModeToggle.svelte";
  import Button, { Variant } from "../lib/Button.svelte";
  import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
  import { getAuth } from "firebase/auth";
  import { getApp } from "firebase/app";
  import { loggedIn, LogInState } from "../stores";

  const firebaseApp = getApp();
  const auth = getAuth(firebaseApp);
  const provider = new GoogleAuthProvider();

  /* let loginState: LogInState = LogInState.Loading; */
  function login() {
    loggedIn.set(LogInState.Loading);
    signInWithRedirect(auth, provider)
      .then(() => {
        loggedIn.set(LogInState.LoggedIn);
      })
      .catch((_error) => {
        loggedIn.set(LogInState.LoggedOut);
      });
  }
</script>

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
