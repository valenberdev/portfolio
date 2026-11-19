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
    [3, false, 0.75],
    [1, false, 0.75],
    [0.5, false, 0.5],
    [2, true, 0.5],
    [0.4, true, 0.4],
  ])("dpr %s, mobile %s -> %s", (dpr, isMobile, expected) => {
    expect(pixelRatioFor(dpr, isMobile)).toBe(expected);
  });
});
