---
description: Pointer and Postman note for the Express/Cloud Run TypeScript API
globs: src/**/*.ts
alwaysApply: false
---

# Backend conventions

**Authoritative rules:** [`.cursor/rules/api-backend.mdc`](rules/api-backend.mdc) (always apply). They cover TypeScript, **Docker / Cloud Run** (not Cloud Functions), **routes vs services**, **`lib` vs `utils`**, and **naming** (`*.routes.ts`, `*.service.ts`, `*.dto.ts`, colocated `*.service.test.ts` per domain).

## Postman (optional)

If the repo keeps a single maintained collection (for example `docs/postman.json`), **update it in the same change** when you add, remove, or change routes or auth-related middleware. Use Collection v2.1, match methods and paths, and document auth in request descriptions.

## Object arguments for service calls

Prefer **one object** for grouped inputs (payloads, filters, options) when it keeps call sites clear. For **updates**, a common pattern is `update(id, updates)`.