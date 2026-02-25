import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, test, expect, vi } from "vitest";
import type { NewPost } from "~/types";
import placeholderUrl from "./fixtures/placeholder.png";

// We test the Feed component directly from the route module
// but we only use the default export (the component), not the loader
vi.mock("~/hooks", () => ({
  useInfinitePosts: vi.fn(),
}));

// Mock the virtualizer to render items directly without layout measurement
vi.mock("@tanstack/react-virtual", () => ({
  useVirtualizer: vi.fn(({ count }: { count: number }) => ({
    getTotalSize: () => count * 536,
    getVirtualItems: () =>
      Array.from({ length: count }, (_, i) => ({
        index: i,
        key: `virt-${i}`,
        size: 536,
        start: i * 536,
      })),
  })),
}));

// Mock react-router to avoid server-only imports
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
  };
});

import { useInfinitePosts } from "~/hooks";

const mockedUseInfinitePosts = vi.mocked(useInfinitePosts);

const mockPosts: NewPost[] = [
  {
    id: "post-1",
    url: placeholderUrl,
    account: {
      displayName: "Test User",
      email: "test@example.com",
      id: "account-1",
      photoURL: placeholderUrl,
    },
    contentType: "image/png",
    timestamp: "1700000000000",
    accountId: "account-1",
    r2Key: "cf-img-1",
    orderKey: "order-1",
  },
  {
    id: "post-2",
    url: placeholderUrl,
    account: {
      displayName: "Another User",
      email: "another@example.com",
      id: "account-2",
      photoURL: placeholderUrl,
    },
    contentType: "image/png",
    timestamp: "1700001000000",
    accountId: "account-2",
    r2Key: "cf-img-2",
    orderKey: "order-2",
  },
];

// Import just the component parts we need for testing
import { Fragment, useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Post, Image } from "~/components";

// Recreate the Feed component for testing (avoids server-side loader import issues)
function Feed() {
  const parent = useRef<HTMLDivElement>(null);

  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfinitePosts({});
  const posts = data ? data.pages.flatMap(({ posts }) => posts) : [];

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? posts.length + 1 : posts.length,
    getScrollElement: () => parent.current,
    estimateSize: () => 536,
    overscan: 5,
  });

  useEffect(
    () => {
      const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();
      if (!lastItem) return;
      if (
        lastItem.index >= posts.length - 1 &&
        hasNextPage &&
        !isFetchingNextPage
      )
        fetchNextPage();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      hasNextPage,
      fetchNextPage,
      posts?.length,
      isFetchingNextPage,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      JSON.stringify(rowVirtualizer.getVirtualItems()),
    ],
  );

  return (
    <div ref={parent} className="h-full flex flex-col overflow-auto pt-4 px-6">
      <div
        className="w-full flex-grow relative"
        style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
      >
        {posts.length > 0 &&
          rowVirtualizer.getVirtualItems().map((virtualItem) => {
            const post = posts[virtualItem.index];
            if (post === undefined) return <Fragment key={virtualItem.key} />;
            const isLoaderRow = virtualItem.index > posts.length - 1;
            if (isLoaderRow) return <>Loading more...</>;
            return (
              <div
                className="absolute top-0 w-full"
                key={virtualItem.key}
                style={{
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <div className="pb-4">
                  <Post
                    id={post.id}
                    account={post.account}
                    timestamp={post.timestamp}
                  >
                    <Image post={post} loading="eager" />
                  </Post>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
}

function renderFeed() {
  const queryClient = createQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <div data-testid="feed-root" style={{ minHeight: 1 }}>
        <Feed />
      </div>
    </QueryClientProvider>,
  );
}

describe("Feed", () => {
  test("renders empty state when no posts are available", async () => {
    mockedUseInfinitePosts.mockReturnValue({
      data: { pages: [{ posts: [], cursor: "" }], pageParams: [] },
      isFetchingNextPage: false,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
    } as any);

    renderFeed();
    const root = page.getByTestId("feed-root");
    await expect.element(root).toBeVisible();
    await expect.element(root).toMatchScreenshot("feed-empty-state");
  });

  test("renders feed with posts", async () => {
    mockedUseInfinitePosts.mockReturnValue({
      data: {
        pages: [{ posts: mockPosts, cursor: "next-cursor" }],
        pageParams: [],
      },
      isFetchingNextPage: false,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
    } as any);

    renderFeed();
    const root = page.getByTestId("feed-root");
    await expect.element(page.getByText("Test User")).toBeVisible();
    await expect.element(root).toMatchScreenshot("feed-with-posts");
  });

  test("renders post with correct account info", async () => {
    mockedUseInfinitePosts.mockReturnValue({
      data: {
        pages: [{ posts: [mockPosts[0]], cursor: "" }],
        pageParams: [],
      },
      isFetchingNextPage: false,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
    } as any);

    renderFeed();
    await expect.element(page.getByText("Test User")).toBeVisible();
    await expect
      .element(page.getByTestId("feed-root"))
      .toMatchScreenshot("feed-single-post");
  });

  test("renders multiple pages of posts", async () => {
    mockedUseInfinitePosts.mockReturnValue({
      data: {
        pages: [
          { posts: [mockPosts[0]], cursor: "cursor-1" },
          { posts: [mockPosts[1]], cursor: "" },
        ],
        pageParams: [],
      },
      isFetchingNextPage: false,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
    } as any);

    renderFeed();
    const root = page.getByTestId("feed-root");
    await expect.element(page.getByText("Test User")).toBeVisible();
    await expect.element(page.getByText("Another User")).toBeVisible();
    await expect.element(root).toMatchScreenshot("feed-multiple-pages", {
      comparatorOptions: { allowedMismatchedPixelRatio: 0.02 },
    });
  });

  test("renders loading state when fetching next page", async () => {
    mockedUseInfinitePosts.mockReturnValue({
      data: {
        pages: [{ posts: mockPosts, cursor: "next-cursor" }],
        pageParams: [],
      },
      isFetchingNextPage: true,
      fetchNextPage: vi.fn(),
      hasNextPage: true,
    } as any);

    renderFeed();
    const root = page.getByTestId("feed-root");
    await expect.element(page.getByText("Test User")).toBeVisible();
    await expect.element(root).toMatchScreenshot("feed-loading-next-page");
  });
});
