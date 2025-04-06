import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "public",
    emptyOutDir: true,
    rollupOptions: {
      input: "src/main.js",
      output: {
        entryFileNames: "filters.js",
      },
    },
  },
});
