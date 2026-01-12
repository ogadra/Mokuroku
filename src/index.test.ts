import { SELF } from "cloudflare:test";
import { describe, it, expect } from "vitest";

const HOST = "http://localhost";

describe("Mokuroku API", () => {
  describe("GET /", () => {
    it("returns Hello Mokuroku!", async () => {
      const response = await SELF.fetch(`${HOST}/`);
      expect(response.status).toBe(200);
      expect(await response.text()).toBe("Hello Mokuroku!");
    });
  });

  describe("GET /ics", () => {
    it("returns ICS calendar format", async () => {
      const response = await SELF.fetch(`${HOST}/ics`);
      expect(response.status).toBe(200);
      expect(response.headers.get("Content-Type")).toBe("text/calendar; charset=utf-8");
      const text = await response.text();
      expect(text).toContain("BEGIN:VCALENDAR");
      expect(text).toContain("END:VCALENDAR");
    });
  });

  describe("GET /event", () => {
    it("returns event list as JSON", async () => {
      const response = await SELF.fetch(`${HOST}/event`);
      expect(response.status).toBe(200);
      expect(response.headers.get("Content-Type")).toContain("application/json");
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    });
  });

  describe("GET /event/:uid", () => {
    it("returns 404 for non-existent event", async () => {
      const response = await SELF.fetch(`${HOST}/event/non-existent-uid`);
      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe("Event not found");
    });
  });
});
