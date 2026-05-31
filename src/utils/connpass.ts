import type { NewEvent } from "../repository/types/events";
import { EVENT_STATUS, type EventStatusType } from "../repository/enums/eventStatus";
import { ATTENDEE_TYPE, type AttendeeType } from "../repository/enums/attendeeType";

/** @description Base URL of the connpass API v2 */
export const CONNPASS_API_BASE = "https://connpass.com/api/v2";

/** @description connpass nickname whose events are synced */
export const CONNPASS_NICKNAME = "ogadra";

/** @description Number of events fetched per page (connpass API maximum) */
const PAGE_SIZE = 100;

/** @description Safety cap on total fetched events to avoid runaway pagination */
const MAX_EVENTS = 1000;

/** @description Sort order for the events endpoint: 2 means by event date ascending */
const ORDER_BY_STARTED_AT = 2;

/**
 * connpass event open status
 * @see {@link https://connpass.com/about/api/v2/ connpass API v2}
 */
export const CONNPASS_OPEN_STATUS = {
  PREOPEN: "preopen",
  OPEN: "open",
  CLOSE: "close",
  CANCELLED: "cancelled",
} as const;

export type ConnpassOpenStatus = (typeof CONNPASS_OPEN_STATUS)[keyof typeof CONNPASS_OPEN_STATUS];

/** @description Subset of the connpass event object used for syncing */
export interface ConnpassEvent {
  id: number;
  title: string;
  url: string;
  started_at: string;
  ended_at: string;
  place: string | null;
  address: string | null;
  open_status: ConnpassOpenStatus;
}

interface ConnpassEventsResponse {
  events: ConnpassEvent[];
  results_returned: number;
  results_available: number;
  results_start: number;
}

/**
 * Build the list of `ym` (YYYYMM) values from the given month through `monthsAhead` later.
 * Used to limit the events endpoint to upcoming events only.
 */
export const upcomingYms = (now: Date, monthsAhead: number): number[] => {
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const yms: number[] = [];
  for (let i = 0; i <= monthsAhead; i++) {
    const date = new Date(Date.UTC(year, month + i, 1));
    yms.push(date.getUTCFullYear() * 100 + (date.getUTCMonth() + 1));
  }
  return yms;
};

/** Map a connpass open status to an internal event status. */
export const mapOpenStatusToStatus = (openStatus: ConnpassOpenStatus): EventStatusType => {
  return openStatus === CONNPASS_OPEN_STATUS.CANCELLED
    ? EVENT_STATUS.CANCELLED
    : EVENT_STATUS.CONFIRMED;
};

/** Decide the attendee type from whether the event id is in the presenter set. */
export const determineAttendeeType = (
  eventId: number,
  presenterEventIds: Set<number>,
): AttendeeType => {
  return presenterEventIds.has(eventId) ? ATTENDEE_TYPE.SPEAKER : ATTENDEE_TYPE.ATTENDEE;
};

/** Join venue and address into a single location string. */
export const formatLocation = (place: string | null, address: string | null): string => {
  return [place, address]
    .map((part) => part?.trim() ?? "")
    .filter((part) => part.length > 0)
    .join(" ");
};

/** Map a connpass event and its derived attendee type to a database event row. */
export const toNewEvent = (event: ConnpassEvent, attendeeType: AttendeeType): NewEvent => {
  return {
    dtstart: new Date(event.started_at),
    dtend: new Date(event.ended_at),
    summary: event.title,
    description: event.url,
    location: formatLocation(event.place, event.address),
    status: mapOpenStatusToStatus(event.open_status),
    attendeeType,
    connpassEventId: event.id,
  };
};

const requestEvents = async (
  apiKey: string,
  path: string,
  params: URLSearchParams,
): Promise<ConnpassEvent[]> => {
  const all: ConnpassEvent[] = [];
  let start = 1;

  while (all.length < MAX_EVENTS) {
    params.set("start", String(start));
    params.set("count", String(PAGE_SIZE));

    const response = await fetch(`${CONNPASS_API_BASE}${path}?${params.toString()}`, {
      headers: { "X-API-Key": apiKey },
    });
    if (!response.ok) {
      throw new Error(`connpass API request failed: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as ConnpassEventsResponse;
    all.push(...data.events);

    if (data.events.length < PAGE_SIZE || all.length >= data.results_available) {
      break;
    }
    start += PAGE_SIZE;
  }

  return all;
};

/** Fetch events the configured user participates in within the given months. */
export const fetchParticipatedEvents = async (
  apiKey: string,
  yms: number[],
): Promise<ConnpassEvent[]> => {
  const params = new URLSearchParams();
  params.set("nickname", CONNPASS_NICKNAME);
  params.set("order", String(ORDER_BY_STARTED_AT));
  for (const ym of yms) {
    params.append("ym", String(ym));
  }
  return requestEvents(apiKey, "/events/", params);
};

/** Fetch the set of event ids the configured user presented at. */
export const fetchPresenterEventIds = async (apiKey: string): Promise<Set<number>> => {
  const events = await requestEvents(
    apiKey,
    `/users/${CONNPASS_NICKNAME}/presenter_events/`,
    new URLSearchParams(),
  );
  return new Set(events.map((event) => event.id));
};
