import type { Event } from "../repository/types/events";
import { buildEventTitle } from "./eventPrefix";

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
      const title = buildEventTitle(event.summary, event.status, event.attendeeType, addRolePrefix);

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
