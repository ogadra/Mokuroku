import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./repository/schema";
import type { AppEnv, Env } from "./types/env";
import { connectDb } from "./middleware/connectDb";
import { eventRoutes } from "./routes/event";
import { icsRoutes } from "./routes/ics";
import { rssRoutes } from "./routes/rss";
import { landingRoutes } from "./routes/landing";
import { syncConnpassEvents } from "./jobs/connpassSync";

const app = new Hono<AppEnv>();

app.use("*", connectDb);

app.route("/", landingRoutes);
app.route("/schedule.ics", icsRoutes);
app.route("/feed.xml", rssRoutes);
app.route("/event", eventRoutes);

const scheduled: ExportedHandlerScheduledHandler<Env> = (_event, env, ctx) => {
  const db = drizzle(env.DB, { schema });
  ctx.waitUntil(syncConnpassEvents(db, env.CONNPASS_API_TOKEN, new Date()));
};

export default {
  fetch: app.fetch,
  scheduled,
};
