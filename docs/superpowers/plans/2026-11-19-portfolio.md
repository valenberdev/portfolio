# Portfolio profesional — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Portfolio bilingüe ES/EN en Astro, con 7 proyectos y 1 experiencia, un hero con shader WebGL, View Transitions, y deploy en Vercel.

**Architecture:** El sitio es estático salvo `/`, que se renderiza en el servidor y redirige según `Accept-Language`. El contenido vive en Content Collections validadas con Zod (un `.md` por proyecto y por idioma). Las páginas de cada idioma son envoltorios finos sobre componentes compartidos que reciben `locale`. El movimiento usa CSS nativo y TypeScript sin framework de UI.

**Tech Stack:** Astro (última estable) + TypeScript strict, `@astrojs/vercel`, Zod (`astro/zod`), Vitest, gray-matter (solo en tests), WebGL 1 puro, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-11-19-portfolio-design.md`

## Global Constraints

- Astro en su última versión estable. Al hacer el scaffold, verificar contra la documentación oficial el nombre actual de `ClientRouter` y la ubicación de `content.config.ts`.
- TypeScript `strict`. Sin React ni ningún framework de UI: solo componentes `.astro` y scripts `.ts`.
- **Sin comentarios en el código.**
- Locales: `es` y `en`, ambos con prefijo. Rutas de detalle: `/es/proyectos/<slug>/` y `/en/projects/<slug>/`.
- Regla de idioma: si el idioma de mayor prioridad del navegador es `es*`, se va a `/es/`; cualquier otra cosa va a `/en/`.
- Solo modo oscuro. No hay foto ni teléfono en ninguna parte del sitio.
- Contacto: `https://www.linkedin.com/in/valenberdini/`, `https://github.com/valenberdev`, `mailto:vaberdini@gmail.com`, como íconos con `aria-label`.
- Todo movimiento se desactiva con `prefers-reduced-motion: reduce`.
- Meta: Lighthouse mobile con rendimiento ≥ 90 y accesibilidad ≥ 90.
- Los tests van en `tests/`, en la raíz, fuera de `src/`.
- Commits: una línea, prefijo convencional (`feat:`, `fix:`, `docs:`, `test:`, `chore:`, `ci:`), sin líneas de atribución, uno por tarea o por paso de commit.
- Entrega: archivos de a pocos por mensaje, cada uno con su ruta. Al cerrar cada tarea, avisar la fase actual y cuánto falta.

## Review Focus

1. **La CDN cachea la redirección de `/`.** Si Vercel guarda un solo 302, todos los visitantes caen en el mismo idioma. Hay que responder con `Cache-Control: no-store` y `Vary: Accept-Language`. Lo cubre el test de `buildLocaleRedirect` (Task 2) y la verificación con curl (Task 12).
2. **`Accept-Language` ausente, vacío o malformado** (bots, crawler de LinkedIn, `*`, `q=abc`). Tiene que ir a `/en/` sin romper. Lo cubren los tests de `resolveLocale` (Task 2).
3. **El selector de idioma en un detalle cae en 404** si un slug existe en un idioma y no en el otro, o si la ruta viene sin barra final. Lo cubren el test de paridad de slugs (Task 4) y el de `switchLocalePath` con y sin `/` final (Task 3).
4. **WebGL no disponible, contexto perdido o reduced motion.** El hero tiene que verse legible con un fondo estático. Lo cubre el test de `shouldAnimate` (Task 9) y el handler `webglcontextlost`.
5. **Estado y links que no coinciden** (un proyecto `live` sin demo, un `in-progress` con links) hacen que una tarjeta muestre botones rotos. Lo cubre el `superRefine` del esquema con un test por estado (Task 4).

---

## Fase 1 · Base (Tasks 1–3)

### Task 1: Scaffold, configuración y CI

**Files:**
- Create: proyecto Astro en `portfolio/` (template minimal, TS strict)
- Create: `astro.config.mjs`, `vitest.config.ts`, `.github/workflows/ci.yml`, `tests/smoke.test.ts`
- Create: `docs/superpowers/specs/2026-11-19-portfolio-design.md`, `docs/superpowers/plans/2026-11-19-portfolio.md` (se copian los existentes)

**Interfaces:**
- Produces: scripts `npm run dev | build | check | test`. Config i18n con `locales: ['es','en']`, `defaultLocale: 'es'`, `routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false }`. `output: 'static'` con el adaptador de Vercel.

