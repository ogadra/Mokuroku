import { Hono } from "hono";
import type { AppEnv } from "../types/env";
import { Layout } from "../components/Layout";
import { HeroSection } from "../components/landing/HeroSection";
import { UrlBuilder } from "../components/landing/UrlBuilder";
import { ParameterTable } from "../components/landing/ParameterTable";
import { ExamplesSection } from "../components/landing/ExamplesSection";

const landingRoutes = new Hono<AppEnv>();

landingRoutes.get("/", (c) => {
  return c.html(
    <Layout>
      <HeroSection />
      <main>
        <UrlBuilder />
        <ParameterTable />
        <ExamplesSection />
      </main>
    </Layout>,
  );
});

export { landingRoutes };
