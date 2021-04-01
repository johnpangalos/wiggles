<script lang="ts">
  import firebase from "firebase/app";
  import Counter from "./lib/Counter.svelte";
  import { Button, Loading } from "./lib";
  const provider = new firebase.auth.GoogleAuthProvider();
  enum LogInState {
    LoggedIn,
    LoggedOut,
    Loading,
  }

  let loginState: LogInState = LogInState.Loading;
  let darkMode = localStorage.getItem("darkMode") === "true";
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) loginState = LogInState.LoggedIn;
    else loginState = LogInState.LoggedOut;
  });

  function login() {
    loginState = LogInState.Loading;
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(() => {
        loginState = LogInState.LoggedIn;
      })
      .catch((error) => {
        loginState = LogInState.LoggedOut;
        // TODO: Error handle this case
      });
  }
  function logout() {
    firebase.auth().signOut();
  }
</script>

<main class:dark={darkMode}>
  <div class="w-full h-screen text-gray-800">
    {#if loginState === LogInState.LoggedOut}
      <div class="flex h-full items-center justify-center">
        <div class="flex flex-col bg-gray-100 p-6 rounded">
          <div class="text-xl font-bold">You are logged out!</div>
          <div class="pb-4">Please log in to view content.</div>
          <div class="m-auto">
            <Button on:click={login}>Log in</Button>
          </div>
        </div>
      </div>
    {:else if loginState === LogInState.LoggedIn}
      <div class="flex flex-col w-full h-full justify-center items-center">
        <div>
          <Button on:click={logout}>Log out</Button>
        </div>
      </div>
    {:else}
      <div class="flex h-full items-center justify-center">
        <Loading />
      </div>
    {/if}
  </div>
</main>
