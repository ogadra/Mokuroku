import { bearerAuth } from "hono/bearer-auth";
import { timingSafeEqual } from "hono/utils/buffer";
import type { AppEnv } from "../types/env";
import { hashToken } from "../utils/hash";

export const requireAuth = bearerAuth<AppEnv>({
  verifyToken: async (token, c) => {
    const hashedInput = await hashToken(token);
    return timingSafeEqual(hashedInput, c.env.API_TOKEN_HASH);
  },
});
