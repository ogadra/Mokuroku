import type { Env as AppEnv } from "../src/types/env";

interface D1Migration {
  name: string;
  queries: string[];
}

declare global {
  namespace Cloudflare {
    interface Env extends AppEnv {
      TEST_MIGRATIONS: D1Migration[];
    }
  }
}
