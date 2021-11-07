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
        console.log(post);
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
    <div class="flex items-center w-full p-3 space-x-1">
      <label>
        <div
          class="h-8 w-8 flex items-center justify-center col-start-1 row-start-1 rounded-full focus:outline-none z-10 hover:bg-gray-600 hover:bg-opacity-10 dark:hover:bg-gray-300 dark:hover:bg-opacity-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <input type="file" class="hidden" />
      </label>
      <div class="flex-grow" />
      <DarkModeToggle />
      <Button
        variant={Variant.Text}
        color={Color.Secondary}
        on:click={() => signOut(auth)}
      >
        Log out
      </Button>
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
{/await}
