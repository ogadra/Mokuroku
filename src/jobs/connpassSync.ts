import type { DrizzleD1Database } from "drizzle-orm/d1";
import type * as schema from "../repository/schema";
import {
  findSyncedFutureEvents,
  markEventsCancelledByUids,
  upsertEventByConnpassId,
} from "../queries/event";
import {
  determineAttendeeType,
  fetchParticipatedEvents,
  fetchPresenterEventIds,
  toNewEvent,
  upcomingYms,
} from "../utils/connpass";

type Database = DrizzleD1Database<typeof schema>;

/** @description Number of months ahead of the current month to sync */
const MONTHS_AHEAD = 2;

/**
 * Sync upcoming connpass events into the events table.
 *
 * Upserts participated events keyed by connpass event id, and marks synced
 * future events that disappeared from connpass as CANCELLED. Manually created
 * events (connpass_event_id IS NULL) are never touched.
 */
export const syncConnpassEvents = async (
  db: Database,
  apiKey: string,
  now: Date,
): Promise<void> => {
  const yms = upcomingYms(now, MONTHS_AHEAD);
  const [participatedEvents, presenterEventIds] = await Promise.all([
    fetchParticipatedEvents(apiKey, yms),
    fetchPresenterEventIds(apiKey),
  ]);

  for (const event of participatedEvents) {
    const attendeeType = determineAttendeeType(event.id, presenterEventIds);
    await upsertEventByConnpassId(db, toNewEvent(event, attendeeType));
  }

  const fetchedIds = new Set(participatedEvents.map((event) => event.id));
  const syncedFutureEvents = await findSyncedFutureEvents(db, now);
  const cancelledUids = syncedFutureEvents
    .filter((event) => event.connpassEventId !== null && !fetchedIds.has(event.connpassEventId))
    .map((event) => event.uid);

  await markEventsCancelledByUids(db, cancelledUids);
};
