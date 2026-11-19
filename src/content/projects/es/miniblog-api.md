---
title: MiniBlog API
summary: API REST para un blog con autores, publicaciones y comentarios, hecha con Node.js, Express y PostgreSQL, con tests automatizados y documentación OpenAPI.
role: Proyecto de Henry · backend
stack: [Node.js, Express, PostgreSQL, Jest, Supertest, OpenAPI]
status: code-only
team: false
links:
  repo: https://github.com/valenberdev/miniblog-api-v2
note: Solo código. El hosting de prueba venció.
order: 5
---

## Problema

Proyecto del módulo de backend de Henry: diseñar una API relacional completa y entregarla con tests, documentación y deploy.

## Qué hice

- CRUD de autores, publicaciones y comentarios, con relaciones y constraints en PostgreSQL.
- Arquitectura en rutas y servicios, con `pg` y un pool de conexiones.
- Tests con Jest y Supertest mockeando la base, y la especificación OpenAPI.

## Decisiones clave

- **Actualizaciones parciales con `COALESCE`**, para que un PATCH no pise los campos que no se envían.
- **Manejo de errores centralizado** con un middleware y `next(error)`.
- **SQL explícito con `pg`**, sin ORM.
