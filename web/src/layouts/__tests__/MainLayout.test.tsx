import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { describe, test, expect, vi } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router";
import { MainLayout, BottomNavigation } from "../main";

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

/**
 * Renders the nav inside a compact container that simulates the layout root.
 * A red outer wrapper makes any background gaps immediately visible.
 * The gray parent (bg-gray-100) should extend below the nav — if it doesn't,
 * the red sentinel bleeds through in the screenshot.
 */
function renderNavFocused() {
  const router = createMemoryRouter(
    [{ path: "/feed", element: <BottomNavigation /> }],
    { initialEntries: ["/feed"] },
  );

  return render(
    <div
      data-testid="nav-focused-wrapper"
      style={{
        width: "375px",
        height: "160px",
        background: "red",
      }}
    >
      <div
        className="bg-gray-100"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div className="bg-white" style={{ flex: 1 }} />
        <RouterProvider router={router} />
        {/* Space below nav — should show parent's gray, not the red sentinel */}
        <div style={{ height: "40px", flexShrink: 0 }} />
      </div>
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

  test("nav background extends below navigation bar", async () => {
    renderNavFocused();

    const wrapper = page.getByTestId("nav-focused-wrapper");
    await expect.element(page.getByText("Feed")).toBeVisible();
    await expect.element(wrapper).toMatchScreenshot("layout-nav-area");
  });
});
