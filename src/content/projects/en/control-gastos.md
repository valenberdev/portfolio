---
title: Expense Tracker
summary: A PWA to log expenses and income from the web or from a Telegram bot, with balance, trends and spending by category. API, bot and frontend in one monorepo.
role: Personal project · full stack
stack: [Node.js, Express, TypeScript, PostgreSQL, React, grammY, Docker, GitHub Actions]
status: live
team: false
links:
  demo: https://control-gastos-roan-eight.vercel.app
  repo: https://github.com/valenberdev/control-gastos
note: The API runs on Render's free plan, so the first load can take about a minute.
order: 3
---

## Problem

Logging an expense has to be so quick that you never skip it. The app also had to run on an iPhone without paying for an Apple Developer account.

## What I built

- A REST API with Express and PostgreSQL: own authentication, transactions, balance and trends.
- A Telegram bot built with grammY that understands messages like `500 comida` or `+50000 sueldo` and uses the same API.
- An installable React PWA with push notifications and light and dark themes.
- Multi-stage Docker images, CI with GitHub Actions and automatic deploys of only the service that changed.

## Key decisions

- **A PWA instead of a native app**, so it installs on an iPhone without a developer account. **Telegram instead of WhatsApp**, because of the friction of WhatsApp's API.
- **The balance is computed in SQL with `NUMERIC(12,2)`**, not stored: no floating-point errors and no counter drifting out of sync.
- **The bot never touches the database.** Everything goes through the API with an internal key and a 15-minute JWT per chat, so validation and user isolation are the same as on the web.
- **Revocable sessions.** The token carries a session version, and resetting the password invalidates every token within seconds.
- **Integration tests against real Postgres**, which caught real bugs: for example, `1.500` was being saved as 1.5.
