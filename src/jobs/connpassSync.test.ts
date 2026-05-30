import { env, fetchMock } from "cloudflare:test";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { beforeAll, afterEach, describe, it, expect } from "vitest";
import { syncConnpassEvents } from "./connpassSync";
import { events } from "../repository/schema";
import type { ConnpassEvent } from "../utils/connpass";
import { CONNPASS_OPEN_STATUS } from "../utils/connpass";
import { EVENT_STATUS } from "../repository/enums/eventStatus";
import { ATTENDEE_TYPE } from "../repository/enums/attendeeType";

const NOW = new Date("2026-01-01T00:00:00.000Z");

const buildEvent = (overrides: Partial<ConnpassEvent> & { id: number }): ConnpassEvent => ({
  title: `Event ${overrides.id}`,
  url: `https://example.connpass.com/event/${overrides.id}/`,
  started_at: "2026-02-01T19:00:00+09:00",
  ended_at: "2026-02-01T21:00:00+09:00",
  place: "Venue",
  address: "Tokyo",
  open_status: CONNPASS_OPEN_STATUS.OPEN,
  ...overrides,
});

const mockConnpass = (participated: ConnpassEvent[], presenter: ConnpassEvent[]) => {
  const pool = fetchMock.get("https://connpass.com");
  pool.intercept({ path: (p) => p.startsWith("/api/v2/events/"), method: "GET" }).reply(200, {
    events: participated,
    results_returned: participated.length,
    results_available: participated.length,
    results_start: 1,
  });
  pool
    .intercept({
      path: (p) => p.startsWith("/api/v2/users/ogadra/presenter_events/"),
      method: "GET",
    })
    .reply(200, {
      events: presenter,
      results_returned: presenter.length,
      results_available: presenter.length,
      results_start: 1,
    });
};

describe("syncConnpassEvents", () => {
  beforeAll(() => {
    fetchMock.activate();
    fetchMock.disableNetConnect();
  });

  afterEach(() => {
    fetchMock.assertNoPendingInterceptors();
  });

  it("新規イベントをINSERTし、presenter集合の有無でattendeeTypeを決めること", async () => {
    const db = drizzle(env.DB);
    const attendeeOnly = buildEvent({ id: 111, title: "Listener Meetup" });
    const speaking = buildEvent({ id: 222, title: "My Talk" });
    mockConnpass([attendeeOnly, speaking], [speaking]);

    await syncConnpassEvents(db, "dummy-token", NOW);

    const inserted = await db.select().from(events).where(eq(events.connpassEventId, 111));
    expect(inserted.length, "id111が1件INSERTされていること").toBe(1);
    expect(inserted[0].summary, "summaryがタイトルであること").toBe("Listener Meetup");
    expect(inserted[0].description, "descriptionがconnpassのURLであること").toBe(
      "https://example.connpass.com/event/111/",
    );
    expect(inserted[0].location, "locationが会場と住所の結合であること").toBe("Venue Tokyo");
    expect(inserted[0].status, "statusがCONFIRMEDであること").toBe(EVENT_STATUS.CONFIRMED);
    expect(inserted[0].attendeeType, "presenter外なのでATTENDEEであること").toBe(
      ATTENDEE_TYPE.ATTENDEE,
    );

    const speaker = await db.select().from(events).where(eq(events.connpassEventId, 222));
    expect(speaker[0].attendeeType, "presenterに含まれるのでSPEAKERであること").toBe(
      ATTENDEE_TYPE.SPEAKER,
    );
  });

  it("既存の同期イベントをUPDATEし、uidとcreatedを保持すること", async () => {
    const db = drizzle(env.DB);
    await db.insert(events).values({
      uid: "synced-existing",
      dtstart: new Date("2026-02-01T09:00:00.000Z"),
      dtend: new Date("2026-02-01T11:00:00.000Z"),
      summary: "Old Title",
      description: "https://example.connpass.com/event/111/",
      location: "Old Location",
      status: EVENT_STATUS.CONFIRMED,
      attendeeType: ATTENDEE_TYPE.ATTENDEE,
      connpassEventId: 111,
      created: new Date("2025-12-01T00:00:00.000Z"),
    });

    const updated = buildEvent({ id: 111, title: "New Title", place: "New Venue", address: "" });
    mockConnpass([updated], []);

    await syncConnpassEvents(db, "dummy-token", NOW);

    const rows = await db.select().from(events).where(eq(events.connpassEventId, 111));
    expect(rows.length, "id111が重複せず1件のままであること").toBe(1);
    expect(rows[0].uid, "uidが保持されていること").toBe("synced-existing");
    expect(rows[0].summary, "summaryが更新されていること").toBe("New Title");
    expect(rows[0].location, "locationが更新されていること").toBe("New Venue");
    expect(rows[0].created, "createdが保持されていること").toStrictEqual(
      new Date("2025-12-01T00:00:00.000Z"),
    );
  });

  it("取得から消えた未来の同期イベントをCANCELLEDにし、過去イベントと手動イベントは変更しないこと", async () => {
    const db = drizzle(env.DB);
    await db.insert(events).values([
      {
        uid: "synced-future-gone",
        dtstart: new Date("2026-02-15T10:00:00.000Z"),
        dtend: new Date("2026-02-15T12:00:00.000Z"),
        summary: "Future Gone",
        description: "https://example.connpass.com/event/900/",
        location: "Somewhere",
        status: EVENT_STATUS.CONFIRMED,
        attendeeType: ATTENDEE_TYPE.ATTENDEE,
        connpassEventId: 900,
      },
      {
        uid: "synced-past-gone",
        dtstart: new Date("2025-12-15T10:00:00.000Z"),
        dtend: new Date("2025-12-15T12:00:00.000Z"),
        summary: "Past Gone",
        description: "https://example.connpass.com/event/800/",
        location: "Somewhere",
        status: EVENT_STATUS.CONFIRMED,
        attendeeType: ATTENDEE_TYPE.ATTENDEE,
        connpassEventId: 800,
      },
    ]);

    mockConnpass([], []);

    await syncConnpassEvents(db, "dummy-token", NOW);

    const futureGone = await db.select().from(events).where(eq(events.uid, "synced-future-gone"));
    expect(futureGone[0].status, "消えた未来の同期イベントはCANCELLEDになること").toBe(
      EVENT_STATUS.CANCELLED,
    );

    const pastGone = await db.select().from(events).where(eq(events.uid, "synced-past-gone"));
    expect(pastGone[0].status, "過去の同期イベントは変更されないこと").toBe(EVENT_STATUS.CONFIRMED);

    const manual = await db.select().from(events).where(eq(events.uid, "test-event-2"));
    expect(manual[0].status, "手動イベントは変更されないこと").toBe(EVENT_STATUS.CONFIRMED);
    expect(manual[0].connpassEventId, "手動イベントのconnpassEventIdはnullのままであること").toBe(
      null,
    );
  });
});
