import { Hono } from "hono";
import type { AppEnv } from "../types/env";
import { Layout, containerClass, cardGridClass } from "../components/Layout";
import { HeroSection } from "../components/landing/HeroSection";
import { FeedCard } from "../components/landing/FeedCard";
import { UrlBuilder } from "../components/landing/UrlBuilder";
import { ParameterTable } from "../components/landing/ParameterTable";
import { ExamplesSection } from "../components/landing/ExamplesSection";

const landingRoutes = new Hono<AppEnv>();

landingRoutes.get("/", (c) => {
  const environment = c.env.ENVIRONMENT;
  return c.html(
    <Layout>
      <HeroSection />
      <main>
        <section id="feeds" class={containerClass}>
          <h2>購読する</h2>
          <div class={cardGridClass}>
            <FeedCard type="ical" />
            <FeedCard type="rss" />
          </div>
        </section>
        <UrlBuilder environment={environment} />
        <ParameterTable />
        <ExamplesSection />
      </main>
    </Layout>,
  );
});

export { landingRoutes };
