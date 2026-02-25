import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { Profile } from "../Profile";
import type { NewPost } from "@/types";
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

vi.mock("react-router", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-router")>()),
  useLoaderData: vi.fn(),
}));

vi.mock("@/hooks", () => ({
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

vi.mock("@/utils", () => ({
  getAuthHeaders: vi.fn(() =>
    Promise.resolve({ Authorization: "Bearer fake-token" }),
  ),
  getUserEmail: vi.fn(() => "test@example.com"),
}));

vi.mock("@auth0/auth0-react", () => ({
  useAuth0: vi.fn(() => ({
    logout: vi.fn(),
    user: { email: "test@example.com" },
    getAccessTokenSilently: vi.fn(() => Promise.resolve("fake-token")),
    isAuthenticated: true,
    isLoading: false,
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

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
}

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
    mockedUseLoaderData.mockReturnValue({
      posts: mockPosts,
      cursor: undefined,
    });

    renderProfile();
    await expect.element(page.getByText("Select")).toBeVisible();
    await expect.element(page.getByText("Logout")).toBeVisible();
    await expect
      .element(page.getByTestId("profile-root"))
      .toMatchScreenshot("profile-thumbnail-grid");
  });

  test("renders select mode toolbar", async () => {
    mockedUseLoaderData.mockReturnValue({
      posts: mockPosts,
      cursor: undefined,
    });

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
    mockedUseLoaderData.mockReturnValue({
      posts: [],
      cursor: undefined,
    });

    renderProfile();
    await expect.element(page.getByText("Select")).toBeVisible();
    await expect
      .element(page.getByTestId("profile-root"))
      .toMatchScreenshot("profile-empty");
  });

  test("renders loading indicator when more pages available", async () => {
    // Make fetch hang so the loading/hasNextPage state persists
    mockFetch.mockImplementation(() => new Promise(() => {}));

    mockedUseLoaderData.mockReturnValue({
      posts: mockPosts,
      cursor: "next-cursor",
    });

    renderProfile();
    await expect.element(page.getByText("Select")).toBeVisible();
    await expect
      .element(page.getByTestId("profile-root"))
      .toMatchScreenshot("profile-with-cursor");
  });
});
