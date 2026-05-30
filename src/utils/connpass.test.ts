import { describe, it, expect } from "vitest";
import {
  CONNPASS_OPEN_STATUS,
  type ConnpassEvent,
  determineAttendeeType,
  formatLocation,
  mapOpenStatusToStatus,
  toNewEvent,
  upcomingYms,
} from "./connpass";
import { EVENT_STATUS } from "../repository/enums/eventStatus";
import { ATTENDEE_TYPE } from "../repository/enums/attendeeType";

describe("upcomingYms", () => {
  it("当月から指定した月数先までのYYYYMM配列を返すこと", () => {
    const result = upcomingYms(new Date("2026-01-15T00:00:00.000Z"), 2);
    expect(result, "当月と向こう2か月のym配列であること").toStrictEqual([202601, 202602, 202603]);
  });

  it("年をまたぐ場合に翌年のYYYYMMへ繰り上がること", () => {
    const result = upcomingYms(new Date("2026-12-01T00:00:00.000Z"), 2);
    expect(result, "12月起点で翌年1月・2月へ繰り上がること").toStrictEqual([
      202612, 202701, 202702,
    ]);
  });
});

describe("mapOpenStatusToStatus", () => {
  it("cancelledはCANCELLEDになること", () => {
    expect(
      mapOpenStatusToStatus(CONNPASS_OPEN_STATUS.CANCELLED),
      "open_statusがcancelledならCANCELLEDであること",
    ).toBe(EVENT_STATUS.CANCELLED);
  });

  it("cancelled以外はCONFIRMEDになること", () => {
    expect(
      mapOpenStatusToStatus(CONNPASS_OPEN_STATUS.PREOPEN),
      "preopenはCONFIRMEDであること",
    ).toBe(EVENT_STATUS.CONFIRMED);
    expect(mapOpenStatusToStatus(CONNPASS_OPEN_STATUS.OPEN), "openはCONFIRMEDであること").toBe(
      EVENT_STATUS.CONFIRMED,
    );
    expect(mapOpenStatusToStatus(CONNPASS_OPEN_STATUS.CLOSE), "closeはCONFIRMEDであること").toBe(
      EVENT_STATUS.CONFIRMED,
    );
  });
});

describe("determineAttendeeType", () => {
  it("presenter集合に含まれるidはSPEAKERになること", () => {
    expect(
      determineAttendeeType(111, new Set([111, 222])),
      "発表イベントに含まれればSPEAKERであること",
    ).toBe(ATTENDEE_TYPE.SPEAKER);
  });

  it("presenter集合に含まれないidはATTENDEEになること", () => {
    expect(
      determineAttendeeType(333, new Set([111, 222])),
      "発表イベントに含まれなければATTENDEEであること",
    ).toBe(ATTENDEE_TYPE.ATTENDEE);
  });
});

describe("formatLocation", () => {
  it("会場と住所を半角スペースで結合すること", () => {
    expect(formatLocation("○○ビル 5F", "東京都千代田区1-1-1"), "会場と住所が結合されること").toBe(
      "○○ビル 5F 東京都千代田区1-1-1",
    );
  });

  it("片方が空文字なら埋まっている方だけを返すこと", () => {
    expect(formatLocation("オンライン", ""), "住所が空なら会場のみ返すこと").toBe("オンライン");
    expect(formatLocation("", "東京都千代田区1-1-1"), "会場が空なら住所のみ返すこと").toBe(
      "東京都千代田区1-1-1",
    );
  });

  it("両方が空文字なら空文字を返すこと", () => {
    expect(formatLocation("", ""), "両方空なら空文字であること").toBe("");
  });
});

describe("toNewEvent", () => {
  it("connpassイベントとattendeeTypeをDB登録用の行へ変換すること", () => {
    const event: ConnpassEvent = {
      id: 12345,
      title: "Test Conference",
      url: "https://example.connpass.com/event/12345/",
      started_at: "2026-02-01T19:00:00+09:00",
      ended_at: "2026-02-01T21:00:00+09:00",
      place: "○○ビル 5F",
      address: "東京都千代田区1-1-1",
      open_status: CONNPASS_OPEN_STATUS.OPEN,
    };

    expect(toNewEvent(event, ATTENDEE_TYPE.SPEAKER), "DB登録用の行が正しいこと").toStrictEqual({
      dtstart: new Date("2026-02-01T10:00:00.000Z"),
      dtend: new Date("2026-02-01T12:00:00.000Z"),
      summary: "Test Conference",
      description: "https://example.connpass.com/event/12345/",
      location: "○○ビル 5F 東京都千代田区1-1-1",
      status: EVENT_STATUS.CONFIRMED,
      attendeeType: ATTENDEE_TYPE.SPEAKER,
      connpassEventId: 12345,
    });
  });
});