- [ ] **Step 1:** `npm create astro@latest portfolio -- --template minimal --typescript strict --git`, luego `npx astro add vercel` y `npm i -D vitest gray-matter @astrojs/check typescript`.
- [ ] **Step 2:** Configurar `astro.config.mjs` con el i18n y el adaptador de arriba. `site: 'https://<proyecto>.vercel.app'` queda provisorio hasta el primer deploy.
- [ ] **Step 3:** `vitest.config.ts` usando `getViteConfig` de `astro/config`, con `test.include: ['tests/**/*.test.ts']`. En `package.json`: `"check": "astro check"`, `"test": "vitest run"`.
- [ ] **Step 4:** `tests/smoke.test.ts` con `expect(1 + 1).toBe(2)`. Correr `npm test`; esperado: 1 passed.
- [ ] **Step 5:** `ci.yml`: en push y PR, Node 22, `npm ci`, `npm run check`, `npm test`, `npm run build`.
- [ ] **Step 6:** Correr `npm run check && npm run build`; esperado: 0 errores y build OK.
- [ ] **Step 7: Commits**
  - `docs: add portfolio design spec and implementation plan`
  - `chore: scaffold astro project with vercel adapter and i18n config`
  - `ci: add check, test and build workflow`

### Task 2: Elegir idioma y redirigir desde `/`

**Files:**
- Create: `src/i18n/locale.ts`, `src/pages/index.astro`
- Test: `tests/i18n/locale.test.ts`

**Interfaces:**
- Produces:
  - `type Locale = 'es' | 'en'`
  - `const LOCALES: readonly Locale[]`
  - `resolveLocale(acceptLanguage: string | null | undefined): Locale`
  - `buildLocaleRedirect(acceptLanguage: string | null | undefined): { location: string; headers: Record<string, string> }`

- [ ] **Step 1: Escribir los tests que fallan**

```ts
describe('resolveLocale', () => {
  it.each([
    [null, 'en'], [undefined, 'en'], ['', 'en'], ['*', 'en'],
    ['es-AR,es;q=0.9,en;q=0.8', 'es'], ['ES', 'es'], ['es', 'es'],
    ['en-US,en;q=0.9,es;q=0.8', 'en'], ['pt-BR,es;q=0.5', 'en'],
    ['en;q=0.3,es-MX;q=0.9', 'es'], ['es;q=abc,en;q=0.5', 'es'], [';;,,', 'en'],
  ])('%s -> %s', (h, exp) => expect(resolveLocale(h)).toBe(exp))
})
describe('buildLocaleRedirect', () => {
  it('apunta a /es/ y no se cachea', () => {
    expect(buildLocaleRedirect('es-AR')).toEqual({
      location: '/es/',
      headers: { 'Cache-Control': 'no-store', 'Vary': 'Accept-Language' },
    })
  })
  it('apunta a /en/ sin header', () => expect(buildLocaleRedirect(null).location).toBe('/en/'))
})
```

- [ ] **Step 2:** `npm test -- tests/i18n/locale.test.ts`; esperado: FAIL (el módulo no existe).
- [ ] **Step 3:** Implementar en `src/i18n/locale.ts`. Separar por `,`, sacar `q` (si falta o es inválido vale 1), ordenar por `q` descendente de forma estable y tomar el primer tag; si su subtag primario en minúsculas es `es`, devolver `es`, y en cualquier otro caso, `en`.
  - Nota: se usa el header directo en vez de `Astro.preferredLocale`, porque este último elige el primer idioma *soportado* (para `fr,es;q=0.5` devolvería `es`) y el spec pide el de mayor prioridad.
- [ ] **Step 4:** `src/pages/index.astro` con `export const prerender = false`: lee `Astro.request.headers.get('accept-language')`, aplica los headers a `Astro.response.headers` y devuelve `Astro.redirect(location, 302)`.
- [ ] **Step 5:** `npm test`; esperado: PASS.
- [ ] **Step 6: Commit** `feat: redirect root to browser language`

### Task 3: Textos de la interfaz y rutas por idioma

**Files:**
- Create: `src/i18n/ui.ts`, `src/i18n/routes.ts`
- Test: `tests/i18n/routes.test.ts`

