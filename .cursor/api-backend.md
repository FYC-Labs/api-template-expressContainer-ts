---
description: TypeScript Express API on Cloud Run — routes vs services, lib vs utils, naming
globs: src/**/*.ts
alwaysApply: true
---

# API backend (TypeScript, Docker / Cloud Run)

This repo is a **TypeScript** Express app deployed as a **container on Google Cloud Run** (not Cloud Functions or Firebase `functions/`).

## Do not

- Reintroduce a `functions/src/**` Node layout or Postman under `functions/docs` from other templates. If a Postman collection is maintained, keep it in this repo (for example `docs/postman.json`) and update it in the same change as route changes.
- Put business rules or data access in route files, or shape public JSON in services without DTOs when the API has a clear response contract.

## Core separation (strict)

1. **Routes** (`src/routes/`)
   - **Only** HTTP: `Router`, params, query, body, status, call services, map results with **DTOs** for `res.json`.
   - **Not** Prisma, Firebase, or domain rules (delegate to services).
   - **Files** `*.routes.ts` per area. `index.ts` composes routes.

2. **Services** (`src/services/<domain>/`)
   - Business logic, orchestration, persistence for that domain.
   - `*.service.ts` — service functions. Prefer a **single object** for grouped inputs when the shape may grow. For updates, `update(id, updates)` is a good pattern.
   - `*.dto.ts` — API serialization (e.g. `renderOne`); no Express `Request` / `Response` types.
   - `*.service.test.ts` — Jest tests colocated with the service.

3. **`src/lib/` vs `src/utils/`** (separate)
   - **lib** — long-lived adapters: Prisma client, Firebase, external APIs. One concern per file.
   - **utils** — small generic or pure helpers, optional `*.utils.ts` suffix. No DB clients or app singletons.

4. **Middleware** — `src/routes/middlewares.ts` for shared middleware. Optional `src/middlewares/*.middleware.ts` for more reusable pieces.

5. **Types** — `src/types/` for Express augmentation and env.

## File naming

- Routes: `src/routes/<area>.routes.ts`
- Service: `src/services/<domain>/<domain>.service.ts`
- DTO: `src/services/<domain>/<domain>.dto.ts`
- Tests: `src/services/<domain>/<domain>.service.test.ts`
- Lib: `src/lib/<concern>.ts`
- Utils: `src/utils/<name>.ts` (or `*.utils.ts`)

Use `@src/...` imports per `tsconfig` paths.