import { env } from "cloudflare:test";
import { describe, it, expect } from "vitest";
import { Hono } from "hono";
import { requireAuth } from "./auth";
import type { AppEnv } from "../types/env";

const HOST = "http://localhost";

const buildApp = () => {
  const calls = { nextCalled: false };
  const app = new Hono<AppEnv>();
  app.use("/protected", requireAuth);
  app.get("/protected", (c) => {
    calls.nextCalled = true;
    return c.text("ok");
  });
  return { app, calls };
};

describe("requireAuth middleware", () => {
  it("Authorizationヘッダなしで401を返しnextが呼ばれないこと", async () => {
    const { app, calls } = buildApp();
    const response = await app.request(`${HOST}/protected`, {}, env);
    expect(response.status, "ステータスコードが401であること").toBe(401);
    expect(calls.nextCalled, "nextハンドラが呼ばれていないこと").toBe(false);
  });

  it("不正なトークンで401を返しnextが呼ばれないこと", async () => {
    const { app, calls } = buildApp();
    const response = await app.request(
      `${HOST}/protected`,
      { headers: { Authorization: "Bearer invalid-token" } },
      env,
    );
    expect(response.status, "ステータスコードが401であること").toBe(401);
    expect(calls.nextCalled, "nextハンドラが呼ばれていないこと").toBe(false);
  });

  it("正しいトークンで200を返しnextが呼ばれること", async () => {
    const { app, calls } = buildApp();
    const response = await app.request(
      `${HOST}/protected`,
      { headers: { Authorization: "Bearer test-api-token" } },
      env,
    );
    expect(response.status, "ステータスコードが200であること").toBe(200);
    expect(await response.text(), "レスポンス本文がokであること").toBe("ok");
    expect(calls.nextCalled, "nextハンドラが呼ばれていること").toBe(true);
  });

  it("Bearer以外のスキームで400を返しnextが呼ばれないこと", async () => {
    const { app, calls } = buildApp();
    const response = await app.request(
      `${HOST}/protected`,
      { headers: { Authorization: "Basic dGVzdDp0ZXN0" } },
      env,
    );
    expect(response.status, "ステータスコードが400であること").toBe(400);
    expect(calls.nextCalled, "nextハンドラが呼ばれていないこと").toBe(false);
  });

  it("空のBearerトークンで400を返しnextが呼ばれないこと", async () => {
    const { app, calls } = buildApp();
    const response = await app.request(
      `${HOST}/protected`,
      { headers: { Authorization: "Bearer " } },
      env,
    );
    expect(response.status, "ステータスコードが400であること").toBe(400);
    expect(calls.nextCalled, "nextハンドラが呼ばれていないこと").toBe(false);
  });

  it("API_TOKEN_HASHが別の値の場合、正しいトークンでも401を返すこと", async () => {
    const { app, calls } = buildApp();
    const otherHashEnv = {
      ...env,
      API_TOKEN_HASH: "0f35d0ae14518b96bd6d3fec3ca15801fd58c9e048b1ccdea11a71378f2acdc9",
    };
    const response = await app.request(
      `${HOST}/protected`,
      { headers: { Authorization: "Bearer test-api-token" } },
      otherHashEnv,
    );
    expect(response.status, "ステータスコードが401であること").toBe(401);
    expect(calls.nextCalled, "nextハンドラが呼ばれていないこと").toBe(false);
  });
});