**Interfaces:**
- Consumes: `Locale` (Task 2)
- Produces:
  - `ui: Record<Locale, UiStrings>`, donde `UiStrings` sale del objeto `es` (`as const`) y `en` se valida con `satisfies` para que no falten claves.
  - `t(locale: Locale): UiStrings`
  - `homePath(locale: Locale): string` (`/es/` y `/en/`)
  - `projectPath(locale: Locale, slug: string): string`
  - `switchLocalePath(pathname: string): string`

- [ ] **Step 1: Tests**

```ts
it.each([
  ['/es/', '/en/'], ['/es', '/en/'], ['/en/', '/es/'],
  ['/es/proyectos/radar-ofertas-it/', '/en/projects/radar-ofertas-it/'],
  ['/en/projects/miniblog-api', '/es/proyectos/miniblog-api/'],
  ['/fr/algo', '/en/'], ['/', '/en/'],
])('switchLocalePath(%s) = %s', (p, e) => expect(switchLocalePath(p)).toBe(e))
it('projectPath', () => {
  expect(projectPath('es', 'x')).toBe('/es/proyectos/x/')
  expect(projectPath('en', 'x')).toBe('/en/projects/x/')
})
```

- [ ] **Step 2:** Correr; esperado: FAIL.
- [ ] **Step 3:** Implementar. Claves mínimas de `UiStrings`: `nav.projects`, `nav.experience`, `nav.about`, `nav.contact`, `hero.role`, `hero.cta.projects`, `hero.cta.cv`, `status.live`, `status.codeOnly`, `status.deployOnly`, `status.inProgress`, `badge.team`, `link.demo`, `link.repo`, `link.store`, `detail.back`, `langSwitch.label`, `notFound.title`, `notFound.back`, `meta.description`.
- [ ] **Step 4:** Correr; esperado: PASS.
- [ ] **Step 5: Commit** `feat: add ui dictionary and localized routes`

## Fase 2 · Contenido (Tasks 4–5)

### Task 4: Esquemas de contenido

**Files:**
- Create: `src/content/schemas.ts`, `src/content.config.ts`
- Test: `tests/content/schemas.test.ts`, `tests/content/files.test.ts`

**Interfaces:**
- Produces: `projectSchema`, `experienceSchema` (Zod de `astro/zod`), `type ProjectData`, `type ProjectStatus = 'live' | 'code-only' | 'deploy-only' | 'in-progress'`. Las collections `projects` (glob `src/content/projects/**/*.md`) y `experience` (glob `src/content/experience/**/*.md`). El id de cada entrada es `<locale>/<slug>`.

- [ ] **Step 1: Tests de esquema**, uno por regla de `superRefine`:
  - `live` requiere `links.demo` y `links.repo`
  - `code-only` requiere `repo` y rechaza `demo`
  - `deploy-only` requiere `demo` y rechaza `repo`
  - `in-progress` rechaza cualquier link
  - Las URL deben empezar con `https://`
  - `summary.max(180)`
  - `order` es un entero positivo
- [ ] **Step 2: Test de archivos** (`files.test.ts`). Con gray-matter, lee todos los `.md` de `src/content/projects/es` y `/en` y verifica:
  - cada frontmatter pasa `projectSchema`
  - el conjunto de slugs en `es` es igual al de `en`
  - `status`, `links` y `order` coinciden entre los dos idiomas del mismo slug
  - lo mismo para `experience`
  - Con 0 archivos, el test tiene que fallar con el mensaje "no content".
- [ ] **Step 3:** Correr; esperado: FAIL.
- [ ] **Step 4:** Implementar los esquemas:
  - Proyecto: `title`, `summary`, `role`, `stack: string[] (min 1)`, `status`, `team: boolean`, `links: { demo?, repo? }`, `note?`, `order`, `cover?`.
  - Experiencia: `company`, `role`, `start: 'YYYY-MM'` (regex), `end?`, `summary`, `stack`, `links: { store? }`, `note?`, `order`.
- [ ] **Step 5:** El test de esquemas pasa; `files.test.ts` sigue fallando hasta la Task 5, y está bien.
- [ ] **Step 6: Commit** `feat: add content collection schemas`

### Task 5: Textos de proyectos y experiencia (ES/EN)

**Files:**
- Create: `src/content/projects/{es,en}/{radar-ofertas-it,reservas-spring-boot,control-gastos,cheese-cash,miniblog-api,mcp-github-agent,pollo-al-reflejo}.md`
- Create: `src/content/experience/{es,en}/clinicges.md`

**Datos fijos (copiar tal cual):**

