---
title: Bookings API
summary: A Java and Spring Boot REST API for booking resources by time slot, which guarantees that two bookings never overlap, even when requests arrive at the same time.
role: Personal project · backend
stack: [Java 21, Spring Boot, Spring Security, PostgreSQL, Flyway, JUnit 5, Testcontainers, Docker]
status: live
team: false
links:
  demo: https://reservas-api-tf38.onrender.com/swagger-ui/index.html
  repo: https://github.com/valenberdev/reservas-spring-boot
note: It runs on Render's free plan, so the first load can take about a minute.
order: 2
---

## Problem

A booking system has to stop two people from booking the same resource for the same time slot, even when their requests arrive at once.

## What I built

- A REST API with sign-up, JWT login and roles (`ADMIN` and `CLIENTE`), resource management and paginated personal bookings.
- Business rules: future bookings only, on active resources, cancellable up to 24 hours before. A scheduled job closes bookings that have ended.
- Uniform errors with `ProblemDetail` (RFC 9457) and OpenAPI docs with Swagger UI.

## Key decisions

- **Overlap prevention lives in the database, not in Java.** A check in code has a race condition, so the guarantee is a PostgreSQL exclusion constraint (`EXCLUDE USING gist` on `tstzrange`).
- **Pessimistic lock per resource.** The concurrency test exposed a deadlock. Now each booking first locks its resource with `SELECT ... FOR UPDATE`, while bookings for different resources still run in parallel.
- **Tests against real PostgreSQL with Testcontainers**, because the constraint doesn't exist in H2. The concurrency test fires 30 simultaneous requests and requires exactly one booking to be created.
- **The user comes from the token, never from the body.** The JWT is validated with `oauth2-resource-server`, and in production the app refuses to start without its secret.
- **Feature-based structure**, Flyway migrations and an injectable `Clock` to test time rules without waiting.
