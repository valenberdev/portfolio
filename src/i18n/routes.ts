import type { Locale } from "./locale";

const PROJECTS_SEGMENT: Record<Locale, string> = {
  es: "proyectos",
  en: "projects",
};

function isLocale(value: string | undefined): value is Locale {
  return value === "es" || value === "en";
}

export function otherLocale(locale: Locale): Locale {
  return locale === "es" ? "en" : "es";
}

export function homePath(locale: Locale): string {
  return `/${locale}/`;
}

export function projectPath(locale: Locale, slug: string): string {
  return `/${locale}/${PROJECTS_SEGMENT[locale]}/${slug}/`;
}

export function switchLocalePath(pathname: string): string {
  const [first, second, slug] = pathname.split("/").filter(Boolean);
  if (!isLocale(first)) return homePath("en");
  const target = otherLocale(first);
  if (second === PROJECTS_SEGMENT[first] && slug)
    return projectPath(target, slug);
  return homePath(target);
}
