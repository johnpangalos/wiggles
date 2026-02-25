import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  resolve: {
    alias: {
      "~": new URL("./app", import.meta.url).pathname,
    },
  },
  optimizeDeps: {
    include: [
      "react",
      "react/jsx-dev-runtime",
      "react-dom",
      "vitest-browser-react",
      "@tanstack/react-query",
      "@tanstack/react-virtual",
      "react-router",
      "zustand",
    ],
  },
  test: {
    globals: true,
    include: ["app/**/*.test.{ts,tsx}"],
    setupFiles: ["./app/test-setup.ts"],
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: "chromium" }],
      headless: true,
      screenshotFailures: false,
    },
  },
});
