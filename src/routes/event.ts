import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import * as v from "valibot";
import {
  findAllEvents,
  findEventByUid,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../queries/event";
import type { AppEnv } from "../types/env";
import { requireAuth } from "../middleware/auth";
import { createEventSchema, updateEventSchema } from "../schemas/event";

const eventRoutes = new Hono<AppEnv>();

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
    throw new HTTPException(404, { message: "Event not found" });
  }
  return c.json(event);
});

// POST /event - イベント作成
eventRoutes.post("/", requireAuth, async (c) => {
  const body = await c.req.json();
  const parsed = v.safeParse(createEventSchema, body);
  if (!parsed.success) {
    throw new HTTPException(400, { message: "Invalid request body" });
  }
  const result = await createEvent(c.var.db, {
    ...parsed.output,
    dtstart: new Date(parsed.output.dtstart),
    dtend: new Date(parsed.output.dtend),
  });
  return c.json(result, 201);
});

// PUT /event/:uid - イベント更新
eventRoutes.put("/:uid", requireAuth, async (c) => {
  const uid = c.req.param("uid");
  const body = await c.req.json();
  const parsed = v.safeParse(updateEventSchema, body);
  if (!parsed.success) {
    throw new HTTPException(400, { message: "Invalid request body" });
  }

  const { dtstart, dtend, ...rest } = parsed.output;
  const result = await updateEvent(c.var.db, uid, {
    ...rest,
    ...(dtstart ? { dtstart: new Date(dtstart) } : {}),
    ...(dtend ? { dtend: new Date(dtend) } : {}),
  });

  if (!result) {
    throw new HTTPException(404, { message: "Event not found" });
  }
  return c.json(result);
});

// DELETE /event/:uid - イベント削除
eventRoutes.delete("/:uid", requireAuth, async (c) => {
  const uid = c.req.param("uid");
  const deleted = await deleteEvent(c.var.db, uid);

  if (!deleted) {
    throw new HTTPException(404, { message: "Event not found" });
  }
  return c.json({ message: "Event deleted" });
});

export { eventRoutes };
