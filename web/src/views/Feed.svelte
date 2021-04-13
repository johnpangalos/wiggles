<script lang="ts" context="module">
  export type Post = {
    id: string;
    media: {
      contentType: string;
      id: string;
      path: string;
      status: string;
      thumbnail: string;
      timestamp: string;
      uploadFinished: boolean;
      userId: string;
      web: string;
    };
    refId: string;
    timestamp: string;
    type: string;
    userId: string;
  };
</script>

<script lang="ts">
  import { getApp } from "firebase/app";
  import { getAuth, signOut } from "firebase/auth";
  import {
    getFirestore,
    collection,
    query,
    limit,
    orderBy,
    /* startAfter, */
    getDocs,
    /* QueryDocumentSnapshot, */
    QuerySnapshot,
  } from "firebase/firestore";
  import DarkModeToggle from "../lib/DarkModeToggle.svelte";
  import Button, { Color, Variant } from "../lib/Button.svelte";
  import Loading from "../lib/Loading.svelte";

  const firebaseApp = getApp();
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);

  /* let lastVisible: QueryDocumentSnapshot<unknown> | undefined; */
  let documentSnapshots: QuerySnapshot<Post>;

  async function fetchPosts() {
    const first = query(
      collection(db, "posts"),
      orderBy("timestamp", "desc"),
      limit(10)
    );
    documentSnapshots = await getDocs<Post>(first);
    /* console.log(documentSnapshots.docs.map(doc => doc.data())); */
    /* lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1]; */
  }

  let promise = fetchPosts();

  // console.log("last", lastVisible);

  // const next = query(
  //   collection(db, "cities"),
  //   orderBy("population"),
  //   startAfter(lastVisible),
  //   limit(25)
  // );
</script>

{#await promise}
  <div class="flex items-center justify-center h-full">
    <Loading />
  </div>
{:then}
  <div class="flex flex-col items-center justify-center w-full h-full">
    <div class="flex items-center justify-end w-full p-3 space-x-1">
      <Button
        variant={Variant.Text}
        color={Color.Secondary}
        on:click={() => signOut(auth)}>
        Log out
      </Button>
      <DarkModeToggle />
    </div>
    <div class="flex-1" />
    {#each documentSnapshots.docs.map((doc) => doc.data()) as post}
      <div>{post.media.web}</div>
    {/each}
    <div class="flex-1" />
  </div>
  <!-- {:catch error}
	<p style="color: red">{error.message}</p> -->
{/await}
