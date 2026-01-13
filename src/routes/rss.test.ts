import { SELF } from "cloudflare:test";
import { describe, it, expect } from "vitest";

const HOST = "http://localhost";

describe("GET /feed.xml", () => {
  it("フィルタ未指定時にすべてのイベントをRSS形式で返す", async () => {
    const response = await SELF.fetch(`${HOST}/feed.xml`);

    expect(response.status, "ステータスコードが200であること").toBe(200);
    expect(
      response.headers.get("Content-Type"),
      "Content-Typeヘッダーがapplication/rss+xml; charset=utf-8であること",
    ).toBe("application/rss+xml; charset=utf-8");
    expect(
      response.headers.get("Cache-Control"),
      "Cache-Controlヘッダーがno-cache, no-store, must-revalidateであること",
    ).toBe("no-cache, no-store, must-revalidate");

    const expectedRss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Mokuroku - ogadra's Schedule</title>
    <link>http://localhost</link>
    <description>ogadra's speaking schedule and upcoming events</description>
    <language>ja</language>
    <lastBuildDate>Thu, 15 Jan 2026 09:30:00 GMT</lastBuildDate>
    <item>
      <title>[確定] [登壇] Test Event</title>
      <description>Test Description</description>
      <pubDate>Thu, 15 Jan 2026 09:30:00 GMT</pubDate>
      <guid>test-event-1</guid>
    </item>
    <item>
      <title>[確定] [参加] Attendee Event</title>
      <description>Attending as audience</description>
      <pubDate>Thu, 15 Jan 2026 09:30:00 GMT</pubDate>
      <guid>test-event-2</guid>
    </item>
    <item>
      <title>[仮] [登壇] Tentative Speaker Event</title>
      <description>Tentative speaking engagement</description>
      <pubDate>Thu, 15 Jan 2026 09:30:00 GMT</pubDate>
      <guid>test-event-3</guid>
    </item>
  </channel>
</rss>`;

    expect(await response.text(), "RSSレスポンス本文が完全に一致すること").toBe(expectedRss);
  });

  it("role=speaker指定時にSPEAKERイベントのみ返し、roleプレフィックスなし", async () => {
    const response = await SELF.fetch(`${HOST}/feed.xml?role=speaker`);

    expect(response.status, "ステータスコードが200であること").toBe(200);
    const text = await response.text();
    expect(text, "test-event-1(SPEAKER)が含まれること").toContain("<guid>test-event-1</guid>");
    expect(text, "test-event-3(SPEAKER)が含まれること").toContain("<guid>test-event-3</guid>");
    expect(text, "test-event-2(ATTENDEE)が含まれないこと").not.toContain(
      "<guid>test-event-2</guid>",
    );
    expect(text, "roleプレフィックスが付かないこと").toContain("<title>[確定] Test Event</title>");
    expect(text, "roleプレフィックスが付かないこと").not.toContain("[登壇]");
  });

  it("role=attendee指定時にATTENDEEイベントのみ返し、roleプレフィックスなし", async () => {
    const response = await SELF.fetch(`${HOST}/feed.xml?role=attendee`);

    expect(response.status, "ステータスコードが200であること").toBe(200);
    const text = await response.text();
    expect(text, "test-event-2(ATTENDEE)が含まれること").toContain("<guid>test-event-2</guid>");
    expect(text, "test-event-1(SPEAKER)が含まれないこと").not.toContain(
      "<guid>test-event-1</guid>",
    );
    expect(text, "test-event-3(SPEAKER)が含まれないこと").not.toContain(
      "<guid>test-event-3</guid>",
    );
    expect(text, "roleプレフィックスが付かないこと").toContain(
      "<title>[確定] Attendee Event</title>",
    );
    expect(text, "roleプレフィックスが付かないこと").not.toContain("[参加]");
  });

  it("status=confirmed指定時にCONFIRMEDイベントのみ返し、roleプレフィックスあり", async () => {
    const response = await SELF.fetch(`${HOST}/feed.xml?status=confirmed`);

    expect(response.status, "ステータスコードが200であること").toBe(200);
    const text = await response.text();
    expect(text, "test-event-1(CONFIRMED)が含まれること").toContain("<guid>test-event-1</guid>");
    expect(text, "test-event-2(CONFIRMED)が含まれること").toContain("<guid>test-event-2</guid>");
    expect(text, "test-event-3(TENTATIVE)が含まれないこと").not.toContain(
      "<guid>test-event-3</guid>",
    );
    expect(text, "roleプレフィックスが付くこと").toContain(
      "<title>[確定] [登壇] Test Event</title>",
    );
    expect(text, "roleプレフィックスが付くこと").toContain(
      "<title>[確定] [参加] Attendee Event</title>",
    );
  });

  it("無効なroleパラメータに対して400エラーを返す", async () => {
    const response = await SELF.fetch(`${HOST}/feed.xml?role=invalid`);

    expect(response.status, "ステータスコードが400であること").toBe(400);
    expect(await response.text(), "エラーメッセージが返されること").toBe(
      "Invalid query parameters",
    );
  });

  it("無効なstatusパラメータに対して400エラーを返す", async () => {
    const response = await SELF.fetch(`${HOST}/feed.xml?status=invalid`);

    expect(response.status, "ステータスコードが400であること").toBe(400);
    expect(await response.text(), "エラーメッセージが返されること").toBe(
      "Invalid query parameters",
    );
  });

  it("条件に合致するイベントがない場合は空のフィードを返す", async () => {
    const response = await SELF.fetch(`${HOST}/feed.xml?role=attendee&status=tentative`);

    expect(response.status, "ステータスコードが200であること").toBe(200);
    const text = await response.text();
    expect(text, "itemタグが含まれないこと").not.toContain("<item>");
    expect(text, "channelタグは含まれること").toContain("<channel>");
    expect(text, "lastBuildDateが1970-01-01であること").toContain(
      "<lastBuildDate>Thu, 01 Jan 1970 00:00:00 GMT</lastBuildDate>",
    );
  });
});
