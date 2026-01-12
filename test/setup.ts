import { env } from "cloudflare:test";
import { beforeAll } from "vitest";

const applyMigrations = async () => {
  const statements = env.TEST_MIGRATIONS.flatMap((m) => m.queries.map((q) => env.DB.prepare(q)));
  await env.DB.batch(statements);
};

beforeAll(async () => {
  await applyMigrations();
});
