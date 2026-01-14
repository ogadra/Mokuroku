import { defineConfig } from "vite";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [cloudflare()],
  server: {
    host: "0.0.0.0",
  },
  esbuild: { jsxImportSource: "hono/jsx/dom" },
  environments: {
    client: {
      build: {
        rollupOptions: {
          input: { "url-builder": "./src/client/UrlBuilder.client.tsx" },
          output: { entryFileNames: "assets/[name].js" },
        },
      },
    },
  },
});
