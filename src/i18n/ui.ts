import type { Locale } from "./locale";

const es = {
  "meta.title":
    "Valentino Berdini — Desarrollador fullstack orientado al backend",
  "meta.description":
    "Portfolio de Valentino Berdini, desarrollador fullstack orientado al backend: apps de punta a punta con Node.js, TypeScript, Java y PostgreSQL.",
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
  "hero.role": "Desarrollador fullstack orientado al backend",
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
  "hero.tagline":
    "Apps de punta a punta: APIs, bases de datos, testing, CI/CD e IA.",
  "about.p1":
    "Soy desarrollador fullstack orientado al backend, de Bahía Blanca, Argentina. Me formé como Full Stack Developer en Henry y hoy trabajo como freelance en el frontend de una app móvil para una clínica.",
  "about.p2":
    "En mis proyectos priorizo que cada decisión se pueda defender: SQL explícito, tests contra bases reales y documentación de por qué se hizo cada cosa. Trabajo en español e inglés (EF SET C2).",
  "about.group.backend": "Backend",
  "about.group.frontend": "Frontend",
  "about.group.testing": "Testing",
  "about.group.infra": "Infra y herramientas",
  "experience.present": "actualidad",
  "card.details": "Ver detalle",
  "contact.lead": "¿Tenés una búsqueda abierta? Escribime y te respondo.",
};

export type UiKey = keyof typeof es;
export type UiStrings = Record<UiKey, string>;

const en: UiStrings = {
  "meta.title": "Valentino Berdini — Backend-focused full stack developer",
  "meta.description":
    "Portfolio of Valentino Berdini, a backend-focused full stack developer: end-to-end apps with Node.js, TypeScript, Java and PostgreSQL.",
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
  "hero.role": "Backend-focused full stack developer",
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
  "hero.tagline": "End-to-end apps: APIs, databases, testing, CI/CD and AI.",
  "about.p1":
    "I'm a backend-focused full stack developer from Bahía Blanca, Argentina. I trained as a Full Stack Developer at Henry, and I currently work as a freelancer on the frontend of a mobile app for a clinic.",
  "about.p2":
    "In my projects, every decision has to be defensible: explicit SQL, tests against real databases and documentation of why each thing was done. I work in Spanish and English (EF SET C2).",
  "about.group.backend": "Backend",
  "about.group.frontend": "Frontend",
  "about.group.testing": "Testing",
  "about.group.infra": "Infra and tooling",
  "experience.present": "present",
  "card.details": "View details",
  "contact.lead": "Hiring? Drop me a line and I will get back to you.",
};

export const ui: Record<Locale, UiStrings> = { es, en };

export function t(locale: Locale): UiStrings {
  return ui[locale];
}
