import { SELF } from "cloudflare:test";
import { describe, it, expect } from "vitest";

const HOST = "http://localhost";

describe("GET /", () => {
  it("returns Hello Mokuroku!", async () => {
    const response = await SELF.fetch(`${HOST}/`);
    expect(response.status, "ステータスコードが200であること").toBe(200);
    expect(await response.text(), "レスポンス本文がHello Mokuroku!であること").toBe(
      "Hello Mokuroku!",
    );
  });
});
