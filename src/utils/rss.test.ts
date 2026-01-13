import { describe, it, expect } from "vitest";
import { generateRSS } from "./rss";
import { EVENT_STATUS } from "../repository/enums/eventStatus";
import { EVENT_CLASS } from "../repository/enums/eventClass";
import { ATTENDEE_TYPE } from "../repository/enums/attendeeType";
import type { Event } from "../repository/types/events";

describe("generateRSS", () => {
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

  it("空のイベントリストで空のフィードを出力すること", () => {
    const result = generateRSS([], true);
    const expected = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Mokuroku - ogadra's Schedule</title>
    <description>ogadra's speaking schedule and upcoming events</description>
    <language>ja</language>
    <lastBuildDate>Thu, 01 Jan 1970 00:00:00 GMT</lastBuildDate>

  </channel>
</rss>`;
    expect(result, "空のフィードが正しく出力されること").toBe(expected);
  });

  it("CONFIRMEDステータスのイベントを正しく出力すること", () => {
    const result = generateRSS([baseEvent], false);
    const expected = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Mokuroku - ogadra's Schedule</title>
    <description>ogadra's speaking schedule and upcoming events</description>
    <language>ja</language>
    <lastBuildDate>Thu, 15 Jan 2026 09:30:00 GMT</lastBuildDate>
    <item>
      <title>[確定]Test Event</title>
      <description>Test Description</description>
      <pubDate>Thu, 15 Jan 2026 09:30:00 GMT</pubDate>
      <guid>test-uid</guid>
    </item>
  </channel>
</rss>`;
    expect(result, "CONFIRMEDイベントが正しく出力されること").toBe(expected);
  });

  it("TENTATIVEステータスのイベントに[仮]プレフィックスが付くこと", () => {
    const event: Event = { ...baseEvent, status: EVENT_STATUS.TENTATIVE };
    const result = generateRSS([event], false);
    expect(result, "タイトルに[仮]プレフィックスが付くこと").toContain(
      "<title>[仮]Test Event</title>",
    );
  });

  it("CANCELLEDステータスのイベントに[中止]プレフィックスが付くこと", () => {
    const event: Event = { ...baseEvent, status: EVENT_STATUS.CANCELLED };
    const result = generateRSS([event], false);
    expect(result, "タイトルに[中止]プレフィックスが付くこと").toContain(
      "<title>[中止]Test Event</title>",
    );
  });

  it("addRolePrefix=trueでSPEAKERの場合に[登壇]プレフィックスが付くこと", () => {
    const result = generateRSS([baseEvent], true);
    const expected = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Mokuroku - ogadra's Schedule</title>
    <description>ogadra's speaking schedule and upcoming events</description>
    <language>ja</language>
    <lastBuildDate>Thu, 15 Jan 2026 09:30:00 GMT</lastBuildDate>
    <item>
      <title>[確定][登壇]Test Event</title>
      <description>Test Description</description>
      <pubDate>Thu, 15 Jan 2026 09:30:00 GMT</pubDate>
      <guid>test-uid</guid>
    </item>
  </channel>
</rss>`;
    expect(result, "SPEAKERイベントに[登壇]プレフィックスが付くこと").toBe(expected);
  });

  it("addRolePrefix=trueでATTENDEEの場合に[参加]プレフィックスが付くこと", () => {
    const event: Event = { ...baseEvent, attendeeType: ATTENDEE_TYPE.ATTENDEE };
    const result = generateRSS([event], true);
    expect(result, "タイトルに[確定][参加]プレフィックスが付くこと").toContain(
      "<title>[確定][参加]Test Event</title>",
    );
  });

  it("addRolePrefix=falseでroleプレフィックスが付かないこと", () => {
    const result = generateRSS([baseEvent], false);
    expect(result, "タイトルにroleプレフィックスが付かないこと").toContain(
      "<title>[確定]Test Event</title>",
    );
    expect(result, "タイトルに[登壇]が含まれないこと").not.toContain("[登壇]");
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
        lastModified: new Date("2026-01-20T12:00:00.000Z"),
      },
    ];
    const result = generateRSS(events, true);
    const expected = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Mokuroku - ogadra's Schedule</title>
    <description>ogadra's speaking schedule and upcoming events</description>
    <language>ja</language>
    <lastBuildDate>Tue, 20 Jan 2026 12:00:00 GMT</lastBuildDate>
    <item>
      <title>[確定][登壇]Test Event</title>
      <description>Test Description</description>
      <pubDate>Thu, 15 Jan 2026 09:30:00 GMT</pubDate>
      <guid>test-uid</guid>
    </item>
    <item>
      <title>[仮][参加]Second Event</title>
      <description>Test Description</description>
      <pubDate>Tue, 20 Jan 2026 12:00:00 GMT</pubDate>
      <guid>test-uid-2</guid>
    </item>
  </channel>
</rss>`;
    expect(result, "複数イベントが正しく出力されること").toBe(expected);
  });

  it("XMLエスケープが正しく行われること", () => {
    const event: Event = {
      ...baseEvent,
      summary: "Test <Event> & \"Quotes\" 'Apostrophe'",
      description: "Description with <html> & special chars",
    };
    const result = generateRSS([event], false);
    expect(result, "summaryがエスケープされていること").toContain(
      "<title>[確定]Test &lt;Event&gt; &amp; &quot;Quotes&quot; &apos;Apostrophe&apos;</title>",
    );
    expect(result, "descriptionがエスケープされていること").toContain(
      "<description>Description with &lt;html&gt; &amp; special chars</description>",
    );
  });

  it("lastBuildDateが最新のlastModifiedから取得されること", () => {
    const events: Event[] = [
      { ...baseEvent, lastModified: new Date("2026-01-10T00:00:00.000Z") },
      { ...baseEvent, uid: "uid-2", lastModified: new Date("2026-01-20T00:00:00.000Z") },
      { ...baseEvent, uid: "uid-3", lastModified: new Date("2026-01-15T00:00:00.000Z") },
    ];
    const result = generateRSS(events, false);
    expect(result, "lastBuildDateが最新のlastModifiedであること").toContain(
      "<lastBuildDate>Tue, 20 Jan 2026 00:00:00 GMT</lastBuildDate>",
    );
  });
});
