import { and, eq, type SQL } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import { events } from "../repository/schema";
import type { Event, NewEvent } from "../repository/types/events";
import type { AttendeeTypeType } from "../repository/enums/attendeeType";
import type { EventStatusType } from "../repository/enums/eventStatus";

export const findAllEvents = async (db: DrizzleD1Database): Promise<Event[]> => {
  return db.select().from(events);
};

export const findEventsByFilter = async (
  db: DrizzleD1Database,
  role?: AttendeeTypeType,
  status?: EventStatusType,
): Promise<Event[]> => {
  const conditions: SQL[] = [];
  if (role) {
    conditions.push(eq(events.attendeeType, role));
  }
  if (status) {
    conditions.push(eq(events.status, status));
  }
  if (conditions.length === 0) {
    return db.select().from(events);
  }
  return db
    .select()
    .from(events)
    .where(and(...conditions));
};

export const findEventByUid = async (db: DrizzleD1Database, uid: string): Promise<Event | null> => {
  const result = await db.select().from(events).where(eq(events.uid, uid));
  return result[0] ?? null;
};

export const createEvent = async (db: DrizzleD1Database, data: NewEvent): Promise<Event> => {
  const result = await db.insert(events).values(data).returning();
  return result[0];
};

export const updateEvent = async (
  db: DrizzleD1Database,
  uid: string,
  data: Partial<NewEvent>,
): Promise<Event | null> => {
  const result = await db.update(events).set(data).where(eq(events.uid, uid)).returning();
  return result[0] ?? null;
};

export const deleteEvent = async (db: DrizzleD1Database, uid: string): Promise<boolean> => {
  const result = await db.delete(events).where(eq(events.uid, uid)).returning();
  return result.length > 0;
};
