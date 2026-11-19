# Portfolio profesional de Valentino Berdini — Diseño

Fecha: 2026-11-19 · Estado: aprobado

## 1. Intención

Página de portfolio para la búsqueda de empleo de Valen (roles backend/fullstack junior, remoto LATAM y EE.UU.). Tiene que servir a dos lectores:

- **Reclutador** (30 segundos): entender quién es, qué stack maneja, ver proyectos con demo y contactarlo.
- **Entrevistador técnico**: entrar al detalle de un proyecto y ver las decisiones técnicas que Valen puede defender.

Objetivo secundario: aprender Astro y sumarlo al CV.

## 2. Objetivos, no-objetivos y anti-objetivos

**Objetivos**
- Mostrar 7 proyectos + 1 experiencia laboral, cada uno con su estado real (demo, solo código, en desarrollo).
- Bilingüe ES/EN con detección por idioma del navegador.
- Diseño con movimiento, llamativo y estilizado (referencias: p5aholic.me, cydstumpel.nl, itssharl.ee, lauren-waller.com).
- Carga rápida y accesible pese al movimiento.

**No-objetivos**
- Captar clientes freelance (sin sección de servicios).
- Formulario de contacto, blog, analytics, modo claro/oscuro.
- Dominio propio en esta etapa (se usa el subdominio de Vercel).

**Anti-objetivos (fallaría aunque funcione)**
- Que el movimiento tape el contenido o haga lenta la página en una notebook común.
- Mostrar algo que no es real: proyectos caídos presentados como si funcionaran, o trabajo de equipo presentado como individual.
- Exponer datos privados (teléfono) o código del cliente de ClinicGest.

## 3. Restricciones

- Astro (última versión estable) + TypeScript, deploy en Vercel con `@astrojs/vercel`.
- Desarrollo en Windows.
- Modo de trabajo: archivos de a pocos por mensaje, cada uno con su ruta, sin comentarios en el código; commits chicos por feature, una línea, prefijo convencional (`feat:`, `docs:`, `fix:`…), sin líneas de atribución. Avisar en qué fase está el proyecto y cuánto falta.

## 4. Enfoques considerados

| Enfoque | A favor | En contra |
|---|---|---|
| Next.js en Vercel | Refuerza la tecnología más nueva del CV; middleware para idioma | Más estructura de la necesaria para un sitio de contenido |
| React + Vite (SPA) | Stack ya conocido, arranque inmediato | Una sola URL, idioma decidido en el cliente (parpadeo), no suma al CV |
| **Astro (elegido)** | Ideal para contenido; View Transitions e islas integradas; permite aprender una tecnología nueva | Curva de aprendizaje; poco peso para roles backend |

**Elegido: Astro**, por decisión de Valen (quiere aprenderlo y sumarlo a su CV).

**Lenguaje de movimiento** (elegido por Valen): base de animaciones de scroll + View Transitions nativas, más un elemento distintivo en el hero. Para el hero comparó formas animadas en canvas 2D contra un shader WebGL sutil. **Eligió el shader.**

## 5. Decisiones tomadas

### 5.1 Contenido

| Proyecto | Tipo | Links | Nota visible |
|---|---|---|---|
| Radar de ofertas IT | Demo + repo | radar-ofertas-it.vercel.app · github.com/valenberdev/radar-ofertas-it | — |
| Sistema de reservas (Java 21 + Spring Boot) | Demo + repo | reservas-api-tf38.onrender.com · github.com/valenberdev/reservas-spring-boot | Render free: la primera carga puede tardar |
| Control de gastos | Demo + repo | control-gastos-roan-eight.vercel.app · github.com/valenberdev/control-gastos | — |
| Cheese Cash (billetera multi-moneda, equipo) | Solo deploy | cheesecash-frontend.vercel.app | "Proyecto en equipo · yo hice el backend" |
| MiniBlog API | Solo repo | github.com/valenberdev/miniblog-api-v2 | "Solo código · el hosting de prueba venció" |
| GitHub MCP Agent | Solo repo | github.com/valenberdev/mcp-github-agent | "Solo código · servidor MCP sin interfaz visual" + captura o GIF de uso en Claude Desktop |
| Pollo Al Reflejo (sistema gastronómico, equipo) | Sin links | — | "En desarrollo · equipo · yo hago el backend" |

**Experiencia laboral, en una sección propia:** ClinicGest, app móvil de pacientes (freelance, desde sept. 2026). Va qué hizo Valen (frontend en React + Capacitor; la app quedó publicada) y cómo trabajó el equipo (Valen en el frontend y Uriel en el backend; rama por feature, PRs sobre `dev`, análisis/overview/plan por feature). Lleva link a la ficha de Play Store con la aclaración "app de uso exclusivo para pacientes de la clínica". Sin repo ni código.

**Afuera:** el Gestor de tareas y las tareas chicas de Henry.

