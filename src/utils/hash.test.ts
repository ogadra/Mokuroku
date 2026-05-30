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

  it("マルチバイト文字列がUTF-8として正しくハッシュされること", async () => {
    const result = await hashToken("こんにちは");
    expect(result, "こんにちはのSHA-256が一致すること").toBe(
      "125aeadf27b0459b8760c13a3d80912dfa8a81a68261906f60d87f4a0268646c",
    );
  });
});

describe("設定値の整合性", () => {
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
});
