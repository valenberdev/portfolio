---
title: IT Job Radar
summary: Remote IT job offers ranked by how well they fit your profile. Paste your CV and Gemini scores each offer from 0 to 100 with a short reason.
role: Personal project · full stack
stack: [Next.js, React, TypeScript, PostgreSQL, Gemini, Zod, Vitest, Vercel]
status: live
team: false
links:
  demo: https://radar-ofertas-it.vercel.app
  repo: https://github.com/valenberdev/radar-ofertas-it
order: 1
---

## Problem

Looking for a remote IT job means going through hundreds of postings, most of which don't match your profile or don't hire from your country.

## What I built

- Daily ingestion with Vercel cron jobs from the Himalayas API and the Hacker News "Who is hiring?" thread, with offers normalized and deduplicated across sources.
- Profile extraction with Gemini from pasted text or a file (PDF, DOCX or TXT read in the browser), cached by hash.
- A deterministic skills prefilter that keeps 30 candidates, and a single Gemini call that scores them with JSON output validated by Zod.
- A Spanish and English interface, and an owner mode with a signed session.

## Key decisions

- **The CV is never stored.** Emails, phone numbers and URLs are redacted before the text reaches the model, and only the structured profile is saved.
- **Spending has a ceiling.** A daily counter in Postgres, a lower limit for visitors and cached scores: repeating a search costs nothing.
- **Measuring instead of guessing.** I labeled 135 offers with Claude as a judge to measure the prefilter and the scorer. Against that judge, Gemini reaches a Spearman of 0.58, against 0.02 for the prefilter alone. A check against a sample I labeled myself showed weak agreement, so it is documented as a limitation.
- **Layered architecture** (domain, application, infrastructure, app) with ESLint rules that keep dependencies pointing inwards, and 10 ADRs that justify each decision.
- **`pg` with explicit SQL** and an own migration runner, no ORM.
