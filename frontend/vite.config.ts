import { defineConfig } from "vite";

// Library build: one ES module loaded by Home Assistant's panel_custom.
// esp-web-tools is split into a lazily loaded chunk (only needed by the installer).
export default defineConfig({
  build: {
    outDir: "../custom_components/guition_studio/www",
    emptyOutDir: true,
    target: "es2021",
    lib: {
      entry: "src/main.ts",
      formats: ["es"],
      fileName: () => "guition-studio-panel.js",
    },
    rollupOptions: {
      output: {
        chunkFileNames: "chunks/[name]-[hash].js",
      },
    },
  },
  test: {
    include: ["test/**/*.test.ts"],
  },
} as never);

