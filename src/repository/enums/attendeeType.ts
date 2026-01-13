export const ATTENDEE_TYPE = {
  SPEAKER: "SPEAKER",
  ATTENDEE: "ATTENDEE",
} as const;

export type AttendeeType = (typeof ATTENDEE_TYPE)[keyof typeof ATTENDEE_TYPE];
