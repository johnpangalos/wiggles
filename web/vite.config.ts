import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";
import replace, { RollupReplaceOptions } from "@rollup/plugin-replace";

const replaceOptions: RollupReplaceOptions = {
  __DATE__: new Date().toISOString(),
  preventAssignment: true,
};

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Wiggle Room",
        short_name: "Wiggle Room",
        icons: [
          {
            src: "icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        theme_color: "#5d3e9d",
        start_url: "/feed?homescreen=1",
        background_color: "#ffffff",
        display: "standalone",
      },
      includeAssets: ["favicon.ico", "robots.txt", "apple-touch-icon.png"],
      // switch to "true" to enable sw on development
      devOptions: {
        enabled: true,
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html}"],
      },
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
