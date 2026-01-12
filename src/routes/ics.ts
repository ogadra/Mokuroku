import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { events } from "../repository/schema";
import { generateICS } from "../utils/ics";
import type { Env } from "../types/env";

const icsRoutes = new Hono<{ Bindings: Env }>();

icsRoutes.get("/", async (c) => {
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

export { icsRoutes };
