import type { Event } from "../repository/types/events";
import { ATTENDEE_TYPE } from "../repository/enums/attendeeType";
import { EVENT_STATUS } from "../repository/enums/eventStatus";

const STATUS_PREFIX: Record<string, string> = {
  [EVENT_STATUS.CONFIRMED]: "[確定]",
  [EVENT_STATUS.TENTATIVE]: "[仮]",
  [EVENT_STATUS.CANCELLED]: "[中止]",
};

const ROLE_PREFIX: Record<string, string> = {
  [ATTENDEE_TYPE.SPEAKER]: "[登壇]",
  [ATTENDEE_TYPE.ATTENDEE]: "[参加]",
};

const escapeXml = (str: string): string => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
};

const formatRFC822Date = (date: Date): string => {
  return date.toUTCString();
};

export const generateRSS = (events: Event[], addRolePrefix: boolean): string => {
  const lastBuildDate =
    events.length > 0
      ? formatRFC822Date(new Date(Math.max(...events.map((e) => e.lastModified.getTime()))))
      : formatRFC822Date(new Date(0));

  const items = events
    .map((event) => {
      const statusPrefix = STATUS_PREFIX[event.status] ?? "";
      const rolePrefix = addRolePrefix ? (ROLE_PREFIX[event.attendeeType] ?? "") : "";
      const title = `${statusPrefix}${rolePrefix}${event.summary}`;

      return `    <item>
      <title>${escapeXml(title)}</title>
      <description>${escapeXml(event.description)}</description>
      <pubDate>${formatRFC822Date(event.lastModified)}</pubDate>
      <guid>${escapeXml(event.uid)}</guid>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Mokuroku - ogadra's Schedule</title>
    <description>ogadra's speaking schedule and upcoming events</description>
    <language>ja</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
${items}
  </channel>
</rss>`;
};
