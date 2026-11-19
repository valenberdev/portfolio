---
title: MiniBlog API
summary: A REST API for a blog with authors, posts and comments, built with Node.js, Express and PostgreSQL, with automated tests and OpenAPI documentation.
role: Henry project · backend
stack: [Node.js, Express, PostgreSQL, Jest, Supertest, OpenAPI]
status: code-only
team: false
links:
  repo: https://github.com/valenberdev/miniblog-api-v2
note: Code only. The trial hosting expired.
order: 5
---

## Problem

The backend module project at Henry: design a complete relational API and deliver it with tests, documentation and a deploy.

## What I built

- CRUD for authors, posts and comments, with relations and constraints in PostgreSQL.
- A routes and services architecture, with `pg` and a connection pool.
- Tests with Jest and Supertest with the database mocked, plus the OpenAPI spec.

## Key decisions

- **Partial updates with `COALESCE`**, so a PATCH doesn't overwrite the fields it doesn't send.
- **Centralized error handling** with a middleware and `next(error)`.
- **Explicit SQL with `pg`**, no ORM.
