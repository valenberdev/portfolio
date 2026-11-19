---
title: Reservas API
summary: API REST en Java y Spring Boot para reservar recursos por franjas horarias, que garantiza que nunca haya dos reservas superpuestas aunque lleguen al mismo tiempo.
role: Proyecto personal · backend
stack: [Java 21, Spring Boot, Spring Security, PostgreSQL, Flyway, JUnit 5, Testcontainers, Docker]
status: live
team: false
links:
  demo: https://reservas-api-tf38.onrender.com/swagger-ui/index.html
  repo: https://github.com/valenberdev/reservas-spring-boot
note: Corre en el plan gratuito de Render, así que la primera carga puede tardar cerca de un minuto.
order: 2
---

## Problema

Un sistema de reservas tiene que impedir que dos personas reserven el mismo recurso en el mismo horario, incluso cuando las solicitudes llegan a la vez.

## Qué hice

- API REST con registro, login con JWT y roles (`ADMIN` y `CLIENTE`), ABM de recursos y reservas propias paginadas.
- Reglas de negocio: solo reservas a futuro, sobre recursos activos, y cancelación hasta 24 horas antes. Un job programado finaliza las reservas vencidas.
- Errores uniformes con `ProblemDetail` (RFC 9457) y documentación OpenAPI con Swagger UI.

## Decisiones clave

- **El anti-solapamiento vive en la base, no en Java.** Un chequeo en código tiene condición de carrera, así que la garantía es una exclusion constraint de PostgreSQL (`EXCLUDE USING gist` sobre `tstzrange`).
- **Bloqueo pesimista por recurso.** El test de concurrencia destapó un deadlock. Ahora cada reserva bloquea primero su recurso con `SELECT ... FOR UPDATE`, y las de recursos distintos siguen en paralelo.
- **Tests contra PostgreSQL real con Testcontainers**, porque la restricción no existe en H2. El test de concurrencia lanza 30 solicitudes simultáneas y exige que se cree exactamente una reserva.
- **El usuario sale del token, nunca del body.** El JWT se valida con `oauth2-resource-server` y, en producción, la app no arranca si falta el secreto.
- **Estructura por feature**, migraciones con Flyway y un `Clock` inyectable para testear reglas de tiempo sin esperar.
