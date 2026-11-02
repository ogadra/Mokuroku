import { and, eq, gte, inArray, isNotNull, type SQL } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import * as schema from "../repository/schema";
import { events } from "../repository/schema";
import type { Event, NewEvent } from "../repository/types/events";
import type { AttendeeType } from "../repository/enums/attendeeType";
import { EVENT_STATUS, type EventStatusType } from "../repository/enums/eventStatus";

type Database = DrizzleD1Database<typeof schema>;

export const findAllEvents = async (db: Database): Promise<Event[]> => {
  return db.select().from(events);
};

export const findEventsByFilter = async (
  db: Database,
  role?: AttendeeType,
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

export const findEventByUid = async (db: Database, uid: string): Promise<Event | null> => {
  const result = await db.select().from(events).where(eq(events.uid, uid));
  return result[0] ?? null;
};

export const createEvent = async (db: Database, data: NewEvent): Promise<Event> => {
  const result = await db.insert(events).values(data).returning();
  return result[0];
};

export const updateEvent = async (
  db: Database,
  uid: string,
  data: Partial<NewEvent>,
): Promise<Event | null> => {
  const result = await db.update(events).set(data).where(eq(events.uid, uid)).returning();
  return result[0] ?? null;
};

export const deleteEvent = async (db: Database, uid: string): Promise<boolean> => {
  const result = await db.delete(events).where(eq(events.uid, uid)).returning();
  return result.length > 0;
};

export const upsertEventByConnpassId = async (db: Database, data: NewEvent): Promise<Event> => {
  const result = await db
    .insert(events)
    .values(data)
    .onConflictDoUpdate({
      target: events.connpassEventId,
      set: {
        summary: data.summary,
        dtstart: data.dtstart,
        dtend: data.dtend,
        location: data.location,
        description: data.description,
        status: data.status,
        attendeeType: data.attendeeType,
      },
    })
    .returning();
  return result[0];
};

export const findSyncedFutureEvents = async (db: Database, from: Date): Promise<Event[]> => {
  return db
    .select()
    .from(events)
    .where(and(isNotNull(events.connpassEventId), gte(events.dtstart, from)));
};

export const markEventsCancelledByUids = async (db: Database, uids: string[]): Promise<void> => {
  if (uids.length === 0) {
    return;
  }
  await db.update(events).set({ status: EVENT_STATUS.CANCELLED }).where(inArray(events.uid, uids));
};
