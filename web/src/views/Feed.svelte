<script lang="ts">
  import type { Post } from "../types";
  import { getApp } from "firebase/app";
  import { getAuth, signOut } from "firebase/auth";
  import {
    getFirestore,
    collection,
    query,
    limit,
    orderBy,
    startAfter,
    getDocs,
    QueryDocumentSnapshot,
    QuerySnapshot,
  } from "firebase/firestore";
  import { getStorage, ref, getDownloadURL } from "firebase/storage";

  import DarkModeToggle from "../lib/DarkModeToggle.svelte";
  import PostList from "../lib/PostList.svelte";
  import Button, { Color, Variant } from "../lib/Button.svelte";
  import Loading from "../lib/Loading.svelte";

  import { onMount } from "svelte";

  const firebaseApp = getApp();
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);
  const storage = getStorage(firebaseApp);

  let lastVisible: QueryDocumentSnapshot<Post> | undefined;
  let documentSnapshots: QuerySnapshot<Post>;

  let urls: string[] = [];
  async function fetchPosts() {
    if (lastVisible !== undefined) return;
    const q = query(
      collection(db, "posts"),
      orderBy("timestamp", "desc"),
      limit(10)
    );
    documentSnapshots = await getDocs<Post>(q);
    lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
    urls = await Promise.all(
      documentSnapshots.docs.map((doc) => {
        const post = doc.data();
        const imgRef = ref(storage, post.media.web);
        return getDownloadURL(imgRef);
      })
    );
  }

  async function next() {
    if (lastVisible === undefined) return;
    const q = query(
      collection(db, "posts"),
      orderBy("timestamp", "desc"),
      startAfter(lastVisible),
      limit(10)
    );
    documentSnapshots = await getDocs<Post>(q);
    lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
    const nextUrls = await Promise.all(
      documentSnapshots.docs.map((doc) => {
        const post = doc.data();
        const imgRef = ref(storage, post.media.web);
        return getDownloadURL(imgRef);
      })
    );

    urls = [...urls, ...nextUrls];
  }

  let promise = fetchPosts();
  let promise2: Promise<void> = Promise.resolve();
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
        on:click={() => signOut(auth)}
      >
        Log out
      </Button>
      <DarkModeToggle />
    </div>
    <PostList
      {urls}
      callback={() => {
        promise2 = next();
      }}
    />
    {#await promise2}
      Loading...
    {/await}

    <div class="pt-4" />
  </div>
  <!-- {:catch error}
	<p style="color: red">{error.message}</p> -->
{/await}
