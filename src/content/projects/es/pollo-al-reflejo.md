---
title: Pollo Al Reflejo
summary: Sistema de gestión para una rotisería real, que va a reemplazar el software que usa hoy el negocio. Lo desarrollamos en equipo y yo hago el backend.
role: Backend · equipo de 4
stack: [Node.js, Express, TypeScript, PostgreSQL, Docker, React]
status: in-progress
team: true
links: {}
note: En desarrollo. Yo hago el backend.
order: 7
---

## Problema

La rotisería Pollo Al Reflejo necesita reemplazar el software de gestión que usa hoy por uno hecho a su medida.

## Qué hago

- Arquitectura y configuración del backend en TypeScript, entorno con Docker y modelo de datos junto al responsable de producto.

## Decisiones clave

- **Multi-negocio desde el inicio.** Cada método de los repositorios recibe el `businessId` como primer parámetro obligatorio, y un test verifica el aislamiento entre dos negocios.
- **`pg` con SQL explícito**, sin ORM.
- **Migraciones solo hacia adelante**, sin rollback.
