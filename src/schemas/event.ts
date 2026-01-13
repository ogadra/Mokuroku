import * as v from "valibot";
import { EVENT_STATUS, type EventStatusType } from "../repository/enums/eventStatus";
import { EVENT_CLASS, type EventClassType } from "../repository/enums/eventClass";
import { ATTENDEE_TYPE, type AttendeeType } from "../repository/enums/attendeeType";

const statusValues = Object.values(EVENT_STATUS) as [EventStatusType, ...EventStatusType[]];
const classValues = Object.values(EVENT_CLASS) as [EventClassType, ...EventClassType[]];
const attendeeTypeValues = Object.values(ATTENDEE_TYPE) as [AttendeeType, ...AttendeeType[]];

export const createEventSchema = v.object({
  summary: v.string(),
  dtstart: v.pipe(v.string(), v.isoTimestamp()),
  dtend: v.pipe(v.string(), v.isoTimestamp()),
  description: v.string(),
  location: v.string(),
  status: v.picklist(statusValues),
  class: v.optional(v.picklist(classValues)),
  attendeeType: v.picklist(attendeeTypeValues),
});

export const updateEventSchema = v.partial(createEventSchema);
