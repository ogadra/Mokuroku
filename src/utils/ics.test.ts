import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { formatDateUTC, generateICS } from "./ics";
import { EVENT_STATUS } from "../repository/enums/eventStatus";
import { EVENT_CLASS } from "../repository/enums/eventClass";
import { ATTENDEE_TYPE } from "../repository/enums/attendeeType";
import type { Event } from "../repository/types/events";

describe("formatDateUTC", () => {
  it("UTC日時を正しくフォーマットすること", () => {
    const date = new Date("2026-01-15T09:30:00.000Z");
    expect(formatDateUTC(date), "フォーマット結果が正しいこと").toBe("20260115T093000Z");
  });

  it("月・日・時・分・秒が1桁の場合にゼロパディングすること", () => {
    const date = new Date("2026-01-05T01:02:03.000Z");
    expect(formatDateUTC(date), "ゼロパディングされていること").toBe("20260105T010203Z");
  });
});

describe("generateICS", () => {
  const baseEvent: Event = {
    uid: "test-uid",
    dtstart: new Date("2026-02-01T10:00:00.000Z"),
    dtend: new Date("2026-02-01T12:00:00.000Z"),
    summary: "Test Event",
    description: "Test Description",
    location: "Test Location",
    status: EVENT_STATUS.CONFIRMED,
    class: EVENT_CLASS.PUBLIC,
    attendeeType: ATTENDEE_TYPE.SPEAKER,
    created: new Date("2026-01-01T00:00:00.000Z"),
    lastModified: new Date("2026-01-15T09:30:00.000Z"),
    sequence: 0,
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("空のイベントリストでカレンダーヘッダーのみ出力すること", () => {
    const result = generateICS([]);
    const expected = [
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
    ].join("\r\n");
    expect(result, "カレンダーヘッダーのみ出力されること").toBe(expected);
  });

  it("CONFIRMEDステータスのイベントを正しく出力すること", () => {
    const result = generateICS([baseEvent]);
    const expected = [
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
      "UID:test-uid",
      "DTSTAMP:20260101T000000Z",
      "DTSTART:20260201T100000Z",
      "DTEND:20260201T120000Z",
      "SUMMARY:[確定] Test Event",
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
      "END:VCALENDAR",
    ].join("\r\n");
    expect(result, "CONFIRMEDイベントが正しく出力されること").toBe(expected);
  });

  it("TENTATIVEステータスのイベントに[仮]プレフィックスが付くこと", () => {
    const event: Event = { ...baseEvent, status: EVENT_STATUS.TENTATIVE };
    const result = generateICS([event]);
    expect(result, "SUMMARYに[仮]プレフィックスが付くこと").toContain("SUMMARY:[仮] Test Event");
    expect(result, "STATUSがTENTATIVEであること").toContain("STATUS:TENTATIVE");
  });

  it("CANCELLEDステータスのイベントに[中止]プレフィックスが付くこと", () => {
    const event: Event = { ...baseEvent, status: EVENT_STATUS.CANCELLED };
    const result = generateICS([event]);
    expect(result, "SUMMARYに[中止]プレフィックスが付くこと").toContain(
      "SUMMARY:[中止] Test Event",
    );
    expect(result, "STATUSがCANCELLEDであること").toContain("STATUS:CANCELLED");
  });

  it("addRolePrefix=trueでSPEAKERの場合に[登壇]プレフィックスが付くこと", () => {
    const result = generateICS([baseEvent], true);
    const expected = [
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
      "UID:test-uid",
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
      "END:VCALENDAR",
    ].join("\r\n");
    expect(result, "SPEAKERイベントに[登壇]プレフィックスが付くこと").toBe(expected);
  });

  it("addRolePrefix=trueでATTENDEEの場合に[参加]プレフィックスが付くこと", () => {
    const event: Event = { ...baseEvent, attendeeType: ATTENDEE_TYPE.ATTENDEE };
    const result = generateICS([event], true);
    expect(result, "SUMMARYに[確定][参加]プレフィックスが付くこと").toContain(
      "SUMMARY:[確定] [参加] Test Event",
    );
    expect(result, "X-ATTENDEE-TYPEがATTENDEEであること").toContain("X-ATTENDEE-TYPE:ATTENDEE");
  });

  it("addRolePrefix=falseでroleプレフィックスが付かないこと", () => {
    const result = generateICS([baseEvent], false);
    expect(result, "SUMMARYにroleプレフィックスが付かないこと").toContain(
      "SUMMARY:[確定] Test Event",
    );
    expect(result, "SUMMARYに[登壇]が含まれないこと").not.toContain("[登壇]");
  });

  it("複数イベントを正しく出力すること", () => {
    const events: Event[] = [
      baseEvent,
      {
        ...baseEvent,
        uid: "test-uid-2",
        summary: "Second Event",
        status: EVENT_STATUS.TENTATIVE,
        attendeeType: ATTENDEE_TYPE.ATTENDEE,
      },
    ];
    const result = generateICS(events, true);
    expect(result, "1つ目のイベントが含まれること").toContain("UID:test-uid");
    expect(result, "2つ目のイベントが含まれること").toContain("UID:test-uid-2");
    expect(result, "1つ目のSUMMARYが正しいこと").toContain("SUMMARY:[確定] [登壇] Test Event");
    expect(result, "2つ目のSUMMARYが正しいこと").toContain("SUMMARY:[仮] [参加] Second Event");
  });
});
