import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { timingSafeEqual } from "hono/utils/buffer";
import {
  findAllEvents,
  findEventByUid,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../queries/event";
import type { AppEnv } from "../types/env";
import { hashToken } from "../utils/hash";

const eventRoutes = new Hono<AppEnv>();

// POST/PUT/DELETEに認証を適用
eventRoutes.use("*", async (c, next) => {
  if (c.req.method === "GET") {
    return next();
  }
  const auth = bearerAuth({
    verifyToken: async (token) => {
      const hashedInput = await hashToken(token);
      return timingSafeEqual(hashedInput, c.env.API_TOKEN_HASH);
    },
  });
  return auth(c, next);
});

// GET /event - イベント一覧取得
eventRoutes.get("/", async (c) => {
  const eventData = await findAllEvents(c.var.db);
  return c.json(eventData);
});

// GET /event/:uid - 単一イベント取得
eventRoutes.get("/:uid", async (c) => {
  const uid = c.req.param("uid");
  const event = await findEventByUid(c.var.db, uid);
  if (!event) {
    return c.json({ error: "Event not found" }, 404);
  }
  return c.json(event);
});

// POST /event - イベント作成
eventRoutes.post("/", async (c) => {
  const body = await c.req.json();
  const result = await createEvent(c.var.db, {
    ...body,
    ...(body.dtstart ? { dtstart: new Date(body.dtstart) } : {}),
    ...(body.dtend ? { dtend: new Date(body.dtend) } : {}),
  });
  return c.json(result, 201);
});

// PUT /event/:uid - イベント更新
eventRoutes.put("/:uid", async (c) => {
  const uid = c.req.param("uid");
  const body = await c.req.json();

  const result = await updateEvent(c.var.db, uid, {
    ...body,
    ...(body.dtstart ? { dtstart: new Date(body.dtstart) } : {}),
    ...(body.dtend ? { dtend: new Date(body.dtend) } : {}),
  });

  if (!result) {
    return c.json({ error: "Event not found" }, 404);
  }
  return c.json(result);
});

// DELETE /event/:uid - イベント削除
eventRoutes.delete("/:uid", async (c) => {
  const uid = c.req.param("uid");
  const deleted = await deleteEvent(c.var.db, uid);

  if (!deleted) {
    return c.json({ error: "Event not found" }, 404);
  }
  return c.json({ message: "Event deleted" });
});

export { eventRoutes };
