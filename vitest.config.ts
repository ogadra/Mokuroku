import { cloudflareTest, readD1Migrations } from "@cloudflare/vitest-plugin";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig(async () => {
  const migrationsPath = "./src/repository/migrations";
  const migrations = await readD1Migrations(migrationsPath);

  return {
    plugins: [
      cloudflareTest({
        wrangler: { configPath: "./wrangler.jsonc" },
        miniflare: {
          bindings: {
            TEST_MIGRATIONS: migrations,
            API_TOKEN_HASH: "3f98e3ad578064e710ba3876cb369f9c9c29331875673bebb80efe369c17adbd",
            CONNPASS_API_TOKEN: "test-connpass-token",
          },
        },
      }),
    ],
    test: {
      exclude: [...configDefaults.exclude, ".direnv/**"],
      setupFiles: ["./test/setup.ts"],
    },
  };
});
