import type { DrizzleD1Database } from "drizzle-orm/d1";
import type * as schema from "../repository/schema";

export interface Env {
  DB: D1Database;
  API_TOKEN_HASH: string;
  ASSETS: Fetcher;
  ENVIRONMENT: string;
}

export type DbVariables = {
  db: DrizzleD1Database<typeof schema>;
};

export type AppEnv = { Bindings: Env; Variables: DbVariables };
