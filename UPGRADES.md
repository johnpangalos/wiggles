# Wiggles Dependency Upgrade Plan

Wiggles is a pnpm monorepo (web + api) whose dependencies have drifted significantly. This document tracks a phased upgrade plan organized by risk and dependency order.

**Last updated:** 2026-02-21

---

## Visual Regression Testing Harness

The project has visual regression tests using Vitest browser mode with Playwright (`toMatchScreenshot()`). These serve as the primary safety net for upgrades.

| Suite | Tests | Screenshots |
|-------|-------|-------------|
| `Feed.test.tsx` | 5 | `feed-empty-state`, `feed-with-posts`, `feed-single-post`, `feed-multiple-pages` |
| `Profile.test.tsx` | 4 | `profile-thumbnail-grid`, `profile-select-mode`, `profile-empty`, `profile-loading` |

**Workflow for each phase:**

1. **Before:** `pnpm --filter web test` — confirm all 9 tests pass and baselines are current
2. **After:** `pnpm --filter web test` — screenshot comparisons catch unintended visual changes
3. **If tests fail:** inspect diffs to determine if expected (e.g., Tailwind v4) or a regression
4. **Intentional changes:** update baselines with `pnpm --filter web test:update`, commit new `.vitest-attachments/` screenshots alongside the upgrade

---

## Phase 1: Low-risk cleanup and non-breaking bumps

- [ ] **Fix `.nvmrc`:** `16` → `20` (aligns with CLAUDE.md; Node 16 is EOL)
- [ ] **Remove `@types/react-router-dom@^5.1.7`** from `/web` devDeps (react-router-dom v6 ships its own types)
- [ ] **Update `compatibility_date`** in `wrangler.toml` and `wrangler-dev.toml` (`2022-09-11` → `2024-09-23` or later)
- [ ] **Fix Zustand import:** `import create from "zustand"` → `import { create } from "zustand"` in `web/src/hooks/useImageUpload.ts` (prerequisite for v5)
- [ ] **Fix lint-staged config:** remove unnecessary `"git add"` from command array in root `package.json`
- [ ] **Bump `prettier`:** `^3.0.1` → `^3.5`
- [ ] **Bump `postcss`:** `^8.4.31` → `^8.5`
- [ ] **Bump `autoprefixer`:** `^10.4.14` → `^10.4.20`
- [ ] **Bump `@types/node`:** `^20.4.6` → `^22`
- [ ] **Bump `@types/react`:** `^18.2.18` → `^18.3`
- [ ] **Bump `@types/react-dom`:** `^18.2.7` → `^18.3`

**Verify:**
```bash
pnpm run -r type-check          # no type errors
pnpm run -r lint                # no lint errors
pnpm --filter web test          # all 9 tests pass, screenshot baselines unchanged
pnpm --filter web build         # production build succeeds
```

---

## Phase 2: Contained major-version bumps ✅

### Tooling
- [x] **Removed `husky` and `lint-staged`** — removed from root `package.json` along with their config blocks. No `.husky` directory existed.
- [x] **Added `onlyBuiltDependencies`** to `pnpm-workspace.yaml` for `browser-tabs-lock`, `esbuild`, `sharp`, `workerd`.

### API-side
- [x] **`hono`:** `^3.3.4` → `^4.6.0` — Updated `api/src/utils/index.ts`: `request.headers` → `request.raw.headers`, `request.body` → `request.raw.body` (deprecated convenience properties removed in v4). Custom `MiddlewareHandler` type, `Context`, `cors`, `logger` all compatible without changes.
- [x] **`@cloudflare/workers-types`:** `^3.19.0` → `^4.20241230.0` — `KVNamespaceListResult` changed to discriminated union (`list_complete: true | false`). Updated `api/src/db/posts.ts` to narrow on `list_complete` before accessing `cursor`.
- [x] **`wrangler`:** `^3.4.0` → `^3.99.0`
- [x] **`toucan-js`:** `^3.2.1` → `^4.0.0` — No code changes needed; constructor options and `captureException` API unchanged.

### Web-side
- [x] **`zustand`:** `^4.4.0` → `^5.0.0` — Fixed default import to named import (`import { create } from "zustand"`) in `web/src/hooks/useImageUpload.ts`. The `create<T>()(fn)` pattern works as-is.
- [x] **`@tanstack/react-virtual`:** `3.0.0-beta.54` → `^3.11.0` (stable) — No code changes needed. `useVirtualizer` API identical.

### Additional fixes
- [x] **`api/src/handlers/posts.ts`:** Changed `c.json({ message: "No content" }, 204)` → `c.body(null, 204)` — Hono v4 correctly types 204 as non-contentful status.

**Verified:**
- `pnpm run -r type-check` — passes
- `pnpm --filter web test` — all 9 tests pass, screenshot baselines unchanged
- `pnpm --filter web build` — production build succeeds

---

## Phase 3: High-impact framework upgrades ✅

