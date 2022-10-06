import { Identity } from "@/middleware/auth";
import { Account, Post, WigglesContext } from "@/types";
import { DAY, generateSignedUrl, ImageSize, unixTime } from "@/utils";

const MAX = 9999999999999;
export const POST_KEY_PREFIX = "post-feed";

export function genPostKey(id: string) {
  return `${POST_KEY_PREFIX}-${id}`;
}

type ReadPostOptions = {
  size?: ImageSize;
  cursor?: string;
};

type PostResponse = {
  url: string;
  account: Account;
  orderKey: string;
} & Post;

export async function populatePost(
  c: WigglesContext,
  post: Post,
  options?: ReadPostOptions
): Promise<PostResponse | null> {
  const size = options?.size ? options.size : "WRPost";

  const imageKey = `image-${post.cfImageId}-size-${size}`;

  let url = await c.env.WIGGLES.get(imageKey);

  if (url === null) {
    const expiration = unixTime(DAY);
    url = await generateSignedUrl(c, post.cfImageId, expiration, size);
    c.env.WIGGLES.put(imageKey, url, { expirationTtl: expiration });
  }

  const account = await c.env.WIGGLES.get(`account-${post.accountId}`);
  if (account === null) throw new Error(`Bad post data: ${post.accountId}`);

  return {
    ...post,
    url,
    account: JSON.parse(account),
    orderKey: (MAX - Number.parseInt(post.timestamp)).toString(),
  };
}

type ReadPostsOptions = {
  limit: number;
  size: ImageSize;
  cursor?: string;
  email?: string;
};

export async function readPosts(c: WigglesContext, options: ReadPostsOptions) {
  const prefix = options.email ? `post-account-${options.email}` : "post-feed";
  const { keys, cursor } = await c.env.WIGGLES.list<Post>({
    prefix,
    limit: options.limit,
    cursor: options.cursor,
  });
  const promises = [];
  for (const key of keys) {
    const post = key.metadata;
    if (post === undefined) throw new Error("Bad data");

    promises.push(populatePost(c, post, options));
  }
  const posts = await Promise.all(promises);
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

  return await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${c.env.ACCOUNT_ID}/storage/kv/namespaces/${c.env.WIGGLES_KV_ID}/bulk`,
    {
      method: "PUT",
      headers: {
        "X-Auth-Email": "john@pangalos.dev",
        "X-Auth-Key": c.env.API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
}

export async function deletePosts(c: WigglesContext, orderKeys: string[]) {
  const posts: Post[] = [];
  const keysToDelete: string[] = [];
  for (const key of orderKeys) {
    const feedKey = `post-feed-${key}`;

    const access = await c.get("cloudflareAccess");
    const identity: Identity | undefined = await access.JWT.getIdentity();
    if (identity === undefined) throw new Error("Identity not found");
    const accountKey = `post-account-${identity.email}-${key}`;

    const res = await c.env.WIGGLES.getWithMetadata<Post>(feedKey);
    if (res.metadata === null)
      throw new Error(`The id ${feedKey} does not exist.`);

    posts.push(res.metadata);
    keysToDelete.push(accountKey);
    keysToDelete.push(feedKey);
  }

  await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${c.env.ACCOUNT_ID}/storage/kv/namespaces/${c.env.WIGGLES_KV_ID}/bulk`,
    {
      method: "DELETE",
      headers: {
        "X-Auth-Email": "john@pangalos.dev",
        "X-Auth-Key": c.env.API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(keysToDelete),
    }
  );

  for (const post of posts) {
    await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${c.env.API_KEY}/images/v1/${post.cfImageId}`,
      {
        method: "DELETE",
        headers: {
          "X-Auth-Email": "john@pangalos.dev",
          "X-Auth-Key": c.env.API_KEY,
        },
      }
    );
  }
}
