# Prompt para el pulido visual final (Claude Code + impeccable)

Copiá todo lo que está debajo de la línea y pegalo en Claude Code, abierto en la raíz del repo `portfolio`.

---

Usá la skill **impeccable** para hacer el pulido visual final de este portfolio. El sitio ya funciona, tiene tests y está en producción. Tu trabajo es **solo lo visual**: que se vea llamativo, muy estilizado y con movimiento, sin romper nada de lo que ya funciona.

## Contexto

- Portfolio de Valentino Berdini, desarrollador fullstack orientado al backend que busca su primer puesto junior remoto. El sitio lo leen reclutadores (en 30 segundos) y entrevistadores técnicos (en los detalles de proyecto).
- Stack: Astro 7 con TypeScript estricto, sin frameworks de UI (solo componentes `.astro` y scripts `.ts`). Deploy en Vercel.
- Bilingüe ES/EN, con rutas `/es/` y `/en/`. Solo modo oscuro.
- Antes de cambiar nada, leé `docs/superpowers/specs/2026-11-19-portfolio-design.md`.

## Referencias que le gustaron a Valen

- https://p5aholic.me (fondo con shader, minimalismo, menú numerado)
- https://cydstumpel.nl (animaciones guiadas por scroll y View Transitions)
- https://itssharl.ee (formas, intro animada, personalidad)
- https://lauren-waller.com (composición limpia, tipografía)

Lo que tienen en común: son minimalistas y guiados por el texto, con tipografía grande, y lo llamativo está en el movimiento, no en cargar la pantalla. Tomá esa dirección, no copies ninguno.

## Qué podés cambiar libremente

- Los tokens de `src/styles/tokens.css`: paleta, espaciado, radios y curvas de animación.
- `src/styles/global.css` y `src/styles/motion.css`: los valores y el tipo de animación, siempre que respeten las reglas de abajo.
- La tipografía. Hoy usa la fuente del sistema y es lo que más "genérico" lo hace ver. Tiene que ser **autoalojada**, con el soporte de fuentes de Astro o `@fontsource`; nada de cargarla desde el CDN de Google. Usá `font-display: swap` y precargá solo los pesos que se usen.
- La composición y los estilos de cada sección, dentro de `src/components/**` y `src/layouts/BaseLayout.astro`: layout, jerarquía, tamaños, efectos de hover y microinteracciones.
- Los colores y parámetros del shader en `src/scripts/shader/fragment.ts`, para que combinen con la paleta nueva.
- Opcional: una imagen de Open Graph de 1200×630 por idioma (`public/og-es.png`, `public/og-en.png`), pasada como `ogImage` en `HomePage.astro`.

## Qué NO podés tocar

- Rutas, archivos de páginas, ni la lógica de `src/pages/index.astro` (la redirección por idioma con `Cache-Control: no-store` y `Vary: Accept-Language`).
- `src/i18n/**`, `src/content/**`, `src/content.config.ts`, `src/lib/content.ts` ni los esquemas Zod. **Los textos no se escriben a mano en los componentes:** si necesitás un texto nuevo, va en `src/i18n/ui.ts`, en los dos idiomas.
- El orden de las secciones: Hero → 01 Proyectos → 02 Experiencia → 03 Sobre mí → 04 Contacto.
- Los nombres `transition:name={`project-${slug}`}` (en la tarjeta y en el detalle) y `transition:persist="hero-shader"`.
- Los fallbacks:
  - Con `prefers-reduced-motion: reduce` no hay animaciones y el shader no se monta.
  - Sin WebGL queda un fondo estático.
  - Sin JavaScript todo el contenido es visible.
  - El shader se pausa fuera de pantalla.
- `src/scripts/shader/policy.ts`, `src/scripts/shader/renderer.ts` (solo podés cambiar `fragment.ts`) y `src/scripts/reveal.ts`.
- `tests/**`, `astro.config.mjs`, `package.json` (salvo agregar una dependencia de fuentes) y el workflow de CI.
- Los atributos de accesibilidad: `aria-label`, `aria-hidden`, `lang`, el skip link y el `:focus-visible`.

## Requisitos

- Lighthouse mobile ≥ 90 en rendimiento y en accesibilidad, en `/es/` y en un detalle de proyecto. Contraste AA en todo el texto.
- Que funcione bien de 320 px a 1920 px de ancho.
- Sin comentarios en el código.
- Commits chicos, uno por cambio coherente, de una línea con prefijo convencional (`style:`, `feat:`, `fix:`) y **sin** líneas de atribución (sin `Co-Authored-By` ni similares).

## Verificación antes de terminar

```bash
npm test
npm run check
npm run build
```

Las tres tienen que pasar: hoy son 64 tests, `0 errors` y build completo. Además, en `npm run dev`:
- La tarjeta de proyecto se transforma en el título del detalle (View Transition).
- El selector ES/EN lleva a la misma página en el otro idioma.
- Con reduced motion activado no hay animaciones.
