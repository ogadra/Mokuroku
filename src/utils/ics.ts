import type { Event } from "../repository/types/events";

export function formatDateUTC(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

export function generateICS(eventList: Event[]): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Mokuroku//Speaking Schedule//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:ogadra 登壇予定",
    "X-WR-TIMEZONE:Asia/Tokyo",
    "REFRESH-INTERVAL;VALUE=DURATION:PT1H",
    "X-PUBLISHED-TTL:PT1H",
  ];

  for (const event of eventList) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${event.uid}`,
      `DTSTAMP:${formatDateUTC(new Date())}`,
      `DTSTART:${formatDateUTC(event.dtstart)}`,
      `DTEND:${formatDateUTC(event.dtend)}`,
      `SUMMARY:${event.summary}`,
      `STATUS:${event.status}`,
      `CLASS:${event.class}`,
      `DESCRIPTION:${event.description}`,
      `LOCATION:${event.location}`,
      `CREATED:${formatDateUTC(event.created)}`,
      `LAST-MODIFIED:${formatDateUTC(event.lastModified)}`,
      `SEQUENCE:${event.sequence}`,
      `TRANSP:TRANSPARENT`,
      `END:VEVENT`,
    );
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}
