import { defineConfig, type Config } from "drizzle-kit";

const cfConfig = process.env.LOCAL_DB_PATH
  ? defineConfig({
      schema: "./src/repository/schema.ts",
      out: "./src/repostitory/migrations",
      dialect: "sqlite",
      dbCredentials: {
        url: process.env.LOCAL_DB_PATH,
      },
    })
  : defineConfig({
      schema: "./src/repository/schema.ts",
      out: "./src/repository/migrations",
      dialect: "sqlite",
      driver: "d1-http",
      dbCredentials: {
        accountId: process.env.CLOUDFLARE_ACCOUNT_ID ?? "",
        databaseId: process.env.CLOUDFLARE_DATABASE_ID ?? "",
        token: process.env.CLOUDFLARE_API_TOKEN ?? "",
      },
    } satisfies Config);

export default cfConfig;
