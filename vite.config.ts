import { defineConfig } from "vite";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig(({ mode, command }) => {
  if (command === "build") {
    if (mode === "client") {
      return {
        plugins: [cloudflare()],
        esbuild: { jsxImportSource: "hono/jsx/dom" },
        build: {
          rollupOptions: {
            input: ["./src/client/UrlBuilder.client.tsx"],
            output: { entryFileNames: "client/url-builder.js" },
          },
          outDir: "dist",
        },
      };
    }
    if (mode === "server") {
      return {
        plugins: [cloudflare()],
        build: { ssr: "src/index.ts", outDir: ".cloudflare/worker" },
        ssr: { target: "webworker" },
      };
    }
  }
  return {
    plugins: [cloudflare()],
    server: { host: "0.0.0.0" },
  };
});
