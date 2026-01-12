import { Hono } from "hono";
import type { Env } from "./types/env";
import { eventRoutes } from "./routes/event";
import { icsRoutes } from "./routes/ics";

const app = new Hono<{ Bindings: Env }>();

app.get("/", (c) => {
  return c.text("Hello Mokuroku!");
});

app.route("/ics", icsRoutes);
app.route("/event", eventRoutes);

export default app;
