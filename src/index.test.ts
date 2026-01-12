import { SELF } from "cloudflare:test";
import { describe, it, expect } from "vitest";
import { EVENT_STATUS } from "./repository/enums/eventStatus";
import { EVENT_CLASS } from "./repository/enums/eventClass";

const HOST = "http://localhost";

describe("Mokuroku API", () => {
  describe("GET /", () => {
    it("returns Hello Mokuroku!", async () => {
      const response = await SELF.fetch(`${HOST}/`);
      expect(response.status, "ステータスコードが200であること").toBe(200);
      expect(await response.text(), "レスポンス本文がHello Mokuroku!であること").toBe(
        "Hello Mokuroku!",
      );
    });
  });

  describe("GET /ics", () => {
    it("returns ICS calendar format with seeded event", async () => {
      const response = await SELF.fetch(`${HOST}/ics`);

      expect(response.status, "ステータスコードが200であること").toBe(200);
      expect(
        response.headers.get("Content-Type"),
        "Content-Typeヘッダーがtext/calendar; charset=utf-8であること",
      ).toBe("text/calendar; charset=utf-8");
      expect(
        response.headers.get("Cache-Control"),
        "Cache-Controlヘッダーがno-cache, no-store, must-revalidateであること",
      ).toBe("no-cache, no-store, must-revalidate");

      const expectedLines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Mokuroku//Speaking Schedule//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "X-WR-CALNAME:ogadra 登壇予定",
        "X-WR-TIMEZONE:Asia/Tokyo",
        "REFRESH-INTERVAL;VALUE=DURATION:PT1H",
        "X-PUBLISHED-TTL:PT1H",
        "BEGIN:VEVENT",
        "UID:test-event-1",
        "DTSTAMP:20260101T000000Z",
        "DTSTART:20260201T100000Z",
        "DTEND:20260201T120000Z",
        "SUMMARY:Test Event",
        "STATUS:CONFIRMED",
        "CLASS:PUBLIC",
        "DESCRIPTION:Test Description",
        "LOCATION:Test Location",
        "CREATED:20260101T000000Z",
        "LAST-MODIFIED:20260115T093000Z",
        "SEQUENCE:0",
        "TRANSP:TRANSPARENT",
        "END:VEVENT",
        "END:VCALENDAR",
      ];

      expect(await response.text(), "iCalレスポンス本文がすべて含まれていること").toBe(
        expectedLines.join("\r\n"),
      );
    });
  });

  describe("GET /event", () => {
    it("returns event list as JSON with seeded event", async () => {
      const response = await SELF.fetch(`${HOST}/event`);
      expect(response.status, "ステータスコードが200であること").toBe(200);
      expect(
        response.headers.get("Content-Type"),
        "Content-Typeヘッダーがapplication/jsonであること",
      ).toBe("application/json");

      expect(await response.json(), "イベント一覧が正しいこと").toStrictEqual([
        {
          uid: "test-event-1",
          dtstart: "2026-02-01T10:00:00.000Z",
          dtend: "2026-02-01T12:00:00.000Z",
          summary: "Test Event",
          description: "Test Description",
          location: "Test Location",
          status: EVENT_STATUS.CONFIRMED,
          class: EVENT_CLASS.PUBLIC,
          created: "2026-01-01T00:00:00.000Z",
          lastModified: "2026-01-15T09:30:00.000Z",
          sequence: 0,
        },
      ]);
    });
  });

  describe("GET /event/:uid", () => {
    it("returns seeded event for existing uid", async () => {
      const response = await SELF.fetch(`${HOST}/event/test-event-1`);
      expect(response.status, "ステータスコードが200であること").toBe(200);
      expect(
        response.headers.get("Content-Type"),
        "Content-Typeヘッダーがapplication/jsonであること",
      ).toBe("application/json");

      expect(await response.json(), "イベントが正しいこと").toStrictEqual({
        uid: "test-event-1",
        dtstart: "2026-02-01T10:00:00.000Z",
        dtend: "2026-02-01T12:00:00.000Z",
        summary: "Test Event",
        description: "Test Description",
        location: "Test Location",
        status: EVENT_STATUS.CONFIRMED,
        class: EVENT_CLASS.PUBLIC,
        created: "2026-01-01T00:00:00.000Z",
        lastModified: "2026-01-15T09:30:00.000Z",
        sequence: 0,
      });
    });

    it("returns 404 for non-existent event", async () => {
      const response = await SELF.fetch(`${HOST}/event/non-existent-uid`);
      expect(response.status, "ステータスコードが404であること").toBe(404);
      expect(
        response.headers.get("Content-Type"),
        "Content-Typeヘッダーがapplication/jsonであること",
      ).toBe("application/json");
      expect(await response.json(), "レスポンス本文がエラーメッセージであること").toStrictEqual({
        error: "Event not found",
      });
    });
  });
});
