import { getEmailFromPayload } from "@/middleware/auth";
import { Account, Post, WigglesContext } from "@/types";
import { imageUrl } from "@/utils";

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
  c: WigglesContext,
  post: Post,
): Promise<PostResponse | null> {
  // Fall back to legacy r2Key field for posts created before the rename
  const id = post.imageId ?? (post as unknown as { r2Key: string }).r2Key;
  const url = imageUrl(c, id);

  const account = await c.env.WIGGLES.get(`account-${post.accountId}`);
  if (account === null) {
    console.error({
      level: "error",
      handler: "populatePost",
      postId: post.id,
      accountId: post.accountId,
      message: `Account not found for post`,
    });
    throw new Error(`Bad post data: ${post.accountId}`);
  }

  return {
    ...post,
    url,
    account: JSON.parse(account),
    orderKey: (MAX - Number.parseInt(post.timestamp)).toString(),
  };
}

type ReadPostsOptions = {
  limit: number;
  cursor?: string;
  email?: string;
};

export async function readPosts(c: WigglesContext, options: ReadPostsOptions) {
  const prefix = options.email ? `post-account-${options.email}` : "post-feed";
  const result = await c.env.WIGGLES.list<Post>({
    prefix,
    limit: options.limit,
    cursor: options.cursor,
  });
  const promises = [];
  for (const key of result.keys) {
    const post = key.metadata;
    if (post === undefined) throw new Error("Bad data");

    promises.push(populatePost(c, post));
  }
  const posts = await Promise.all(promises);
  const cursor = result.list_complete ? undefined : result.cursor;
  return { posts, cursor };
}

export async function createPosts(c: WigglesContext, postList: Post[]) {
  const body = postList.reduce<
    { key: string; value: string; metadata?: object }[]
  >((acc, post) => {
    return [
      ...acc,
      {
        key: `post-feed-${MAX - Number.parseInt(post.timestamp)}`,
        value: "",
        metadata: post,
      },
      {
        key: `post-account-${post.accountId}-${
          MAX - Number.parseInt(post.timestamp)
        }`,
        value: "",
        metadata: post,
      },
    ];
  }, []);

  console.log({
    level: "info",
    handler: "createPosts",
    postCount: postList.length,
    kvKeyCount: body.length,
  });

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${c.env.ACCOUNT_ID}/storage/kv/namespaces/${c.env.WIGGLES_KV_ID}/bulk`,
    {
      method: "PUT",
      headers: {
        "X-Auth-Email": "john@pangalos.dev",
        "X-Auth-Key": c.env.API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  if (res.status > 300) {
    const responseBody = await res.clone().text();
    console.error({
      level: "error",
      handler: "createPosts",
      status: res.status,
      responseBody,
      message: "KV bulk write failed",
    });
  }

  return res;
}

export async function deletePosts(c: WigglesContext, orderKeys: string[]) {
  const posts: Post[] = [];
  const keysToDelete: string[] = [];
  for (const key of orderKeys) {
    const feedKey = `post-feed-${key}`;

    const { payload } = c.get("JWT");
    const accountKey = `post-account-${getEmailFromPayload(payload)}-${key}`;

    const res = await c.env.WIGGLES.getWithMetadata<Post>(feedKey);
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
    imageIds: posts.map((p) => p.imageId),
  });

  const deleteRes = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${c.env.ACCOUNT_ID}/storage/kv/namespaces/${c.env.WIGGLES_KV_ID}/bulk`,
    {
      method: "DELETE",
      headers: {
        "X-Auth-Email": "john@pangalos.dev",
        "X-Auth-Key": c.env.API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(keysToDelete),
    },
  );

  if (deleteRes.status > 300) {
    const responseBody = await deleteRes.text();
    console.error({
      level: "error",
      handler: "deletePosts",
      status: deleteRes.status,
      responseBody,
      message: "KV bulk delete failed",
    });
  }

  const imageIds = posts.map((p) => p.imageId);
  await c.env.IMAGES_BUCKET.delete(imageIds);
}
