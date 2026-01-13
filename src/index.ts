import { Hono } from "hono";
import type { AppEnv } from "./types/env";
import { connectDb } from "./middleware/connectDb";
import { eventRoutes } from "./routes/event";
import { icsRoutes } from "./routes/ics";
import { rssRoutes } from "./routes/rss";

const app = new Hono<AppEnv>();

app.use("*", connectDb);

app.get("/", (c) => {
  return c.text("Hello Mokuroku!");
});

app.route("/schedule.ics", icsRoutes);
app.route("/feed.xml", rssRoutes);
app.route("/event", eventRoutes);

export default app;
