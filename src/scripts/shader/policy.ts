export type MotionEnv = { reducedMotion: boolean; webgl: boolean };

const MAX_DESKTOP_RATIO = 1.5;
const MAX_MOBILE_RATIO = 1;

export function shouldAnimate(env: MotionEnv): boolean {
  return env.webgl && !env.reducedMotion;
}

export function pixelRatioFor(dpr: number, isMobile: boolean): number {
  return Math.min(dpr, isMobile ? MAX_MOBILE_RATIO : MAX_DESKTOP_RATIO);
}
