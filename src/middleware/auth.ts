import { createMiddleware } from "hono/factory";
import { bearerAuth } from "hono/bearer-auth";
import { timingSafeEqual } from "hono/utils/buffer";
import type { AppEnv } from "../types/env";
import { hashToken } from "../utils/hash";

export const requireAuth = createMiddleware<AppEnv>(async (c, next) => {
  const auth = bearerAuth({
    verifyToken: async (token) => {
      const hashedInput = await hashToken(token);
      return timingSafeEqual(hashedInput, c.env.API_TOKEN_HASH);
    },
  });
  return auth(c, next);
});
