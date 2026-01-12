import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { events } from "../repository/schema";
import type { Env } from "../types/env";

const eventRoutes = new Hono<{ Bindings: Env }>();

// GET /event - イベント一覧取得
eventRoutes.get("/", async (c) => {
  const db = drizzle(c.env.DB);
  const eventData = await db.select().from(events);
  return c.json(eventData);
});

// GET /event/:uid - 単一イベント取得
eventRoutes.get("/:uid", async (c) => {
  const db = drizzle(c.env.DB);
  const uid = c.req.param("uid");
  const event = await db.select().from(events).where(eq(events.uid, uid));
  if (event.length === 0) {
    return c.json({ error: "Event not found" }, 404);
  }
  return c.json(event[0]);
});

// POST /event - イベント作成
eventRoutes.post("/", async (c) => {
  const db = drizzle(c.env.DB);
  const body = await c.req.json();
  const result = await db
    .insert(events)
    .values({
      ...body,
      ...(body.dtstart ? { dtstart: new Date(body.dtstart) } : {}),
      ...(body.dtend ? { dtend: new Date(body.dtend) } : {}),
    })
    .returning();
  return c.json(result[0], 201);
});

// PUT /event/:uid - イベント更新
eventRoutes.put("/:uid", async (c) => {
  const db = drizzle(c.env.DB);
  const uid = c.req.param("uid");
  const body = await c.req.json();

  const result = await db
    .update(events)
    .set({
      ...body,
      ...(body.dtstart ? { dtstart: new Date(body.dtstart) } : {}),
      ...(body.dtend ? { dtend: new Date(body.dtend) } : {}),
    })
    .where(eq(events.uid, uid))
    .returning();

  if (result.length === 0) {
    return c.json({ error: "Event not found" }, 404);
  }
  return c.json(result[0]);
});

// DELETE /event/:uid - イベント削除
eventRoutes.delete("/:uid", async (c) => {
  const db = drizzle(c.env.DB);
  const uid = c.req.param("uid");
  const result = await db.delete(events).where(eq(events.uid, uid)).returning();

  if (result.length === 0) {
    return c.json({ error: "Event not found" }, 404);
  }
  return c.json({ message: "Event deleted" });
});

export { eventRoutes };