| slug | order | status | team | demo | repo | note (ES) |
|---|---|---|---|---|---|---|
| radar-ofertas-it | 1 | live | false | https://radar-ofertas-it.vercel.app | https://github.com/valenberdev/radar-ofertas-it | — |
| reservas-spring-boot | 2 | live | false | https://reservas-api-tf38.onrender.com | https://github.com/valenberdev/reservas-spring-boot | Render free: la primera carga puede tardar |
| control-gastos | 3 | live | false | https://control-gastos-roan-eight.vercel.app | https://github.com/valenberdev/control-gastos | — |
| cheese-cash | 4 | deploy-only | true | https://cheesecash-frontend.vercel.app | — | Proyecto en equipo · yo hice el backend |
| miniblog-api | 5 | code-only | false | — | https://github.com/valenberdev/miniblog-api-v2 | Solo código · el hosting de prueba venció |
| mcp-github-agent | 6 | code-only | false | — | https://github.com/valenberdev/mcp-github-agent | Solo código · servidor MCP sin interfaz visual |
| pollo-al-reflejo | 7 | in-progress | true | — | — | En desarrollo · yo hago el backend |

ClinicGest: `company: ClinicGes`, `start: 2026-09`, `links.store: https://play.google.com/store/apps/details?id=com.clinicges.pacientes`, `note: App de uso exclusivo para pacientes de la clínica`.

- [ ] **Step 1:** Claude redacta los 7 proyectos + ClinicGest en ES. Cuerpo de cada uno: `## Problema`, `## Qué hice`, `## Decisiones clave` (3–5 bullets), `## Stack`. Solo hechos reales; en los proyectos en equipo, solo la parte de Valen.
- [ ] **Step 2:** Valen revisa y corrige los textos ES.
- [ ] **Step 3:** Claude traduce a EN con el mismo frontmatter (salvo los textos).
- [ ] **Step 4:** `npm test`; esperado: todo PASS, incluido `files.test.ts`.
- [ ] **Step 5: Commits**
  - `feat: add spanish project and experience content`
  - `feat: add english content translations`

## Fase 3 · Páginas (Tasks 6–8)

### Task 6: Layout, header, footer, contacto y 404

**Files:**
- Create: `src/layouts/BaseLayout.astro`, `src/components/Header.astro`, `src/components/LangSwitch.astro`, `src/components/ContactLinks.astro`, `src/components/Footer.astro`, `src/styles/tokens.css`, `src/styles/global.css`, `src/pages/404.astro`

**Interfaces:**
- Consumes: `t`, `switchLocalePath`, `homePath` (Task 3)
- Produces:
  - `BaseLayout` props: `{ locale: Locale; title: string; description: string; ogImage?: string }`. Renderiza `<html lang>`, `hreflang` es/en/x-default (que apunta a `/`), Open Graph y `<ClientRouter />`.
  - `ContactLinks` props: `{ size?: 'sm' | 'lg' }`

- [ ] **Step 1:** Implementar:
  - `tokens.css`, con variables neutras: `--bg`, `--fg`, `--muted`, `--accent`, `--radius`, `--font-sans`, `--font-display`, `--space-*`
  - el menú numerado 01–04 con anclas `#proyectos` / `#projects`, según el `locale`
  - el link "Saltar al contenido"
  - `404.astro` bilingüe (los dos textos, con links a `/es/` y `/en/`)
- [ ] **Step 2:** En `npm run dev`, entrar a `/es/` y `/en/`: el header cambia de idioma, el switch lleva a la otra versión, y los íconos tienen `aria-label` y abren el perfil correcto. Navegar con Tab sin quedar atrapado.
- [ ] **Step 3:** `npm run check && npm run build`; esperado: OK.
- [ ] **Step 4: Commit** `feat: add base layout, header, footer and contact links`

### Task 7: Home

**Files:**
- Create: `src/components/home/{Hero,ProjectsSection,ProjectCard,StatusBadge,ExperienceSection,AboutSection,ContactSection}.astro`, `src/components/home/HomePage.astro`, `src/pages/es/index.astro`, `src/pages/en/index.astro`, `src/lib/content.ts`

**Interfaces:**
- Consumes: collections (Task 4), `projectPath` (Task 3)
- Produces:
  - `getProjects(locale: Locale): Promise<Project[]>`, ordenado por `order`, con `slug` sin el prefijo de idioma
  - `getExperience(locale: Locale)`
  - `ProjectCard` usa `transition:name={`project-${slug}`}` en el título

