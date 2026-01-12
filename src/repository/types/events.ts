import { events } from "../schema";

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
