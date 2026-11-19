---
title: Radar de ofertas IT
summary: Ofertas IT remotas ordenadas por cuánto encajan con tu perfil. Pegás tu CV y Gemini puntúa cada oferta de 0 a 100 con una justificación.
role: Proyecto personal · fullstack
stack: [Next.js, React, TypeScript, PostgreSQL, Gemini, Zod, Vitest, Vercel]
status: live
team: false
links:
  demo: https://radar-ofertas-it.vercel.app
  repo: https://github.com/valenberdev/radar-ofertas-it
order: 1
---

## Problema

Buscar trabajo remoto en IT es revisar cientos de avisos que, en su mayoría, no encajan con tu perfil o no aceptan gente de tu país.

## Qué hice

- Ingesta diaria con crons de Vercel desde la API de Himalayas y el hilo "Who is hiring?" de Hacker News, con las ofertas normalizadas y deduplicadas entre fuentes.
- Extracción del perfil a partir de texto o de un archivo (PDF, DOCX o TXT leído en el navegador) con Gemini, cacheada por hash.
- Un prefiltro determinista por skills que deja 30 candidatas y una sola llamada a Gemini que las puntúa con salida JSON validada con Zod.
- Interfaz bilingüe en español e inglés, y un modo dueño con sesión firmada.

## Decisiones clave

- **El CV nunca se guarda.** Antes de enviar el texto al modelo se redactan mails, teléfonos y URLs, y solo se persiste el perfil estructurado.
- **Gasto con techo.** Un contador diario en Postgres, un límite más bajo para visitantes y caché de puntajes: repetir una búsqueda no cuesta nada.
- **Medir en vez de suponer.** Etiqueté 135 ofertas con Claude como juez para medir el prefiltro y el puntaje. Contra ese juez, Gemini alcanza un Spearman de 0,58 frente a 0,02 del prefiltro solo. Lo contrasté con una muestra etiquetada por mí y el acuerdo fue bajo, así que está documentado como limitación.
- **Arquitectura en capas** (domain, application, infrastructure, app) con reglas de ESLint que mantienen las dependencias hacia adentro, y 10 ADRs que justifican cada decisión.
- **`pg` con SQL explícito** y un runner de migraciones propio, sin ORM.
