import type { Env } from "../src/types/env";

interface D1Migration {
  name: string;
  queries: string[];
}

declare module "cloudflare:test" {
  interface ProvidedEnv extends Env {
    TEST_MIGRATIONS: D1Migration[];
  }
}
