import { getCollection, type CollectionEntry } from "astro:content";
import type { Locale } from "../i18n/locale";

export type Project = { slug: string; entry: CollectionEntry<"projects"> };
export type Experience = { slug: string; entry: CollectionEntry<"experience"> };

function slugOf(id: string): string {
  return id.split("/").slice(1).join("/");
}

export async function getProjects(locale: Locale): Promise<Project[]> {
  const entries = await getCollection("projects", (entry) =>
    entry.id.startsWith(`${locale}/`),
  );
  return entries
    .map((entry) => ({ slug: slugOf(entry.id), entry }))
    .sort((a, b) => a.entry.data.order - b.entry.data.order);
}

export async function getExperience(locale: Locale): Promise<Experience[]> {
  const entries = await getCollection("experience", (entry) =>
    entry.id.startsWith(`${locale}/`),
  );
  return entries
    .map((entry) => ({ slug: slugOf(entry.id), entry }))
    .sort((a, b) => a.entry.data.order - b.entry.data.order);
}
