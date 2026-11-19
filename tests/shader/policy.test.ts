import { describe, expect, it } from "vitest";
import { pixelRatioFor, shouldAnimate } from "../../src/scripts/shader/policy";

describe("shouldAnimate", () => {
  it.each([
    [{ reducedMotion: true, webgl: true }, false],
    [{ reducedMotion: false, webgl: false }, false],
    [{ reducedMotion: true, webgl: false }, false],
    [{ reducedMotion: false, webgl: true }, true],
  ])("%o -> %s", (env, expected) => {
    expect(shouldAnimate(env)).toBe(expected);
  });
});

describe("pixelRatioFor", () => {
  it.each([
    [3, false, 1.5],
    [1, false, 1],
    [2, true, 1],
    [0.5, true, 0.5],
  ])("dpr %s, mobile %s -> %s", (dpr, isMobile, expected) => {
    expect(pixelRatioFor(dpr, isMobile)).toBe(expected);
  });
});
