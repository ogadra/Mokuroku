import { SELF } from "cloudflare:test";
import { describe, it, expect } from "vitest";

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
    it("returns ICS calendar format (empty events)", async () => {
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
        "END:VCALENDAR",
      ];

      expect(await response.text(), "iCalレスポンス本文がすべて含まれていること").toBe(
        expectedLines.join("\r\n"),
      );
    });
  });

  describe("GET /event", () => {
    it("returns event list as JSON (empty)", async () => {
      const response = await SELF.fetch(`${HOST}/event`);
      expect(response.status, "ステータスコードが200であること").toBe(200);
      expect(
        response.headers.get("Content-Type"),
        "Content-Typeヘッダーがapplication/jsonであること",
      ).toBe("application/json");
      expect(await response.json(), "レスポンス本文が空配列であること").toStrictEqual([]);
    });
  });

  describe("GET /event/:uid", () => {
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
