import type { AttendeeType } from "../repository/enums/attendeeType";
import { ATTENDEE_TYPE } from "../repository/enums/attendeeType";
import type { EventStatusType } from "../repository/enums/eventStatus";
import { EVENT_STATUS } from "../repository/enums/eventStatus";

const STATUS_PREFIX: Record<EventStatusType, string> = {
  [EVENT_STATUS.CONFIRMED]: "[確定]",
  [EVENT_STATUS.TENTATIVE]: "[仮]",
  [EVENT_STATUS.CANCELLED]: "[中止]",
};

const ROLE_PREFIX: Record<AttendeeType, string> = {
  [ATTENDEE_TYPE.SPEAKER]: "[登壇]",
  [ATTENDEE_TYPE.ATTENDEE]: "[参加]",
};

const getStatusPrefix = (status: EventStatusType): string => {
  const prefix = STATUS_PREFIX[status];
  if (prefix === undefined) {
    throw new Error(`Unknown status: ${status}`);
  }
  return prefix;
};

const getRolePrefix = (attendeeType: AttendeeType): string => {
  const prefix = ROLE_PREFIX[attendeeType];
  if (prefix === undefined) {
    throw new Error(`Unknown attendeeType: ${attendeeType}`);
  }
  return prefix;
};

export const buildEventTitle = (
  summary: string,
  status: EventStatusType,
  attendeeType: AttendeeType,
  addRolePrefix: boolean,
): string => {
  const statusPrefix = getStatusPrefix(status);
  const rolePrefix = addRolePrefix ? getRolePrefix(attendeeType) : "";
  const parts = [statusPrefix, rolePrefix, summary].filter((p) => p !== "");
  return parts.join(" ");
};
