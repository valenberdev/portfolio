---
title: Control de gastos
summary: PWA para registrar gastos e ingresos desde la web o desde un bot de Telegram, con saldo, tendencias y gasto por categoría. API, bot y frontend en un monorepo.
role: Proyecto personal · fullstack
stack: [Node.js, Express, TypeScript, PostgreSQL, React, grammY, Docker, GitHub Actions]
status: live
team: false
links:
  demo: https://control-gastos-roan-eight.vercel.app
  repo: https://github.com/valenberdev/control-gastos
note: La API corre en el plan gratuito de Render, así que la primera carga puede tardar cerca de un minuto.
order: 3
---

## Problema

Anotar un gasto tiene que ser tan rápido que no dé pereza hacerlo. Además, la app tenía que funcionar en iPhone sin pagar una cuenta de Apple Developer.

## Qué hice

- API REST con Express y PostgreSQL: autenticación propia, movimientos, saldo y tendencias.
- Un bot de Telegram con grammY que entiende mensajes como `500 comida` o `+50000 sueldo` y usa la misma API.
- Una PWA en React instalable, con notificaciones push y tema claro y oscuro.
- Docker multi-stage, CI con GitHub Actions y deploy automático solo del servicio que cambió.

## Decisiones clave

- **PWA en lugar de app nativa**, para instalarla en iPhone sin cuenta de desarrollador. **Telegram en lugar de WhatsApp**, por la fricción de su API.
- **El saldo se calcula en SQL con `NUMERIC(12,2)`**, no se guarda: sin errores de coma flotante ni contadores desincronizados.
- **El bot no toca la base.** Todo pasa por la API con una clave interna y un JWT de 15 minutos por chat, así que las validaciones y el aislamiento entre usuarios son los mismos que en la web.
- **Sesiones revocables.** El token lleva una versión de sesión, y restablecer la contraseña invalida todos los tokens en segundos.
- **Tests de integración contra Postgres real**, que encontraron bugs reales: por ejemplo, `1.500` se registraba como 1,5.
