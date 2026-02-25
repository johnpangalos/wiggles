import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, test, expect, vi, beforeEach } from "vitest";
import type { NewPost } from "~/types";
import placeholderUrl from "./fixtures/placeholder.png";

const profileData = {
  displayName: "Test User",
  email: "test@example.com",
  id: "account-1",
  photoURL: placeholderUrl,
};

const mockPosts: NewPost[] = Array.from({ length: 6 }, (_, i) => ({
  id: `post-${i + 1}`,
  url: placeholderUrl,
  account: profileData,
  contentType: "image/png",
  timestamp: `${1700000000000 + i * 1000}`,
  accountId: "account-1",
  r2Key: `cf-img-${i + 1}`,
  orderKey: `order-${i + 1}`,
}));

vi.mock("~/hooks", () => ({
  useInfinitePosts: vi.fn(),
  infinitePostsQueryKey: vi.fn(() => [
    "posts",
    "infinite",
    30,
    "test@example.com",
  ]),
  useBreakpoint: vi.fn(() => "md"),
}));

vi.mock("@tanstack/react-virtual", () => ({
  useVirtualizer: vi.fn(({ count }: { count: number }) => ({
    getTotalSize: () => count * 200,
    getVirtualItems: () =>
      Array.from({ length: count }, (_, i) => ({
        index: i,
        key: `virt-${i}`,
        size: 200,
        start: i * 200,
      })),
    measure: vi.fn(),
  })),
}));

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useRouteLoaderData: vi.fn(() => ({
      user: {
        email: "test@example.com",
        name: "Test User",
        picture: placeholderUrl,
      },
    })),
    useFetcher: vi.fn(() => ({
      submit: vi.fn(),
      state: "idle",
      data: null,
    })),
  };
});

import { useInfinitePosts } from "~/hooks";

const mockedUseInfinitePosts = vi.mocked(useInfinitePosts);

beforeEach(() => {
  vi.clearAllMocks();
});

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
}

// Import the Profile component
// We need to import it after mocks are set up
import Profile from "../_main.profile";

function renderProfile(queryClient?: QueryClient) {
  const qc = queryClient ?? createQueryClient();
  return render(
    <QueryClientProvider client={qc}>
      <div data-testid="profile-root" style={{ minHeight: 1 }}>
        <Profile />
      </div>
    </QueryClientProvider>,
  );
}

describe("Profile", () => {
  test("renders profile with thumbnail grid", async () => {
    mockedUseInfinitePosts.mockReturnValue({
      status: "success",
      data: {
        pages: [{ posts: mockPosts, cursor: "" }],
        pageParams: [],
      },
      isFetchingNextPage: false,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
    } as any);

    renderProfile();
    await expect.element(page.getByText("Select")).toBeVisible();
    await expect.element(page.getByText("Logout")).toBeVisible();
    await expect
      .element(page.getByTestId("profile-root"))
      .toMatchScreenshot("profile-thumbnail-grid");
  });

  test("renders select mode toolbar", async () => {
    mockedUseInfinitePosts.mockReturnValue({
      status: "success",
      data: {
        pages: [{ posts: mockPosts, cursor: "" }],
        pageParams: [],
      },
      isFetchingNextPage: false,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
    } as any);

    renderProfile();
    await expect.element(page.getByText("Select")).toBeVisible();
    await page.getByText("Select").click();
    await expect
      .element(page.getByRole("button", { name: "Delete" }))
      .toBeVisible();
    await expect
      .element(page.getByRole("button", { name: "Cancel" }))
      .toBeVisible();
    await expect
      .element(page.getByTestId("profile-root"))
      .toMatchScreenshot("profile-select-mode");
  });

  test("renders empty profile with no posts", async () => {
    mockedUseInfinitePosts.mockReturnValue({
      status: "success",
      data: {
        pages: [{ posts: [], cursor: "" }],
        pageParams: [],
      },
      isFetchingNextPage: false,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
    } as any);

    renderProfile();
    await expect.element(page.getByText("Select")).toBeVisible();
    await expect
      .element(page.getByTestId("profile-root"))
      .toMatchScreenshot("profile-empty");
  });

  test("renders loading state", async () => {
    mockedUseInfinitePosts.mockReturnValue({
      status: "pending",
      data: undefined,
      isFetchingNextPage: false,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
    } as any);

    renderProfile();
    await expect
      .element(page.getByTestId("profile-root"))
      .toMatchScreenshot("profile-loading");
  });
});
