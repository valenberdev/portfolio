---
title: Pollo Al Reflejo
summary: A management system for a real rotisserie shop, built to replace the software the business uses today. We're building it as a team and I'm on the backend.
role: Backend · team of 4
stack: [Node.js, Express, TypeScript, PostgreSQL, Docker, React]
status: in-progress
team: true
links: {}
note: In progress. I'm building the backend.
order: 7
---

## Problem

The Pollo Al Reflejo rotisserie needs to replace its current management software with one built for how it actually works.

## What I'm building

- The architecture and setup of the TypeScript backend, the Docker environment, and the data model together with the product owner.

## Key decisions

- **Multi-business from day one.** Every repository method takes the `businessId` as its first required parameter, and a test checks the isolation between two businesses.
- **`pg` with explicit SQL**, no ORM.
- **Forward-only migrations**, no rollbacks.
