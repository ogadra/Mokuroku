import { Hono } from "hono";
import { findAllEvents } from "../queries/event";
import { generateICS } from "../utils/ics";
import type { AppEnv } from "../types/env";

const icsRoutes = new Hono<AppEnv>();

icsRoutes.get("/", async (c) => {
  const eventData = await findAllEvents(c.var.db);
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
