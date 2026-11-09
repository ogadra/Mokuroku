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
} from "../utils/connpass";
import { sleep } from "../utils/sleep";

type Database = DrizzleD1Database<typeof schema>;

/**
 * @description Interval between connpass requests.
 * The documented limit of 1 request per second is not enough: connpass returned 429 for requests
 * 10 seconds apart and accepted them 13 seconds apart, so the gap keeps a margin over that.
 */
const REQUEST_INTERVAL_MS = 20_000;

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
  // connpass rejects requests sent close together, so fetch sequentially with a gap between calls
  const participatedEvents = await fetchParticipatedEvents(apiKey, now);
  await sleep(REQUEST_INTERVAL_MS);
  const presenterEventIds = await fetchPresenterEventIds(apiKey);

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
