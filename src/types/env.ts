import type { DrizzleD1Database } from "drizzle-orm/d1";

export interface Env {
  DB: D1Database;
  API_TOKEN: string;
}

export type DbVariables = {
  db: DrizzleD1Database;
};

export type AppEnv = { Bindings: Env; Variables: DbVariables };
