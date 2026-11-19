---
title: GitHub MCP Agent
summary: Servidor MCP que expone operaciones de GitHub como herramientas, para que un agente de IA cree repos, issues y commits a partir de instrucciones en lenguaje natural.
role: Proyecto de Henry · backend
stack: [Node.js, TypeScript, MCP SDK, Octokit, Zod, Vitest]
status: code-only
team: false
links:
  repo: https://github.com/valenberdev/mcp-github-agent
note: Solo código. Es un servidor MCP, no tiene interfaz visual.
order: 6
---

## Problema

Proyecto integrador de la especialización Backend de Henry: que un agente de IA pueda operar GitHub (crear repos, abrir issues, commitear) a partir de lenguaje natural.

## Qué hice

- 5 tools MCP sobre la API real de GitHub con Octokit: `create_repository`, `create_issue`, `list_repositories`, `create_commit` y `list_issues`.
- Validación de cada input con Zod antes de que llegue a GitHub.
- Clases de error propias que traducen los errores técnicos (401, 403, 404, 429, sin conexión) a mensajes que el agente puede explicar.
- Integración probada de punta a punta con Claude Desktop y MCP Inspector.

## Decisiones clave

- **Cliente de Octokit separado de las operaciones**, para mockearlo en los tests sin tocar la lógica.
- **Reintentos con backoff exponencial solo ante rate limit (429).** Los demás errores fallan enseguida.
- **Cada tool exporta su definición completa** (nombre, descripción, schema y handler), para que no se desincronicen.
- **32 tests con Vitest**: schemas, handlers, operaciones mockeadas, errores y reintentos.
