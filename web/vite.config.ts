import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";
import manifest from "./manifest.json";
import replace, { RollupReplaceOptions } from "@rollup/plugin-replace";

const replaceOptions: RollupReplaceOptions = {
  __DATE__: new Date().toISOString(),
  preventAssignment: true,
};

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest,
      includeAssets: ["favicon.ico", "robots.txt", "apple-touch-icon.png"],
      // switch to "true" to enable sw on development
      devOptions: {
        enabled: false,
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html}"],
      },
      filename: "prompt.js",
      strategies: "generateSW",
    }),
    // @ts-ignore
    replace(replaceOptions),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
