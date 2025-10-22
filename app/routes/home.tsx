import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Recent Posts" },
    { name: "description", content: "Listing the 10 most recent posts" },
  ];
}

type Post = {
  id: string;
  contentType: string;
  timestamp: string;
  imageId: string | null;
  displayName: string | null;
  accountId: string | null;
}

export async function loader({ context }: Route.LoaderArgs) {
  const db = context.cloudflare.env.DB;
  const query = `
    SELECT
      posts.id,
      posts.content_type as contentType,
      posts.timestamp,
      posts.image_id as imageId,
      accounts.display_name as displayName,
      accounts.id as accountId
    FROM posts
    LEFT JOIN accounts ON accounts.id = posts.account_id
    ORDER BY posts.timestamp DESC
    LIMIT 10
  `;
  const { results } = await db.prepare(query).all<Post>();
  return { posts: results ?? [] };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const posts = loaderData.posts;

  if (posts.length === 0) {
    <p className="text-gray-600 dark:text-gray-300">No posts yet.</p>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Recent Posts</h1>
      <ul className="space-y-2">
        {posts.map((p) => (
          <li
            key={p.id}
            className="rounded border border-gray-200 dark:border-gray-700 p-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{p.displayName ?? "Unknown"}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {p.accountId}
                </div>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {p.timestamp}
              </div>
            </div>
            <div className="mt-2 text-sm">
              Content-Type: <code>{p.contentType}</code>
            </div>
            {p.imageId !== null && p.imageId !== "" && (
              <div className="mt-1 text-sm">
                Image ID: <code>{p.imageId}</code>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