- [ ] **Step 1:** El hero va con fondo estático (el shader entra en la Task 9): nombre, `hero.role`, el stack principal (Node.js · TypeScript · Java · PostgreSQL), los botones "Ver proyectos" y "CV", y `ContactLinks`. El botón de CV apunta a `/cv/cv-valentino-berdini-<locale>.pdf`.
- [ ] **Step 2:** Cada tarjeta lleva el `StatusBadge` según `status`, el badge `team` si corresponde, la `note` visible y solo los links que existen.
- [ ] **Step 3:** Agrupación del stack en Sobre mí:
  - Backend: Node.js, Express, Java 21, Spring Boot, PostgreSQL
  - Frontend: React, TypeScript, Next.js, Astro, Capacitor
  - Testing: Vitest
  - Infra: Docker, GitHub Actions, Vercel, AWS SES
- [ ] **Step 4:** Verificar en dev: 7 tarjetas en el orden de la tabla. Pollo Al Reflejo sin links. MiniBlog y MCP Agent solo con repo. Cheese Cash solo con demo. ClinicGest con el link a Play Store y su nota.
- [ ] **Step 5:** `npm run check && npm run build`; esperado: OK.
- [ ] **Step 6: Commit** `feat: build home page sections`

### Task 8: Detalle de proyecto y View Transitions

**Files:**
- Create: `src/components/project/ProjectDetail.astro`, `src/pages/es/proyectos/[slug].astro`, `src/pages/en/projects/[slug].astro`

**Interfaces:**
- Consumes: `getProjects` (Task 7), `transition:name` `project-${slug}` (Task 7)

- [ ] **Step 1:** `getStaticPaths` genera una página por proyecto del idioma. `ProjectDetail` renderiza el título con el mismo `transition:name`, los badges, la nota, los links y el cuerpo Markdown (`render(entry)`), más un link de vuelta a `homePath(locale) + '#proyectos'` (o `#projects` en inglés).
- [ ] **Step 2:** Verificar en dev: al hacer click en una tarjeta, el título se transforma en el encabezado del detalle. Con reduced motion activado en el sistema, la transición es instantánea. En un detalle, el switch ES/EN lleva al mismo proyecto.
- [ ] **Step 3:** `npm run build`; esperado: 14 páginas de detalle generadas.
- [ ] **Step 4: Commit** `feat: add project detail pages with view transitions`

## Fase 4 · Movimiento (Tasks 9–10)

### Task 9: Hero con shader

**Files:**
- Create: `src/scripts/shader/fragment.ts`, `src/scripts/shader/renderer.ts`, `src/scripts/shader/policy.ts`, `src/components/home/HeroShader.astro`
- Modify: `src/components/home/Hero.astro`
- Test: `tests/shader/policy.test.ts`

**Interfaces:**
- Produces:
  - `shouldAnimate(env: { reducedMotion: boolean; webgl: boolean }): boolean`
  - `pixelRatioFor(dpr: number, isMobile: boolean): number`
  - `createShaderRenderer(canvas: HTMLCanvasElement, fragmentSource: string): { start(): void; stop(): void; resize(): void; setPointer(x: number, y: number): void; destroy(): void } | null` (devuelve `null` si no hay WebGL)

- [ ] **Step 1: Tests**

```ts
expect(shouldAnimate({ reducedMotion: true, webgl: true })).toBe(false)
expect(shouldAnimate({ reducedMotion: false, webgl: false })).toBe(false)
expect(shouldAnimate({ reducedMotion: false, webgl: true })).toBe(true)
expect(pixelRatioFor(3, false)).toBe(1.5)
expect(pixelRatioFor(1, false)).toBe(1)
expect(pixelRatioFor(3, true)).toBe(1)
expect(pixelRatioFor(0.5, true)).toBe(0.5)
```

- [ ] **Step 2:** Correr; esperado: FAIL.
- [ ] **Step 3:** Implementar `policy.ts`: el desktop usa `min(dpr, 1.5)` y el mobile `min(dpr, 1)`.
- [ ] **Step 4:** Implementar `renderer.ts` y `fragment.ts` portando el prototipo B aprobado en el chat: fbm de 5 octavas con warp, el cursor interpolado con factor 0.05 y la paleta provisoria de tokens. El canvas va con `aria-hidden="true"`.
  - `IntersectionObserver` llama a `stop()` cuando el hero sale de pantalla.
  - En `webglcontextlost`, `stop()` y se queda en el fallback.
  - Se usa `matchMedia('(pointer: coarse)')` como `isMobile`.
