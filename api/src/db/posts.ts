import { Account, Post, WigglesContext } from "@/types";
import { DAY, generateSignedUrl, ImageSize, unixTime } from "@/utils";

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
} & Post;

export async function readPost(
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
  if (account === null) throw new Error("Bad post data");

  return { ...post, url, account: JSON.parse(account) };
}

type ReadPostsOptions = {
  limit: number;
  size: ImageSize;
  cursor?: string;
};

export async function readPosts(c: WigglesContext, options: ReadPostsOptions) {
  const { keys, cursor } = await c.env.WIGGLES.list<Post>({
    prefix: "post-feed",
    limit: options.limit,
    cursor: options.cursor,
  });
  const promises = [];
  for (const key of keys) {
    const post = key.metadata;
    if (post === undefined) throw new Error("Bad data");

    promises.push(readPost(c, post, options));
  }
  const posts = await Promise.all(promises);
  return { posts, cursor };
}
