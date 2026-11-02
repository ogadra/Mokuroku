import { defineWorkersConfig, readD1Migrations } from "@cloudflare/vitest-pool-workers/config";
import { configDefaults } from "vitest/config";

export default defineWorkersConfig(async () => {
  const migrationsPath = "./src/repository/migrations";
  const migrations = await readD1Migrations(migrationsPath);

  return {
    test: {
      exclude: [...configDefaults.exclude, ".direnv/**"],
      setupFiles: ["./test/setup.ts"],
      poolOptions: {
        workers: {
          wrangler: { configPath: "./wrangler.jsonc" },
          miniflare: {
            bindings: {
              TEST_MIGRATIONS: migrations,
              API_TOKEN_HASH: "3f98e3ad578064e710ba3876cb369f9c9c29331875673bebb80efe369c17adbd",
              CONNPASS_API_TOKEN: "test-connpass-token",
            },
          },
        },
      },
    },
  };
});
