---
title: Cheese Cash
summary: A multi-currency digital wallet for travelers, with buying, selling and converting between ARS, USD, EUR and Bitcoin at real rates. Henry final project, built as a team.
role: Backend · team of 4
stack: [Node.js, Express, TypeScript, PostgreSQL, AWS SES, Vitest, React]
status: deploy-only
team: true
links:
  demo: https://cheesecash-frontend.vercel.app
note: Team project. I built the backend.
order: 4
---

## Problem

The final project of Henry's Full Stack program: a simulated wallet for travelers that handles several currencies at real rates, in 3 weeks and 2 sprints.

## What I built

I owned the backend:

- The data model, endpoints and transactional logic for buying, selling and converting between ARS, USD, EUR and Bitcoin.
- Exchange rates from ExchangeRate-API with an own cache, and the Bitcoin price from CoinGecko.
- Transactional emails sent from the backend with AWS SES: a receipt after every operation, and email confirmation for large amounts, which are cancelled after 2 hours if nobody confirms them.

In the demo, emails are not sent, because the AWS SES account stayed in sandbox mode.

## Key decisions

- **A `wallets` table between users and balances**, designed to support several wallets per user or shared wallets later on.
- **`pg` with explicit SQL** instead of an ORM.
- **User endpoints first**, so the frontend could move forward in parallel, telling the team about every contract change.
