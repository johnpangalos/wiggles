import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { describe, test, expect, vi } from "vitest";
import { createMemoryRouter, Navigate, RouterProvider } from "react-router";
import type { NewPost } from "@/types";
import placeholderUrl from "@/pages/__tests__/fixtures/placeholder.png";

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
];

vi.mock("@auth0/auth0-react", () => ({
  Auth0Provider: ({ children }: { children: React.ReactNode }) => children,
  useAuth0: vi.fn(() => ({
    logout: vi.fn(),
    user: { email: "test@example.com" },
    getAccessTokenSilently: vi.fn(() => Promise.resolve("fake-token")),
    isAuthenticated: true,
    isLoading: false,
    loginWithRedirect: vi.fn(),
  })),
}));

vi.mock("@/utils", () => ({
  getAuthHeaders: vi.fn(() =>
    Promise.resolve({ Authorization: "Bearer fake-token" }),
  ),
  getUserEmail: vi.fn(() => "test@example.com"),
  setTokenAccessor: vi.fn(),
  setUserEmail: vi.fn(),
}));

vi.mock("@/hooks/useImageUpload", () => ({
  useImageUpload: vi.fn(() => vi.fn()),
}));

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

const mockFetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ posts: [], cursor: undefined }),
  }),
);
vi.stubGlobal("fetch", mockFetch);

// Import after mocks are set up
import Root from "@/root";
import RequireAuth from "@/routes/require-auth";
import { MainLayout } from "@/layouts/main";
import { Feed } from "@/pages";

function renderApp() {
  const router = createMemoryRouter(
    [
      {
        element: <Root />,
        children: [
          {
            path: "/",
            element: <MainLayout />,
            children: [
              {
                path: "feed",
                loader: () => ({ posts: mockPosts, cursor: undefined }),
                element: (
                  <RequireAuth>
                    <Feed />
                  </RequireAuth>
                ),
              },
              { index: true, element: <Navigate to="feed" /> },
            ],
          },
        ],
      },
    ],
    { initialEntries: ["/feed"] },
  );

  return render(
    <section
      aria-label="app-wrapper"
      style={{
        width: "375px",
        height: "740px",
        // Inherits body background (gray-100 from index.css) — the gap
        // below the layout should stay gray, not white.
      }}
    >
      {/* Override h-svh so the layout is 667px (mobile viewport), leaving
          a visible 73px gap below to simulate the browser chrome area */}
      {/* Target the layout root div (parent of <main>) to cap its height */}
      <style>{`div:has(> main) { height: 667px !important; }`}</style>
      <RouterProvider router={router} />
    </section>,
  );
}

describe("MainLayout", () => {
  test("layout root has gray background and content area has white background", async () => {
    renderApp();

    await expect.element(page.getByRole("main")).toBeVisible();

    const mainEl = document.querySelector("main")!;
    const rootEl = mainEl.parentElement!;

    expect(rootEl.classList.contains("bg-gray-100")).toBe(true);
    expect(mainEl.classList.contains("bg-white")).toBe(true);
  });

  test("feed page with nav renders correctly", async () => {
    renderApp();

    // Screenshot the full wrapper (740px) which includes the 73px gap below
    // the layout (667px) — simulating the browser chrome zone on mobile
    const wrapper = page.getByRole("region", { name: "app-wrapper" });
    await expect.element(page.getByText("Test User")).toBeVisible();
    await expect.element(page.getByText("Feed")).toBeVisible();
    await expect.element(wrapper).toMatchScreenshot("layout-feed-with-nav");
  });
});
