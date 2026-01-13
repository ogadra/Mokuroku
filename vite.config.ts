import { defineConfig } from "vite";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig(({ mode, command }) => {
  if (command === "build") {
    if (mode === "client") {
      return {
        esbuild: { jsxImportSource: "hono/jsx/dom" },
        build: {
          copyPublicDir: false,
          rollupOptions: {
            input: { "url-builder": "./src/client/UrlBuilder.client.tsx" },
            output: { entryFileNames: "[name].js" },
          },
          outDir: "src/dist/client",
        },
      };
    }
    if (mode === "server") {
      return {
        plugins: [cloudflare()],
        build: {
          ssr: "src/index.ts",
          outDir: ".cloudflare/worker",
        },
        ssr: { target: "webworker" },
      };
    }
    return {};
  }
  return {
    plugins: [cloudflare()],
    server: {
      host: "0.0.0.0",
    },
  };
});
