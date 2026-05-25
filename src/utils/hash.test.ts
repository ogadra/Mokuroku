import { describe, it, expect } from "vitest";
import { hashToken } from "./hash";

describe("hashToken", () => {
  it("空文字列のSHA-256ハッシュが標準値と一致すること", async () => {
    const result = await hashToken("");
    expect(result, "空文字列のSHA-256が一致すること").toBe(
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    );
  });

  it("ASCII文字列abcのSHA-256ハッシュが標準値と一致すること", async () => {
    const result = await hashToken("abc");
    expect(result, "abcのSHA-256が一致すること").toBe(
      "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
    );
  });

  it("test-api-tokenのSHA-256ハッシュがvitest.configのAPI_TOKEN_HASHと一致すること", async () => {
    const result = await hashToken("test-api-token");
    expect(result, "test-api-tokenのSHA-256が一致すること").toBe(
      "3f98e3ad578064e710ba3876cb369f9c9c29331875673bebb80efe369c17adbd",
    );
  });

  it("sample-tokenのSHA-256ハッシュが.dev.vars.sampleの値と一致すること", async () => {
    const result = await hashToken("sample-token");
    expect(result, "sample-tokenのSHA-256が一致すること").toBe(
      "0f35d0ae14518b96bd6d3fec3ca15801fd58c9e048b1ccdea11a71378f2acdc9",
    );
  });

  it("同じ入力に対して同じハッシュ値を返すこと", async () => {
    const first = await hashToken("repeatable-input");
    const second = await hashToken("repeatable-input");
    expect(first, "1回目と2回目のハッシュが一致すること").toBe(second);
  });

  it("異なる入力に対して異なるハッシュ値を返すこと", async () => {
    const a = await hashToken("token-a");
    const b = await hashToken("token-b");
    expect(a === b, "異なる入力のハッシュが等しくないこと").toBe(false);
  });

  it("64文字の小文字16進文字列を返すこと", async () => {
    const result = await hashToken("any-input");
    expect(result, "出力が64文字の小文字16進文字列であること").toMatch(/^[0-9a-f]{64}$/);
  });

  it("マルチバイト文字列が64文字の小文字16進文字列にハッシュされること", async () => {
    const result = await hashToken("こんにちは");
    expect(result, "マルチバイト出力が64文字の小文字16進文字列であること").toMatch(
      /^[0-9a-f]{64}$/,
    );
  });

  it("マルチバイト文字列と同一バイト数でないASCII文字列のハッシュが一致しないこと", async () => {
    const multibyte = await hashToken("こんにちは");
    const ascii = await hashToken("hello");
    expect(multibyte === ascii, "マルチバイトとASCIIのハッシュが等しくないこと").toBe(false);
  });

  it("マルチバイト文字列の再ハッシュで同じ値を返すこと", async () => {
    const first = await hashToken("日本語テスト");
    const second = await hashToken("日本語テスト");
    expect(first, "マルチバイトの1回目と2回目のハッシュが一致すること").toBe(second);
  });
});
