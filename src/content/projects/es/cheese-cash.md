---
title: Cheese Cash
summary: Billetera digital multi-moneda para viajeros, con compra, venta y conversión entre ARS, USD, EUR y Bitcoin a tasas reales. Proyecto final de Henry, en equipo.
role: Backend · equipo de 4
stack: [Node.js, Express, TypeScript, PostgreSQL, AWS SES, Vitest, React]
status: deploy-only
team: true
links:
  demo: https://cheesecash-frontend.vercel.app
note: Proyecto en equipo. Yo hice el backend.
order: 4
---

## Problema

Proyecto final de la carrera Full Stack de Henry: una billetera simulada para viajeros que maneje varias monedas con tasas reales, en 3 semanas y 2 sprints.

## Qué hice

Me encargué del backend:

- Modelo de datos, endpoints y transaccionalidad de las operaciones de compra, venta y conversión entre ARS, USD, EUR y Bitcoin.
- Tasas de cambio desde ExchangeRate-API con caché propio, y precio de Bitcoin desde CoinGecko.
- Emails transaccionales con AWS SES enviados desde el backend: comprobante después de cada operación y confirmación por mail para los montos altos, que se cancelan a las 2 horas si nadie los confirma.

En la demo los mails no se envían, porque la cuenta de AWS SES quedó en modo sandbox.

## Decisiones clave

- **Una tabla `wallets` entre usuarios y saldos**, pensada para soportar a futuro varias billeteras por usuario o billeteras compartidas.
- **`pg` con SQL explícito** en lugar de un ORM.
- **Primero los endpoints de usuario**, para que el frontend pudiera avanzar en paralelo, avisando al equipo cada cambio de contrato.
