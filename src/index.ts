import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { events } from "./repository/schema";
import type { Event, NewEvent } from "./repository/types/events";

export interface Env {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Env }>();

function formatDateUTC(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

function generateICS(eventList: Event[]): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Mokuroku//Speaking Schedule//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:ogadra 登壇予定",
    "X-WR-TIMEZONE:Asia/Tokyo",
    "REFRESH-INTERVAL;VALUE=DURATION:PT1H",
    "X-PUBLISHED-TTL:PT1H",
  ];

  for (const event of eventList) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${event.uid}`,
      `DTSTAMP:${formatDateUTC(new Date())}`,
      `DTSTART:${formatDateUTC(event.dtstart)}`,
      `DTEND:${formatDateUTC(event.dtend)}`,
      `SUMMARY:${event.summary}`,
      `STATUS:${event.status}`,
      `CLASS:${event.class}`,
      `DESCRIPTION:${event.description}`,
      `LOCATION:${event.location}`,
      `CREATED:${formatDateUTC(event.created)}`,
      `LAST-MODIFIED:${formatDateUTC(event.lastModified)}`,
      `SEQUENCE:${event.sequence}`,
      `TRANSP:TRANSPARENT`,
      `END:VEVENT`,
    );
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

app.get("/", (c) => {
  return c.text("Hello Mokuroku!");
});

app.get("/ics", async (c) => {
  const db = drizzle(c.env.DB);
  const eventData = await db.select().from(events);
  const ics = generateICS(eventData);
  return new Response(ics, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
});

// GET /event - イベント一覧取得
app.get("/event", async (c) => {
  const db = drizzle(c.env.DB);
  const eventData = await db.select().from(events);
  return c.json(eventData);
});

// GET /event/:uid - 単一イベント取得
app.get("/event/:uid", async (c) => {
  const db = drizzle(c.env.DB);
  const uid = c.req.param("uid");
  const event = await db.select().from(events).where(eq(events.uid, uid));
  if (event.length === 0) {
    return c.json({ error: "Event not found" }, 404);
  }
  return c.json(event[0]);
});

// POST /event - イベント作成
app.post("/event", async (c) => {
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
app.put("/event/:uid", async (c) => {
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
app.delete("/event/:uid", async (c) => {
  const db = drizzle(c.env.DB);
  const uid = c.req.param("uid");
  const result = await db.delete(events).where(eq(events.uid, uid)).returning();

  if (result.length === 0) {
    return c.json({ error: "Event not found" }, 404);
  }
  return c.json({ message: "Event deleted" });
});

export default app;