- [ ] **Step 5:** `HeroShader.astro`: el canvas con `transition:persist="hero-shader"` sobre un fondo CSS estático que hace de fallback, y un script que monta el renderer solo si `shouldAnimate(...)` da `true`. Hay que re-montarlo en `astro:page-load`, porque con ClientRouter los scripts no se vuelven a ejecutar.
- [ ] **Step 6:** `npm test`; esperado: PASS. En dev, verificar que con reduced motion se ve el fondo estático, y que en la pestaña Performance el rAF se detiene al scrollear fuera del hero.
- [ ] **Step 7: Commit** `feat: add webgl shader hero with motion fallbacks`

### Task 10: Revelados al hacer scroll

**Files:**
- Create: `src/styles/motion.css`, `src/scripts/reveal.ts`
- Modify: las secciones de la home (se agrega `data-reveal`)

- [ ] **Step 1:** En `motion.css`, `@supports (animation-timeline: view())` aplica la animación de entrada a `[data-reveal]`. Fuera de `@supports`, la clase `.is-visible` la agrega `reveal.ts` con IntersectionObserver (`threshold: 0.15`, `unobserve` después de revelar). Todo el bloque va dentro de `@media (prefers-reduced-motion: no-preference)`. Sin JS, el contenido tiene que verse siempre.
- [ ] **Step 2:** Verificar en Chrome y en Firefox que las secciones aparecen al scrollear, que con reduced motion se ven sin animación y que con JS desactivado todo se ve.
- [ ] **Step 3: Commit** `feat: add scroll reveal animations`

## Fase 5 · Cierre (Tasks 11–13)

### Task 11: CVs en PDF

**Files:**
- Create: `public/cv/cv-valentino-berdini-es.pdf`, `public/cv/cv-valentino-berdini-en.pdf`

- [ ] **Step 1:** Generar el CV general en ES con la skill `cv-a-medida`, sin oferta puntual (perfil backend junior), y la versión EN equivalente.
- [ ] **Step 2:** Valen revisa los dos PDFs.
- [ ] **Step 3:** Verificar en dev que el botón CV de `/es/` y de `/en/` descarga el PDF de su idioma.
- [ ] **Step 4: Commit** `feat: add downloadable cv in spanish and english`

### Task 12: Deploy y verificación en producción

- [ ] **Step 1:** Crear el repo `valenberdev/portfolio`, hacer push, importar en Vercel y actualizar `site` en `astro.config.mjs` con la URL final. Commit: `chore: set production site url`.
- [ ] **Step 2:** Verificar la redirección:
  - `curl -sI -H "Accept-Language: es-AR" <url>/` → `302`, `location: /es/`, `cache-control: no-store`, `vary: Accept-Language`
  - `curl -sI -H "Accept-Language: en-US" <url>/` → `/en/`
  - `curl -sI <url>/` → `/en/`
- [ ] **Step 3:** Lighthouse mobile en `/es/` y en un detalle: rendimiento ≥ 90 y accesibilidad ≥ 90. Si no se cumple, corregir antes de seguir.
- [ ] **Step 4:** Pegar `/es/` y `/en/` en el inspector de publicaciones de LinkedIn: la vista previa tiene que salir con el título y la descripción en su idioma.
- [ ] **Step 5:** Revisar todos los links externos de las tarjetas y de ClinicGest: deben responder 200, o mostrar la nota de Render.

### Task 13: Prompt para Claude Code + impeccable

**Files:**
- Create: `docs/design-handoff-prompt.md`

- [ ] **Step 1:** Escribir el prompt. Tiene que incluir:
  - los links de referencia (itssharl.ee, p5aholic.me, lauren-waller.com, cydstumpel.nl)
  - qué puede cambiar: tokens, tipografía, espaciado, composición de las secciones, colores del shader y curvas de movimiento
  - qué no puede tocar: rutas, esquemas, lógica de idioma, `transition:name`, `transition:persist`, fallbacks de reduced motion y de WebGL, y los tests
  - la meta de Lighthouse ≥ 90
  - la regla de no agregar comentarios al código
- [ ] **Step 2: Commit** `docs: add design handoff prompt for final visual pass`
