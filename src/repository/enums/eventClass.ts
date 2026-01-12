export const EVENT_CLASS = {
  PUBLIC: "PUBLIC",
  PRIVATE: "PRIVATE",
  CONFIDENTIAL: "CONFIDENTIAL",
} as const;

export type EventClassType = (typeof EVENT_CLASS)[keyof typeof EVENT_CLASS];
