import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { describe, expect, it } from "vitest";
import type { ZodType } from "astro/zod";
import { experienceSchema, projectSchema } from "../../src/content/schemas";
import { LOCALES, type Locale } from "../../src/i18n/locale";

const CONTENT_DIR = join(process.cwd(), "src", "content");

type Entry = { slug: string; data: Record<string, unknown> };

function readEntries(collection: string, locale: Locale): Entry[] {
  const dir = join(CONTENT_DIR, collection, locale);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => ({
      slug: file.replace(/\.md$/, ""),
      data: matter(readFileSync(join(dir, file), "utf8")).data,
    }));
}

const collections: [string, ZodType, string[]][] = [
  ["projects", projectSchema, ["status", "team", "links", "order"]],
  ["experience", experienceSchema, ["start", "end", "links", "order"]],
];

describe.each(collections)("%s content", (collection, schema, sharedFields) => {
  const byLocale = Object.fromEntries(
    LOCALES.map((locale) => [locale, readEntries(collection, locale)]),
  ) as Record<Locale, Entry[]>;

  it("has content", () => {
    for (const locale of LOCALES) {
      expect(
        byLocale[locale].length,
        `no content in ${collection}/${locale}`,
      ).toBeGreaterThan(0);
    }
  });

  it("matches the schema", () => {
    for (const locale of LOCALES) {
      for (const entry of byLocale[locale]) {
        const result = schema.safeParse(entry.data);
        expect(
          result.success,
          `${collection}/${locale}/${entry.slug}: ${result.error?.message}`,
        ).toBe(true);
      }
    }
  });

  it("has the same slugs in every locale", () => {
    const slugs = LOCALES.map((locale) =>
      byLocale[locale].map((entry) => entry.slug).sort(),
    );
    for (const localeSlugs of slugs) {
      expect(localeSlugs).toEqual(slugs[0]);
    }
  });

  it("shares non-translatable fields across locales", () => {
    for (const entry of byLocale.es) {
      const twin = byLocale.en.find((other) => other.slug === entry.slug);
      for (const field of sharedFields) {
        expect(
          twin?.data[field],
          `${collection}/${entry.slug}.${field}`,
        ).toEqual(entry.data[field]);
      }
    }
  });
});