### 3A: Remove Sentry ✅
- [x] **Removed `@sentry/react` and `@sentry/tracing`** from `web/package.json`
- [x] **Removed `toucan-js`** from `api/package.json`
- [x] **Deleted `api/src/middleware/sentry.ts`**, removed sentry export from `api/src/middleware/index.ts`
- [x] **Cleaned `api/src/index.ts`** — removed sentry middleware usage
- [x] **Cleaned `web/src/index.tsx`** — removed `Sentry.init()`, `BrowserTracing`, `ErrorBoundary`
- [x] **Cleaned `web/src/App.tsx`** — removed `Sentry.withSentryReactRouterV6Routing`, using plain `Routes`
- [x] **Cleaned `api/src/types/index.ts`** — removed `RELEASE` and `ENV` bindings (only used by sentry)
- [x] **Cleaned CI workflows** — removed Sentry release steps from `deploy-api.yml`, `deploy-web.yml`, `preview-web.yml`; removed `VITE_RELEASE` env var
- [x] **Cleaned `web/src/env.d.ts`** — removed `VITE_RELEASE` type

### 3B: TanStack Query v4 → v5 ✅
- [x] **`@tanstack/react-query` + devtools:** `^4` → `^5`
- [x] `useInfinitePosts.ts` — converted to single-object API, added `initialPageParam`
- [x] `Profile.tsx` — converted `useQuery` and `useMutation` to object syntax, `invalidateQueries` now takes `{ queryKey }`
- [x] `Upload.tsx` — converted `useMutation` to object syntax
- [x] Renamed `status === "loading"` → `status === "pending"` in `Profile.tsx`, `Upload.tsx`, and `Profile.test.tsx`

### 3C: ESLint 8 → 9 + flat config ✅
- [x] **Deleted `.eslintrc.cjs`**, created `eslint.config.mjs` (flat config)
- [x] **Replaced** `@typescript-eslint/eslint-plugin` + `@typescript-eslint/parser` + `eslint-plugin-react` with unified `typescript-eslint` v8
- [x] **Updated `eslint-plugin-react-hooks`** to v5
- [x] **Updated `eslint`** to v9
- [x] Added test file override to allow `@typescript-eslint/no-explicit-any` in test files

### 3D: Tailwind CSS v3 → v4 ✅
- [x] **Deleted `tailwind.config.cjs`** and **`postcss.config.cjs`**
- [x] **Migrated to CSS-based config** in `web/src/styles/index.css` — `@import "tailwindcss"`, `@theme` for breakpoints, `@custom-variant pwa`
- [x] **Added `@tailwindcss/vite`** plugin to `vite.config.ts`
- [x] **Removed `autoprefixer` and `postcss`** from devDependencies (built into Tailwind v4)

**Verified after each sub-phase:**
- `pnpm run -r type-check` — passes
- `pnpm lint` — passes
- `pnpm test` — all 9 tests pass
- `pnpm build` — production build succeeds

---

## Phase 4: Future / evaluate carefully

- [ ] **React 18 → 19** — wait for ecosystem readiness (`react-feather` is unmaintained, Auth0 SDK needs testing). Replace `react-feather` with `lucide-react` first (same icons, maintained fork, 3 files / 5 icons).
- [ ] **`react-router-dom` v6 → v7** — update to latest v6 first (safe). v7 "library mode" is compatible but adds complexity.
- [ ] **Replace `@ssttevee/multipart-parser`** with native `Request.formData()` — available after `compatibility_date` > `2023-11-14`
- [ ] **Replace `uuid` with `crypto.randomUUID()`** — available in Node 20+ and CF Workers. Eliminates `uuid` + `@types/uuid`.
- [ ] **TypeScript `^5.1.6` → `^5.7`** — non-breaking, best done after other upgrades settle
- [ ] **`@auth0/auth0-react`** — keep on latest v2, monitor for v3

---

## Dependency ordering constraints

```
react-feather → lucide-react ──► React 19
compatibility_date ──────► native FormData, crypto.randomUUID()
```

---

## Key files

| File | Affected by |
|------|-------------|
| `web/src/index.tsx` | Sentry removal, TanStack Query v5 |
| `web/src/hooks/useInfinitePosts.ts` | TanStack Query v5 |
| `web/src/hooks/useImageUpload.ts` | Zustand import fix + v5 |
| `web/src/pages/Profile.tsx` | TanStack Query v5 |
| `web/src/pages/Upload.tsx` | TanStack Query v5 |
| `web/src/App.tsx` | Sentry removal |
| `web/src/pages/__tests__/Profile.test.tsx` | TanStack Query v5 (status rename) |
| `web/src/styles/index.css` | Tailwind v4 (CSS-based config) |
| `web/vite.config.ts` | Tailwind v4 (@tailwindcss/vite) |
| `api/src/types/index.ts` | Hono v4, workers-types v4, Sentry removal |
| `api/src/index.ts` | Sentry removal |
| `api/src/utils/index.ts` | Hono v4 (request.raw.*) |
| `api/src/db/posts.ts` | workers-types v4 (KVNamespaceListResult) |
| `api/src/handlers/posts.ts` | Hono v4 (c.body for 204) |
| `eslint.config.mjs` | ESLint 9 (new, replaces .eslintrc.cjs) |
| `.nvmrc` | Node version fix |
| `wrangler.toml` / `wrangler-dev.toml` | compatibility_date |
