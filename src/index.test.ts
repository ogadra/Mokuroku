import { SELF } from "cloudflare:test";
import { describe, it, expect } from "vitest";

const HOST = "http://localhost";

describe("GET /", () => {
  it("returns HTML landing page", async () => {
    const response = await SELF.fetch(`${HOST}/`);
    expect(response.status, "ステータスコードが200であること").toBe(200);
    expect(response.headers.get("content-type"), "Content-Typeがtext/htmlであること").toBe(
      "text/html; charset=UTF-8",
    );
    const body = await response.text();
    expect(body, "HTMLにMokurokuタイトルが含まれること").toContain(
      "<title>Mokuroku - ogadraの登壇予定</title>",
    );
    expect(body, "HTMLに購読セクションが含まれること").toContain('id="subscribe"');
    expect(body, "HTMLにURLビルダーのルート要素が含まれること").toContain('id="url-builder-root"');
    expect(body, "HTMLにクライアントスクリプトが含まれること").toContain("url-builder");
  });
});
