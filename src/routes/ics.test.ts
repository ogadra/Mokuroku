import { SELF } from "cloudflare:test";
import { describe, it, expect } from "vitest";

const HOST = "http://localhost";

describe("GET /schedule.ics", () => {
  it("フィルタ未指定時にすべてのイベントをICS形式で返す", async () => {
    const response = await SELF.fetch(`${HOST}/schedule.ics`);

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
      "SUMMARY:[確定] [登壇] Test Event",
      "STATUS:CONFIRMED",
      "CLASS:PUBLIC",
      "DESCRIPTION:Test Description",
      "LOCATION:Test Location",
      "X-ATTENDEE-TYPE:SPEAKER",
      "CREATED:20260101T000000Z",
      "LAST-MODIFIED:20260115T093000Z",
      "SEQUENCE:0",
      "TRANSP:TRANSPARENT",
      "END:VEVENT",
      "BEGIN:VEVENT",
      "UID:test-event-2",
      "DTSTAMP:20260101T000000Z",
      "DTSTART:20260301T140000Z",
      "DTEND:20260301T160000Z",
      "SUMMARY:[確定] [参加] Attendee Event",
      "STATUS:CONFIRMED",
      "CLASS:PUBLIC",
      "DESCRIPTION:Attending as audience",
      "LOCATION:Conference Hall",
      "X-ATTENDEE-TYPE:ATTENDEE",
      "CREATED:20260101T000000Z",
      "LAST-MODIFIED:20260115T093000Z",
      "SEQUENCE:0",
      "TRANSP:TRANSPARENT",
      "END:VEVENT",
      "BEGIN:VEVENT",
      "UID:test-event-3",
      "DTSTAMP:20260101T000000Z",
      "DTSTART:20260401T090000Z",
      "DTEND:20260401T110000Z",
      "SUMMARY:[仮] [登壇] Tentative Speaker Event",
      "STATUS:TENTATIVE",
      "CLASS:PUBLIC",
      "DESCRIPTION:Tentative speaking engagement",
      "LOCATION:Online",
      "X-ATTENDEE-TYPE:SPEAKER",
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

  it("role=speaker指定時にSPEAKERイベントのみ返し、roleプレフィックスなし", async () => {
    const response = await SELF.fetch(`${HOST}/schedule.ics?role=speaker`);

    expect(response.status, "ステータスコードが200であること").toBe(200);
    const text = await response.text();
    expect(text, "test-event-1(SPEAKER)が含まれること").toContain("UID:test-event-1");
    expect(text, "test-event-3(SPEAKER)が含まれること").toContain("UID:test-event-3");
    expect(text, "test-event-2(ATTENDEE)が含まれないこと").not.toContain("UID:test-event-2");
    expect(text, "SUMMARYにroleプレフィックスが付かないこと").toContain(
      "SUMMARY:[確定] Test Event",
    );
    expect(text, "SUMMARYにroleプレフィックスが付かないこと").toContain(
      "SUMMARY:[仮] Tentative Speaker Event",
    );
    expect(text, "SUMMARYにroleプレフィックスが付かないこと").not.toContain(
      "SUMMARY:[確定] [登壇]",
    );
    expect(text, "SUMMARYにroleプレフィックスが付かないこと").not.toContain("SUMMARY:[仮] [登壇]");
  });

  it("role=attendee指定時にATTENDEEイベントのみ返し、roleプレフィックスなし", async () => {
    const response = await SELF.fetch(`${HOST}/schedule.ics?role=attendee`);

    expect(response.status, "ステータスコードが200であること").toBe(200);
    const text = await response.text();
    expect(text, "test-event-2(ATTENDEE)が含まれること").toContain("UID:test-event-2");
    expect(text, "test-event-1(SPEAKER)が含まれないこと").not.toContain("UID:test-event-1");
    expect(text, "test-event-3(SPEAKER)が含まれないこと").not.toContain("UID:test-event-3");
    expect(text, "SUMMARYにroleプレフィックスが付かないこと").toContain(
      "SUMMARY:[確定] Attendee Event",
    );
    expect(text, "SUMMARYにroleプレフィックスが付かないこと").not.toContain(
      "SUMMARY:[確定] [参加]",
    );
  });

  it("status=confirmed指定時にCONFIRMEDイベントのみ返し、roleプレフィックスあり", async () => {
    const response = await SELF.fetch(`${HOST}/schedule.ics?status=confirmed`);

    expect(response.status, "ステータスコードが200であること").toBe(200);
    const text = await response.text();
    expect(text, "test-event-1(CONFIRMED)が含まれること").toContain("UID:test-event-1");
    expect(text, "test-event-2(CONFIRMED)が含まれること").toContain("UID:test-event-2");
    expect(text, "test-event-3(TENTATIVE)が含まれないこと").not.toContain("UID:test-event-3");
    expect(text, "SUMMARYに[確定][登壇]プレフィックスが付くこと").toContain(
      "SUMMARY:[確定] [登壇] Test Event",
    );
    expect(text, "SUMMARYに[確定][参加]プレフィックスが付くこと").toContain(
      "SUMMARY:[確定] [参加] Attendee Event",
    );
  });

  it("status=tentative指定時にTENTATIVEイベントのみ返し、roleプレフィックスあり", async () => {
    const response = await SELF.fetch(`${HOST}/schedule.ics?status=tentative`);

    expect(response.status, "ステータスコードが200であること").toBe(200);
    const text = await response.text();
    expect(text, "test-event-3(TENTATIVE)が含まれること").toContain("UID:test-event-3");
    expect(text, "test-event-1(CONFIRMED)が含まれないこと").not.toContain("UID:test-event-1");
    expect(text, "test-event-2(CONFIRMED)が含まれないこと").not.toContain("UID:test-event-2");
    expect(text, "SUMMARYに[仮][登壇]プレフィックスが付くこと").toContain(
      "SUMMARY:[仮] [登壇] Tentative Speaker Event",
    );
  });

  it("roleとstatusの両方を指定した時に条件に合致するイベントのみ返し、roleプレフィックスなし", async () => {
    const response = await SELF.fetch(`${HOST}/schedule.ics?role=speaker&status=confirmed`);

    expect(response.status, "ステータスコードが200であること").toBe(200);
    const text = await response.text();
    expect(text, "test-event-1(SPEAKER+CONFIRMED)が含まれること").toContain("UID:test-event-1");
    expect(text, "test-event-2(ATTENDEE+CONFIRMED)が含まれないこと").not.toContain(
      "UID:test-event-2",
    );
    expect(text, "test-event-3(SPEAKER+TENTATIVE)が含まれないこと").not.toContain(
      "UID:test-event-3",
    );
    expect(text, "SUMMARYにroleプレフィックスが付かないこと").toContain(
      "SUMMARY:[確定] Test Event",
    );
    expect(text, "SUMMARYにroleプレフィックスが付かないこと").not.toContain(
      "SUMMARY:[確定] [登壇]",
    );
  });

  it("無効なroleパラメータに対して400エラーを返す", async () => {
    const response = await SELF.fetch(`${HOST}/schedule.ics?role=invalid`);

    expect(response.status, "ステータスコードが400であること").toBe(400);
    expect(await response.text(), "エラーメッセージが返されること").toBe(
      "Invalid query parameters",
    );
  });

  it("無効なstatusパラメータに対して400エラーを返す", async () => {
    const response = await SELF.fetch(`${HOST}/schedule.ics?status=invalid`);

    expect(response.status, "ステータスコードが400であること").toBe(400);
    expect(await response.text(), "エラーメッセージが返されること").toBe(
      "Invalid query parameters",
    );
  });

  it("条件に合致するイベントがない場合は空のカレンダーを返す", async () => {
    const response = await SELF.fetch(`${HOST}/schedule.ics?role=attendee&status=tentative`);

    expect(response.status, "ステータスコードが200であること").toBe(200);
    const text = await response.text();
    expect(text, "VEVENTが含まれないこと").not.toContain("BEGIN:VEVENT");
    expect(text, "VCALENDARヘッダーは含まれること").toContain("BEGIN:VCALENDAR");
  });
});
