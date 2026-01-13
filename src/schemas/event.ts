import * as v from "valibot";
import { EVENT_STATUS, type EventStatusType } from "../repository/enums/eventStatus";
import { EVENT_CLASS, type EventClassType } from "../repository/enums/eventClass";
import { ATTENDEE_TYPE, type AttendeeType } from "../repository/enums/attendeeType";

const statusValues = Object.values(EVENT_STATUS) as [EventStatusType, ...EventStatusType[]];
const classValues = Object.values(EVENT_CLASS) as [EventClassType, ...EventClassType[]];
const attendeeTypeValues = Object.values(ATTENDEE_TYPE) as [AttendeeType, ...AttendeeType[]];

const iso8601WithTimezone = v.pipe(
  v.string(),
  v.regex(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}([+-]\d{2}:\d{2}|Z)$/,
    "Invalid datetime format. Expected ISO 8601 with timezone (e.g., 2026-01-01T10:00:00+09:00)",
  ),
);

export const createEventSchema = v.object({
  summary: v.string(),
  dtstart: iso8601WithTimezone,
  dtend: iso8601WithTimezone,
  description: v.string(),
  location: v.string(),
  status: v.picklist(statusValues),
  class: v.optional(v.picklist(classValues)),
  attendeeType: v.picklist(attendeeTypeValues),
});

export const updateEventSchema = v.partial(createEventSchema);
