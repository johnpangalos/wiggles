import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { describe, test, expect, vi } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router";
import { MainLayout } from "../main";

vi.mock("@/hooks/useImageUpload", () => ({
  useImageUpload: vi.fn(() => vi.fn()),
}));

function renderLayout() {
  const router = createMemoryRouter(
    [
      {
        path: "/feed",
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: (
              <div style={{ padding: "16px" }}>
                <p>Short content</p>
              </div>
            ),
          },
        ],
      },
    ],
    { initialEntries: ["/feed"] },
  );

  return render(
    <div data-testid="layout-test-wrapper" style={{ width: "375px" }}>
      <RouterProvider router={router} />
    </div>,
  );
}

describe("MainLayout", () => {
  test("layout root has gray background and content area has white background", async () => {
    renderLayout();

    await expect.element(page.getByTestId("layout-root")).toBeVisible();

    const rootEl = document.querySelector('[data-testid="layout-root"]')!;
    const contentEl = document.querySelector('[data-testid="layout-content"]')!;

    // layout root should have gray background (below nav shows gray)
    expect(rootEl.classList.contains("bg-gray-100")).toBe(true);
    // content area should have white background (feed/profile stays white)
    expect(contentEl.classList.contains("bg-white")).toBe(true);
  });

  test("nav area renders with correct background", async () => {
    renderLayout();

    // Screenshot the layout-root (which has h-svh) to capture the full layout including nav
    const layoutRoot = page.getByTestId("layout-root");
    await expect.element(page.getByText("Feed")).toBeVisible();
    await expect.element(layoutRoot).toMatchScreenshot("layout-nav-area");
  });
});
