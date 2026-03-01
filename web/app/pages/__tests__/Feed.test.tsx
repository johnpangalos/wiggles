import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { describe, test, expect, vi, beforeEach } from "vitest";
import Feed from "@/routes/feed";
import type { NewPost } from "@/types";
import placeholderUrl from "./fixtures/placeholder.png";

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

vi.mock("react-router", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-router")>()),
  useLoaderData: vi.fn(),
}));

vi.mock("@/utils", () => ({
  getAuthHeaders: vi.fn(() =>
    Promise.resolve({ Authorization: "Bearer fake-token" }),
  ),
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

import { useLoaderData } from "react-router";

const mockedUseLoaderData = vi.mocked(useLoaderData);

// Mock fetch to prevent actual API calls in effects
const mockFetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ posts: [], cursor: undefined }),
  }),
);
vi.stubGlobal("fetch", mockFetch);

beforeEach(() => {
  vi.clearAllMocks();
});

function renderFeed() {
  return render(
    <section aria-label="feed" style={{ minHeight: 1 }}>
      <Feed />
    </section>,
  );
}

describe("Feed", () => {
  test("renders empty state when no posts are available", async () => {
    mockedUseLoaderData.mockReturnValue({
      posts: [],
      cursor: undefined,
    });

    renderFeed();
    const root = page.getByRole("region", { name: "feed" });
    await expect.element(root).toBeVisible();
    await expect.element(root).toMatchScreenshot("feed-empty-state");
  });

  test("renders feed with posts", async () => {
    mockedUseLoaderData.mockReturnValue({
      posts: mockPosts,
      cursor: undefined,
    });

    renderFeed();
    const root = page.getByRole("region", { name: "feed" });
    await expect.element(page.getByText("Test User")).toBeVisible();
    await expect.element(root).toMatchScreenshot("feed-with-posts");
  });

  test("renders post with correct account info", async () => {
    mockedUseLoaderData.mockReturnValue({
      posts: [mockPosts[0]],
      cursor: undefined,
    });

    renderFeed();
    await expect.element(page.getByText("Test User")).toBeVisible();
    await expect
      .element(page.getByRole("region", { name: "feed" }))
      .toMatchScreenshot("feed-single-post");
  });

  test("renders multiple posts", async () => {
    mockedUseLoaderData.mockReturnValue({
      posts: mockPosts,
      cursor: undefined,
    });

    renderFeed();
    const root = page.getByRole("region", { name: "feed" });
    await expect.element(page.getByText("Test User")).toBeVisible();
    await expect.element(page.getByText("Another User")).toBeVisible();
    await expect.element(root).toMatchScreenshot("feed-multiple-pages", {
      comparatorOptions: { allowedMismatchedPixelRatio: 0.02 },
    });
  });

  test("renders loading indicator when more pages available", async () => {
    // Make fetch hang so the loading/hasNextPage state persists
    mockFetch.mockImplementation(() => new Promise(() => {}));

    mockedUseLoaderData.mockReturnValue({
      posts: mockPosts,
      cursor: "next-cursor",
    });

    renderFeed();
    const root = page.getByRole("region", { name: "feed" });
    await expect.element(page.getByText("Test User")).toBeVisible();
    await expect.element(root).toMatchScreenshot("feed-loading-next-page");
  });
});
