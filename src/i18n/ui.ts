import type { Locale } from "./locale";

const es = {
  "meta.title": "Valentino Berdini — Desarrollador backend",
  "meta.description":
    "Portfolio de Valentino Berdini, desarrollador backend junior: Node.js, TypeScript, Java y PostgreSQL. Proyectos con demo y código.",
  skipLink: "Saltar al contenido",
  "nav.label": "Navegación principal",
  "nav.projects": "Proyectos",
  "nav.experience": "Experiencia",
  "nav.about": "Sobre mí",
  "nav.contact": "Contacto",
  "section.projects": "proyectos",
  "section.experience": "experiencia",
  "section.about": "sobre-mi",
  "section.contact": "contacto",
  "hero.role": "Desarrollador backend",
  "hero.cta.projects": "Ver proyectos",
  "hero.cta.cv": "Descargar CV",
  "status.live": "Demo en vivo",
  "status.codeOnly": "Solo código",
  "status.deployOnly": "Solo demo",
  "status.inProgress": "En desarrollo",
  "badge.team": "Proyecto en equipo",
  "link.demo": "Ver demo",
  "link.repo": "Ver código",
  "link.store": "Ver en Google Play",
  "detail.back": "Volver a proyectos",
  "langSwitch.label": "Ver el sitio en inglés",
  "contact.linkedin": "LinkedIn de Valentino Berdini",
  "contact.github": "GitHub de Valentino Berdini",
  "contact.email": "Enviar un email a Valentino Berdini",
  "notFound.title": "Página no encontrada",
  "notFound.back": "Volver al inicio",
};

export type UiKey = keyof typeof es;
export type UiStrings = Record<UiKey, string>;

const en: UiStrings = {
  "meta.title": "Valentino Berdini — Backend developer",
  "meta.description":
    "Portfolio of Valentino Berdini, junior backend developer: Node.js, TypeScript, Java and PostgreSQL. Projects with live demos and code.",
  skipLink: "Skip to content",
  "nav.label": "Main navigation",
  "nav.projects": "Projects",
  "nav.experience": "Experience",
  "nav.about": "About",
  "nav.contact": "Contact",
  "section.projects": "projects",
  "section.experience": "experience",
  "section.about": "about",
  "section.contact": "contact",
  "hero.role": "Backend developer",
  "hero.cta.projects": "See projects",
  "hero.cta.cv": "Download CV",
  "status.live": "Live demo",
  "status.codeOnly": "Code only",
  "status.deployOnly": "Demo only",
  "status.inProgress": "In progress",
  "badge.team": "Team project",
  "link.demo": "View demo",
  "link.repo": "View code",
  "link.store": "View on Google Play",
  "detail.back": "Back to projects",
  "langSwitch.label": "View the site in Spanish",
  "contact.linkedin": "Valentino Berdini's LinkedIn",
  "contact.github": "Valentino Berdini's GitHub",
  "contact.email": "Email Valentino Berdini",
  "notFound.title": "Page not found",
  "notFound.back": "Back to home",
};

export const ui: Record<Locale, UiStrings> = { es, en };

export function t(locale: Locale): UiStrings {
  return ui[locale];
}
