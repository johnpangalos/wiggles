import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { Upload } from "../Upload";
import { useImageUpload } from "@/hooks/useImageUpload";
import placeholderUrl from "./fixtures/placeholder.png";

vi.mock("react-router", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react-router")>()),
  useNavigate: vi.fn(() => vi.fn()),
  useFetcher: vi.fn(() => ({
    state: "idle",
    data: undefined,
    submit: vi.fn(),
  })),
}));

vi.mock("@/utils", () => ({
  getAuthHeaders: vi.fn(() =>
    Promise.resolve({ Authorization: "Bearer fake-token" }),
  ),
}));

beforeEach(() => {
  vi.clearAllMocks();
  useImageUpload.getState().reset();
});

function renderUpload(imageCount = 1) {
  const urls = Array.from({ length: imageCount }, () => placeholderUrl);
  const files = urls.map(
    () => new File([""], "test.png", { type: "image/png" }),
  );
  useImageUpload.getState().addUrls(urls);
  useImageUpload.getState().addFiles(files);

  return render(
    <div data-testid="upload-root" style={{ minHeight: 1 }}>
      <Upload />
    </div>,
  );
}

describe("Upload", () => {
  test("renders single image preview with action bar", async () => {
    renderUpload(1);
    await expect.element(page.getByText("Upload 1 Picture")).toBeVisible();
    await expect.element(page.getByText("Cancel")).toBeVisible();
    await expect
      .element(page.getByTestId("upload-root"))
      .toMatchScreenshot("upload-single-image");
  });

  test("renders multiple image previews with action bar", async () => {
    renderUpload(3);
    await expect.element(page.getByText("Upload 3 Pictures")).toBeVisible();
    await expect.element(page.getByText("Cancel")).toBeVisible();
    await expect
      .element(page.getByTestId("upload-root"))
      .toMatchScreenshot("upload-multiple-images");
  });
});