**Contacto:** íconos con link (LinkedIn → linkedin.com/in/valenberdini, GitHub → github.com/valenberdev, Email → mailto:vaberdini@gmail.com). Están en el hero, en la sección de contacto y en el footer. Sin teléfono.

### 5.2 Estructura

```
/                         → render en servidor: redirige a /es o /en
/es  /en                  → home (estática)
  ├ Hero: shader + nombre, rol, stack, [Ver proyectos] [CV] + íconos de contacto
  ├ 01 Proyectos   → tarjetas con estado (demo / solo código / en desarrollo / equipo)
  ├ 02 Experiencia → ClinicGest
  ├ 03 Sobre mí    → texto breve + stack agrupado (backend / frontend / testing / infra)
  └ 04 Contacto    → íconos
/es/proyectos/<slug>  /en/projects/<slug>   → detalle (estático)
  → problema · qué hice · decisiones clave · stack · links
```

Menú numerado (01–04) con selector ES/EN siempre visible. El selector lleva a la misma página en el otro idioma.

### 5.3 Idioma

- Rutas i18n de Astro: `locales: ['es','en']`, prefijo en ambos idiomas.
- Solo `/` se renderiza en el servidor (`prerender = false`). Usa `Astro.preferredLocale` (que sale de `Accept-Language`): si es `es` va a `/es`, cualquier otra cosa va a `/en`. Funciona sin JavaScript y no parpadea.
- Los textos de la interfaz están en un diccionario propio (`src/i18n/ui.ts`), sin librerías.

### 5.4 Contenido como datos

- Content Collections de Astro con esquema Zod: `src/content/projects/{es,en}/<slug>.md`.
- Frontmatter: `title`, `summary`, `role`, `stack[]`, `status` (`live` | `code-only` | `deploy-only` | `in-progress`), `team` (bool), `links` (`demo?`, `repo?`), `note?`, `order`, `cover?`.
- El cuerpo en Markdown es el contenido de la página de detalle.
- ClinicGest va en una collection aparte, `experience`.

### 5.5 Movimiento

- **Hero:** fragment shader con WebGL puro (sin three.js), en un script de TypeScript dentro de un componente Astro. Reacciona al cursor con interpolación suave. Se pausa cuando sale de pantalla (IntersectionObserver), limita el devicePixelRatio a 1.5, en celulares baja la resolución. Con `prefers-reduced-motion` o sin WebGL muestra un fondo estático.
- **Navegación:** `<ClientRouter />` con View Transitions; la tarjeta del proyecto se transforma en el encabezado del detalle (`transition:name`).
- **Scroll:** revelados con `animation-timeline: view()` en CSS y, donde no hay soporte, un fallback con IntersectionObserver. Todo se desactiva con reduced motion.
- **Sin framework de UI:** solo componentes Astro y scripts TypeScript chicos. React no hace falta.

### 5.6 Diseño visual en dos etapas

1. **Durante la construcción:** diseño neutro pero con la estructura definitiva (contenedores de scroll, nombres de transición, capa del shader, tokens CSS en `src/styles/tokens.css`).
2. **Al final:** Claude Code con la skill *impeccable* hace el pulido visual (paleta, tipografía, espaciado, detalles de movimiento) sobre esa estructura. El entregable de esta etapa es el prompt para Claude Code, con los links de referencia y las restricciones de este documento.

### 5.7 Calidad

- Vitest para la lógica: elección de idioma y validación del contenido (que cada proyecto exista en ES y EN, links bien formados).
- `astro check` + Vitest + build en GitHub Actions.
- Meta: Lighthouse ≥ 90 en rendimiento y accesibilidad en mobile; navegable con teclado; contraste AA.
- Metadatos Open Graph por idioma para la vista previa al compartir.

## 6. Decisiones de Claude (revisables)

- Orden de proyectos: Radar → Reservas → Control de gastos → Cheese Cash → MiniBlog → MCP Agent → Pollo Al Reflejo.
- Sin foto personal.
- Solo modo oscuro, porque el shader está pensado para fondo oscuro.
- Claude redacta los textos de cada proyecto (ES y EN) a partir de lo que ya sabe de cada uno, y Valen los revisa antes de publicar.
- Subdominio de Vercel; el dominio propio queda para después.
- Repo nuevo `portfolio` en github.com/valenberdev.

## 7. Queda a criterio del que construye

- Estructura interna de componentes y estilos.
- Implementación concreta del shader, partiendo del prototipo aprobado.
- Ícono de cada red: SVG inline o paquete de íconos.

## 8. Datos pendientes y resueltos

- PDFs del CV en ES y EN: se generan con la skill `cv-a-medida` en versión general (sin oferta puntual) y se sirven desde `public/cv/`.
- Ficha de ClinicGest: https://play.google.com/store/apps/details?id=com.clinicges.pacientes (se omite el parámetro `hl` para que Play Store elija el idioma).
- Captura o GIF del MCP Agent: queda para más adelante. Hasta entonces la tarjeta va sin imagen.

Estado: aprobado por Valen el 2026-11-19.
