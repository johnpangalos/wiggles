import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, test, expect, vi } from "vitest";
import { Feed } from "../Feed";
import type { NewPost } from "@/types";

const mockPosts: NewPost[] = [
  {
    id: "post-1",
    url: "https://example.com/image1.jpg",
    account: {
      displayName: "Test User",
      email: "test@example.com",
      id: "account-1",
      photoURL: "https://example.com/avatar1.jpg",
    },
    contentType: "image/jpeg",
    timestamp: "1700000000000",
    accountId: "account-1",
    cfImageId: "cf-img-1",
    orderKey: "order-1",
  },
  {
    id: "post-2",
    url: "https://example.com/image2.png",
    account: {
      displayName: "Another User",
      email: "another@example.com",
      id: "account-2",
      photoURL: "https://example.com/avatar2.jpg",
    },
    contentType: "image/png",
    timestamp: "1700001000000",
    accountId: "account-2",
    cfImageId: "cf-img-2",
    orderKey: "order-2",
  },
];

vi.mock("@/hooks", () => ({
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

import { useInfinitePosts } from "@/hooks";

const mockedUseInfinitePosts = vi.mocked(useInfinitePosts);

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
    </QueryClientProvider>
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
      comparatorOptions: { maxDiffPixelRatio: 0.02 },
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
