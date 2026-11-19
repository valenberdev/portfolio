---
title: GitHub MCP Agent
summary: An MCP server that exposes GitHub operations as tools, so an AI agent can create repos, issues and commits from natural-language instructions.
role: Henry project · backend
stack: [Node.js, TypeScript, MCP SDK, Octokit, Zod, Vitest]
status: code-only
team: false
links:
  repo: https://github.com/valenberdev/mcp-github-agent
note: Code only. It's an MCP server, with no visual interface.
order: 6
---

## Problem

The capstone of Henry's Backend specialization: let an AI agent operate GitHub (create repos, open issues, commit) from natural language.

## What I built

- 5 MCP tools on the real GitHub API with Octokit: `create_repository`, `create_issue`, `list_repositories`, `create_commit` and `list_issues`.
- Zod validation of every input before it reaches GitHub.
- Custom error classes that turn technical errors (401, 403, 404, 429, no connection) into messages the agent can explain.
- End-to-end integration tested with Claude Desktop and MCP Inspector.

## Key decisions

- **The Octokit client is separate from the operations**, so tests can mock it without touching the logic.
- **Retries with exponential backoff only on rate limits (429).** Every other error fails right away.
- **Each tool exports its full definition** (name, description, schema and handler), so they can't drift apart.
- **32 Vitest tests**: schemas, handlers, mocked operations, errors and retries.
