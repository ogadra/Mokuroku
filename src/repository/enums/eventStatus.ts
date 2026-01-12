export const EVENT_STATUS = {
  TENTATIVE: "TENTATIVE",
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
} as const;

export type EventStatusType = (typeof EVENT_STATUS)[keyof typeof EVENT_STATUS];
