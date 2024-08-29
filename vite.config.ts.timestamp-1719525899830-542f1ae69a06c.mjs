// vite.config.ts
import { defineConfig } from "file:///C:/Users/Oliver/Documents/GitHub/Tuxedo-Cupcakes/node_modules/.pnpm/vite@3.2.4_@types+node@18.11.9_sass@1.56.1/node_modules/vite/dist/node/index.js";
import solid from "file:///C:/Users/Oliver/Documents/GitHub/Tuxedo-Cupcakes/node_modules/.pnpm/solid-start@0.2.5_@solidjs+meta@0.28.2_@solidjs+router@0.5.0_solid-js@1.6.2_vite@3.2.4/node_modules/solid-start/vite/plugin.js";
var vite_config_default = defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    transformMode: {
      web: [/\.[tj]sx?$/]
    },
    setupFiles: "./scripts/setup-vitest.ts",
    // solid needs to be inline to work around
    // a resolution issue in vitest:
    deps: {
      inline: [/solid-js/]
    }
    // if you have few tests, try commenting one
    // or both out to improve performance:
    // threads: false,
    // isolate: false,
  },
  plugins: [solid()],
  build: {
    target: "esnext",
    polyfillDynamicImport: false
  },
  resolve: {
    conditions: ["development", "browser"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJjOlxcXFxVc2Vyc1xcXFxPbGl2ZXJcXFxcRG9jdW1lbnRzXFxcXEdpdEh1YlxcXFxUdXhlZG8tQ3VwY2FrZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcImM6XFxcXFVzZXJzXFxcXE9saXZlclxcXFxEb2N1bWVudHNcXFxcR2l0SHViXFxcXFR1eGVkby1DdXBjYWtlc1xcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vYzovVXNlcnMvT2xpdmVyL0RvY3VtZW50cy9HaXRIdWIvVHV4ZWRvLUN1cGNha2VzL3ZpdGUuY29uZmlnLnRzXCI7Ly8vIDxyZWZlcmVuY2UgdHlwZXM9XCJ2aXRlc3RcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSB0eXBlcz1cInZpdGUvY2xpZW50XCIgLz5cclxuXHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQgc29saWQgZnJvbSAnc29saWQtc3RhcnQvdml0ZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHRlc3Q6IHtcclxuICAgIGdsb2JhbHM6IHRydWUsXHJcbiAgICBlbnZpcm9ubWVudDogJ2pzZG9tJyxcclxuICAgIHRyYW5zZm9ybU1vZGU6IHtcclxuICAgICAgd2ViOiBbL1xcLlt0al1zeD8kL10sXHJcbiAgICB9LFxyXG4gICAgc2V0dXBGaWxlczogJy4vc2NyaXB0cy9zZXR1cC12aXRlc3QudHMnLFxyXG4gICAgLy8gc29saWQgbmVlZHMgdG8gYmUgaW5saW5lIHRvIHdvcmsgYXJvdW5kXHJcbiAgICAvLyBhIHJlc29sdXRpb24gaXNzdWUgaW4gdml0ZXN0OlxyXG4gICAgZGVwczoge1xyXG4gICAgICBpbmxpbmU6IFsvc29saWQtanMvXSxcclxuICAgIH0sXHJcbiAgICAvLyBpZiB5b3UgaGF2ZSBmZXcgdGVzdHMsIHRyeSBjb21tZW50aW5nIG9uZVxyXG4gICAgLy8gb3IgYm90aCBvdXQgdG8gaW1wcm92ZSBwZXJmb3JtYW5jZTpcclxuICAgIC8vIHRocmVhZHM6IGZhbHNlLFxyXG4gICAgLy8gaXNvbGF0ZTogZmFsc2UsXHJcbiAgfSxcclxuICBwbHVnaW5zOiBbc29saWQoKV0sXHJcbiAgYnVpbGQ6IHtcclxuICAgIHRhcmdldDogJ2VzbmV4dCcsXHJcbiAgICBwb2x5ZmlsbER5bmFtaWNJbXBvcnQ6IGZhbHNlLFxyXG4gIH0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgY29uZGl0aW9uczogWydkZXZlbG9wbWVudCcsICdicm93c2VyJ10sXHJcbiAgfSxcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFHQSxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFdBQVc7QUFFbEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsTUFBTTtBQUFBLElBQ0osU0FBUztBQUFBLElBQ1QsYUFBYTtBQUFBLElBQ2IsZUFBZTtBQUFBLE1BQ2IsS0FBSyxDQUFDLFlBQVk7QUFBQSxJQUNwQjtBQUFBLElBQ0EsWUFBWTtBQUFBO0FBQUE7QUFBQSxJQUdaLE1BQU07QUFBQSxNQUNKLFFBQVEsQ0FBQyxVQUFVO0FBQUEsSUFDckI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBS0Y7QUFBQSxFQUNBLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQixPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUix1QkFBdUI7QUFBQSxFQUN6QjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsWUFBWSxDQUFDLGVBQWUsU0FBUztBQUFBLEVBQ3ZDO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
