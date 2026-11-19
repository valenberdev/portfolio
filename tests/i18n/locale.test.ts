import { describe, expect, it } from "vitest";
import { buildLocaleRedirect, resolveLocale } from "../../src/i18n/locale";

describe("resolveLocale", () => {
  it.each([
    [null, "en"],
    [undefined, "en"],
    ["", "en"],
    ["*", "en"],
    ["es-AR,es;q=0.9,en;q=0.8", "es"],
    ["ES", "es"],
    ["es", "es"],
    ["en-US,en;q=0.9,es;q=0.8", "en"],
    ["pt-BR,es;q=0.5", "en"],
    ["en;q=0.3,es-MX;q=0.9", "es"],
    ["es;q=abc,en;q=0.5", "es"],
    ["es;q=0,en;q=0.5", "en"],
    [";;,,", "en"],
  ])("%s -> %s", (header, expected) => {
    expect(resolveLocale(header)).toBe(expected);
  });
});

describe("buildLocaleRedirect", () => {
  it("redirects to /es/ without caching", () => {
    expect(buildLocaleRedirect("es-AR")).toEqual({
      location: "/es/",
      headers: { "Cache-Control": "no-store", Vary: "Accept-Language" },
    });
  });

  it("redirects to /en/ when the header is missing", () => {
    expect(buildLocaleRedirect(null).location).toBe("/en/");
  });
});
