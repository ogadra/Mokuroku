export const ATTENDEE_TYPE = {
  SPEAKER: "SPEAKER",
  ATTENDEE: "ATTENDEE",
} as const;

export type AttendeeTypeType = (typeof ATTENDEE_TYPE)[keyof typeof ATTENDEE_TYPE];
