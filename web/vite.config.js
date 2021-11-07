import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src")
    }
  },
  build: {
    target: "esnext",
    rollupOptions: {
      output: {
        manualChunks: {
          "firebase-app": ["firebase/app"],
          "firebase-firestore": ["firebase/firestore"],
          "firebase-auth": ["firebase/auth"]
        }
      }
    }
  }
});
