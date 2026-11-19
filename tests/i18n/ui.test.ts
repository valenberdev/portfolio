import { describe, expect, it } from "vitest";
import { ui } from "../../src/i18n/ui";

describe("ui dictionary", () => {
  it("has the same keys in both locales", () => {
    expect(Object.keys(ui.en).sort()).toEqual(Object.keys(ui.es).sort());
  });

  it("has no empty strings", () => {
    for (const strings of Object.values(ui)) {
      for (const value of Object.values(strings)) {
        expect(value.trim()).not.toBe("");
      }
    }
  });
});
