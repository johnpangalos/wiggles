import type { Account, Post } from "~/types";
import { imageUrl } from "~/lib/utils.server";

const MAX = 9999999999999;
export const POST_KEY_PREFIX = "post-feed";

export function genPostKey(id: string) {
  return `${POST_KEY_PREFIX}-${id}`;
}

type PostResponse = {
  url: string;
  account: Account;
  orderKey: string;
} & Post;

export async function populatePost(
  kv: KVNamespace,
  origin: string,
  post: Post,
): Promise<PostResponse | null> {
  const url = imageUrl(origin, post.r2Key);

  const account = await kv.get(`account-${post.accountId}`);
  if (account === null) {
    console.error({
      level: "error",
      handler: "populatePost",
      postId: post.id,
      accountId: post.accountId,
      message: "Account not found for post",
    });
    return null;
  }

  return {
    ...post,
    url,
    account: JSON.parse(account) as Account,
    orderKey: (MAX - Number.parseInt(post.timestamp)).toString(),
  };
}

type ReadPostsOptions = {
  limit: number;
  cursor?: string;
  email?: string;
};

export async function readPosts(
  kv: KVNamespace,
  origin: string,
  options: ReadPostsOptions,
) {
  const prefix = options.email ? `post-account-${options.email}` : "post-feed";
  const result = await kv.list<Post>({
    prefix,
    limit: options.limit,
    cursor: options.cursor,
  });
  const promises = [];
  for (const key of result.keys) {
    const post = key.metadata;
    if (post === undefined) throw new Error("Bad data");

    promises.push(populatePost(kv, origin, post));
  }
  const results = await Promise.all(promises);
  const posts = results.filter((post): post is PostResponse => post !== null);
  const cursor = result.list_complete ? undefined : result.cursor;
  return { posts, cursor };
}

export async function createPosts(kv: KVNamespace, postList: Post[]) {
  const entries = postList.flatMap((post) => {
    const sortKey = MAX - Number.parseInt(post.timestamp);
    return [
      {
        key: `post-feed-${sortKey}`,
        value: "",
        metadata: post,
      },
      {
        key: `post-account-${post.accountId}-${sortKey}`,
        value: "",
        metadata: post,
      },
    ];
  });

  console.log({
    level: "info",
    handler: "createPosts",
    postCount: postList.length,
    kvKeyCount: entries.length,
  });

  await Promise.all(
    entries.map(({ key, value, metadata }) => kv.put(key, value, { metadata })),
  );
}

export async function deletePosts(
  kv: KVNamespace,
  imagesBucket: R2Bucket,
  email: string,
  orderKeys: string[],
) {
  const posts: Post[] = [];
  const keysToDelete: string[] = [];
  for (const key of orderKeys) {
    const feedKey = `post-feed-${key}`;
    const accountKey = `post-account-${email}-${key}`;

    const res = await kv.getWithMetadata<Post>(feedKey);
    if (res.metadata === null) {
      console.error({
        level: "error",
        handler: "deletePosts",
        feedKey,
        message: "Post not found in KV",
      });
      throw new Error(`The id ${feedKey} does not exist.`);
    }

    posts.push(res.metadata);
    keysToDelete.push(accountKey);
    keysToDelete.push(feedKey);
  }

  console.log({
    level: "info",
    handler: "deletePosts",
    keysToDelete: keysToDelete.length,
    r2Keys: posts.map((p) => p.r2Key),
  });

  await Promise.all(keysToDelete.map((key) => kv.delete(key)));

  const r2Keys = posts.map((p) => p.r2Key);
  await imagesBucket.delete(r2Keys);
}
