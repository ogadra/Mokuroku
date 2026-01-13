import { Hono } from "hono";
import * as v from "valibot";
import { findEventsByFilter } from "../queries/event";
import { generateICS } from "../utils/ics";
import type { AppEnv } from "../types/env";
import { ATTENDEE_TYPE, type AttendeeTypeType } from "../repository/enums/attendeeType";
import { EVENT_STATUS, type EventStatusType } from "../repository/enums/eventStatus";

const validRoles = Object.values(ATTENDEE_TYPE).map((v) => v.toLowerCase()) as [
  string,
  ...string[],
];
const validStatuses = Object.values(EVENT_STATUS).map((v) => v.toLowerCase()) as [
  string,
  ...string[],
];

const querySchema = v.object({
  role: v.optional(v.picklist(validRoles)),
  status: v.optional(v.picklist(validStatuses)),
});

const icsRoutes = new Hono<AppEnv>();

icsRoutes.get("/", async (c) => {
  const result = v.safeParse(querySchema, {
    role: c.req.query("role"),
    status: c.req.query("status"),
  });

  if (!result.success) {
    return c.json({ error: "Invalid query parameters" }, 400);
  }

  const { role, status } = result.output;
  const attendeeType = role?.toUpperCase() as AttendeeTypeType | undefined;
  const eventStatus = status?.toUpperCase() as EventStatusType | undefined;

  const eventData = await findEventsByFilter(c.var.db, attendeeType, eventStatus);
  const ics = generateICS(eventData, role === undefined);
  return new Response(ics, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
});

export { icsRoutes };
