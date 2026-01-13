import { generate } from "@std/uuid/v7";
import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { EVENT_STATUS, type EventStatusType } from "./enums/eventStatus";
import { EVENT_CLASS, type EventClassType } from "./enums/eventClass";
import { ATTENDEE_TYPE, type AttendeeType } from "./enums/attendeeType";

/**
 * Events table for iCalendar VEVENT components
 * @see {@link https://datatracker.ietf.org/doc/html/rfc5545#section-3.6.1 RFC5545 VEVENT}
 */
export const events = sqliteTable("events", {
  /** @description Unique identifier for the event (RFC5545 UID) */
  uid: text("uid")
    .primaryKey()
    .$defaultFn(() => generate()),

  /** @description Start date-time of the event (RFC5545 DTSTART) */
  dtstart: integer("dtstart", { mode: "timestamp" }).notNull(),

  /** @description End date-time of the event (RFC5545 DTEND) */
  dtend: integer("dtend", { mode: "timestamp" }).notNull(),

  /** @description Short summary or title (RFC5545 SUMMARY) */
  summary: text("summary").notNull(),

  /** @description Detailed description (RFC5545 DESCRIPTION) */
  description: text("description").notNull(),

  /** @description Venue or address (RFC5545 LOCATION) */
  location: text("location").notNull(),

  /** @description Event status: TENTATIVE, CONFIRMED, or CANCELLED (RFC5545 STATUS) */
  status: text("status", {
    enum: Object.values(EVENT_STATUS) as [string, ...string[]],
  })
    .$type<EventStatusType>()
    .notNull(),

  /** @description Access classification: PUBLIC, PRIVATE, or CONFIDENTIAL (RFC5545 CLASS) */
  class: text("class", {
    enum: Object.values(EVENT_CLASS) as [string, ...string[]],
  })
    .$type<EventClassType>()
    .default(EVENT_CLASS.PUBLIC)
    .notNull(),

  /** @description Participation type: SPEAKER or ATTENDEE (non-RFC5545 extension) */
  attendeeType: text("attendee_type", {
    enum: Object.values(ATTENDEE_TYPE) as [string, ...string[]],
  })
    .$type<AttendeeType>()
    .notNull(),

  /** @description Timestamp when the event was created (RFC5545 CREATED) */
  created: integer("created", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),

  /** @description Timestamp when the event was last modified (RFC5545 LAST-MODIFIED) */
  lastModified: integer("last_modified", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`),

  /** @description Revision sequence number, incremented on each update (RFC5545 SEQUENCE) */
  sequence: integer("sequence")
    .default(0)
    .notNull()
    .$onUpdate(() => sql`sequence + 1`),
});
