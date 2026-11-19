export type Locale = "es" | "en";

export const LOCALES: readonly Locale[] = ["es", "en"];

type Candidate = { tag: string; q: number; index: number };

function parseQuality(params: string[]): number {
  const param = params
    .map((p) => p.trim().toLowerCase())
    .find((p) => p.startsWith("q="));
  if (param === undefined) return 1;
  const value = Number(param.slice(2));
  return Number.isFinite(value) && value >= 0 && value <= 1 ? value : 1;
}

function parseAcceptLanguage(header: string): Candidate[] {
  return header
    .split(",")
    .map((part, index) => {
      const [tag = "", ...params] = part.split(";");
      return { tag: tag.trim().toLowerCase(), q: parseQuality(params), index };
    })
    .filter((candidate) => candidate.tag !== "" && candidate.q > 0)
    .sort((a, b) => b.q - a.q || a.index - b.index);
}

export function resolveLocale(
  acceptLanguage: string | null | undefined,
): Locale {
  if (!acceptLanguage) return "en";
  const [top] = parseAcceptLanguage(acceptLanguage);
  if (top === undefined) return "en";
  return top.tag.split("-")[0] === "es" ? "es" : "en";
}

export function buildLocaleRedirect(
  acceptLanguage: string | null | undefined,
): {
  location: string;
  headers: Record<string, string>;
} {
  return {
    location: `/${resolveLocale(acceptLanguage)}/`,
    headers: { "Cache-Control": "no-store", Vary: "Accept-Language" },
  };
}
