import { SELF } from "cloudflare:test";
import { describe, it, expect } from "vitest";
import { EVENT_STATUS } from "../repository/enums/eventStatus";
import { EVENT_CLASS } from "../repository/enums/eventClass";
import { ATTENDEE_TYPE } from "../repository/enums/attendeeType";

const HOST = "http://localhost";

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
        attendeeType: ATTENDEE_TYPE.SPEAKER,
        created: "2026-01-01T00:00:00.000Z",
        lastModified: "2026-01-15T09:30:00.000Z",
        sequence: 0,
      },
      {
        uid: "test-event-2",
        dtstart: "2026-03-01T14:00:00.000Z",
        dtend: "2026-03-01T16:00:00.000Z",
        summary: "Attendee Event",
        description: "Attending as audience",
        location: "Conference Hall",
        status: EVENT_STATUS.CONFIRMED,
        class: EVENT_CLASS.PUBLIC,
        attendeeType: ATTENDEE_TYPE.ATTENDEE,
        created: "2026-01-01T00:00:00.000Z",
        lastModified: "2026-01-15T09:30:00.000Z",
        sequence: 0,
      },
      {
        uid: "test-event-3",
        dtstart: "2026-04-01T09:00:00.000Z",
        dtend: "2026-04-01T11:00:00.000Z",
        summary: "Tentative Speaker Event",
        description: "Tentative speaking engagement",
        location: "Online",
        status: EVENT_STATUS.TENTATIVE,
        class: EVENT_CLASS.PUBLIC,
        attendeeType: ATTENDEE_TYPE.SPEAKER,
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
      attendeeType: ATTENDEE_TYPE.SPEAKER,
      created: "2026-01-01T00:00:00.000Z",
      lastModified: "2026-01-15T09:30:00.000Z",
      sequence: 0,
    });
  });

  it("returns 404 for non-existent event", async () => {
    const response = await SELF.fetch(`${HOST}/event/non-existent-uid`);
    expect(response.status, "ステータスコードが404であること").toBe(404);
    expect(await response.text(), "レスポンス本文がエラーメッセージであること").toBe(
      "Event not found",
    );
  });
});

describe("POST /event", () => {
  const eventBody = {
    uid: "auth-test-event",
    summary: "Auth Test Event",
    dtstart: "2026-05-01T10:00:00.000Z",
    dtend: "2026-05-01T12:00:00.000Z",
    description: "Test",
    location: "Test",
    status: EVENT_STATUS.CONFIRMED,
    class: EVENT_CLASS.PUBLIC,
    attendeeType: ATTENDEE_TYPE.SPEAKER,
  };

  it("returns 401 without authorization header", async () => {
    const response = await SELF.fetch(`${HOST}/event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventBody),
    });
    expect(response.status, "ステータスコードが401であること").toBe(401);
    expect(await response.text(), "レスポンス本文がUnauthorizedであること").toBe("Unauthorized");
  });

  it("returns 401 with invalid token", async () => {
    const response = await SELF.fetch(`${HOST}/event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer invalid-token",
      },
      body: JSON.stringify(eventBody),
    });
    expect(response.status, "ステータスコードが401であること").toBe(401);
    expect(await response.text(), "レスポンス本文がUnauthorizedであること").toBe("Unauthorized");
  });

  it("returns 201 with valid token", async () => {
    const response = await SELF.fetch(`${HOST}/event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer test-api-token",
      },
      body: JSON.stringify(eventBody),
    });
    expect(response.status, "ステータスコードが201であること").toBe(201);
  });
});

describe("PUT /event/:uid", () => {
  it("returns 200 and updated event with valid token", async () => {
    const updateBody = {
      summary: "Updated Event Title",
    };
    const response = await SELF.fetch(`${HOST}/event/test-event-1`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer test-api-token",
      },
      body: JSON.stringify(updateBody),
    });
    expect(response.status, "ステータスコードが200であること").toBe(200);
    const json = await response.json();
    expect(json.summary, "サマリーが更新されていること").toBe("Updated Event Title");
    expect(json.uid, "UIDが変更されていないこと").toBe("test-event-1");
  });

  it("returns 404 for non-existent event", async () => {
    const response = await SELF.fetch(`${HOST}/event/non-existent-uid`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer test-api-token",
      },
      body: JSON.stringify({ summary: "Test" }),
    });
    expect(response.status, "ステータスコードが404であること").toBe(404);
    expect(await response.text(), "エラーメッセージが返されること").toBe("Event not found");
  });
});

describe("DELETE /event/:uid", () => {
  it("returns 200 and deletes event with valid token", async () => {
    const response = await SELF.fetch(`${HOST}/event/test-event-2`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer test-api-token",
      },
    });
    expect(response.status, "ステータスコードが200であること").toBe(200);
    expect(await response.json(), "削除成功メッセージが返されること").toStrictEqual({
      message: "Event deleted",
    });

    const getResponse = await SELF.fetch(`${HOST}/event/test-event-2`);
    expect(getResponse.status, "削除後のGETで404が返ること").toBe(404);
  });

  it("returns 404 for non-existent event", async () => {
    const response = await SELF.fetch(`${HOST}/event/non-existent-uid`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer test-api-token",
      },
    });
    expect(response.status, "ステータスコードが404であること").toBe(404);
    expect(await response.text(), "エラーメッセージが返されること").toBe("Event not found");
  });
});
