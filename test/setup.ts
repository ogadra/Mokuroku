import { env } from "cloudflare:test";
import { drizzle } from "drizzle-orm/d1";
import { beforeAll, beforeEach, vi } from "vitest";
import { events } from "../src/repository/schema";
import { EVENT_STATUS } from "../src/repository/enums/eventStatus";
import { ATTENDEE_TYPE } from "../src/repository/enums/attendeeType";

// テスト用に時刻を固定 (2026-01-01 00:00:00 UTC)
vi.useFakeTimers();
vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));

const applyMigrations = async () => {
  const statements = env.TEST_MIGRATIONS.flatMap((m) => m.queries.map((q) => env.DB.prepare(q)));
  await env.DB.batch(statements);
};

const clearDatabase = async () => {
  const db = drizzle(env.DB);
  await db.delete(events);
};

const seedDatabase = async () => {
  const db = drizzle(env.DB);
  await db.insert(events).values([
    {
      uid: "test-event-1",
      dtstart: new Date("2026-02-01T10:00:00.000Z"),
      dtend: new Date("2026-02-01T12:00:00.000Z"),
      summary: "Test Event",
      description: "Test Description",
      location: "Test Location",
      status: EVENT_STATUS.CONFIRMED,
      attendeeType: ATTENDEE_TYPE.SPEAKER,
      created: new Date("2026-01-01T00:00:00.000Z"),
      lastModified: new Date("2026-01-15T09:30:00.000Z"),
    },
    {
      uid: "test-event-2",
      dtstart: new Date("2026-03-01T14:00:00.000Z"),
      dtend: new Date("2026-03-01T16:00:00.000Z"),
      summary: "Attendee Event",
      description: "Attending as audience",
      location: "Conference Hall",
      status: EVENT_STATUS.CONFIRMED,
      attendeeType: ATTENDEE_TYPE.ATTENDEE,
      created: new Date("2026-01-01T00:00:00.000Z"),
      lastModified: new Date("2026-01-15T09:30:00.000Z"),
    },
    {
      uid: "test-event-3",
      dtstart: new Date("2026-04-01T09:00:00.000Z"),
      dtend: new Date("2026-04-01T11:00:00.000Z"),
      summary: "Tentative Speaker Event",
      description: "Tentative speaking engagement",
      location: "Online",
      status: EVENT_STATUS.TENTATIVE,
      attendeeType: ATTENDEE_TYPE.SPEAKER,
      created: new Date("2026-01-01T00:00:00.000Z"),
      lastModified: new Date("2026-01-15T09:30:00.000Z"),
    },
  ]);
};

beforeAll(async () => {
  await applyMigrations();
});

beforeEach(async () => {
  await clearDatabase();
  await seedDatabase();
});
