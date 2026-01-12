import { createMiddleware } from "hono/factory";
import { drizzle } from "drizzle-orm/d1";
import type { AppEnv } from "../types/env";

export const connectDb = createMiddleware<AppEnv>(async (c, next) => {
  c.set("db", drizzle(c.env.DB));
  await next();
});
