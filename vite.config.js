import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        fitment: "src/filters/fitmentFilter.js",
        wheel: "src/filters/wheelFilters.js",
      },
      output: {
        entryFileNames: "[name].js",
        dir: "public",
      },
    },
  },
});
