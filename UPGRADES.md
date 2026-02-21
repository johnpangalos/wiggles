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

## Phase 2: Contained major-version bumps

### Tooling
- [ ] **`husky`:** `^8` → `^9` (simplified hook file format, no app code changes)
- [ ] **`lint-staged`:** `^13` → `^15` (drops Node 16 support, config format unchanged)

### API-side
- [ ] **`hono`:** `^3.3.4` → `^4` — 6 files import from Hono; API is largely compatible. Check custom `MiddlewareHandler` type in `api/src/types/index.ts` against Hono v4's built-in type.
- [ ] **`@cloudflare/workers-types`:** `^3.19.0` → `^4` — types-only, no runtime impact. Verify `WigglesEnv` type and `cf` fetch options.
- [ ] **`wrangler`:** `^3.4.0` → latest v3 first, then evaluate v4. Review [v4 migration guide](https://developers.cloudflare.com/workers/wrangler/migration/update-v3-to-v4/).
- [ ] **`toucan-js`:** `^3.2.1` → `^4` — only used in `api/src/middleware/sentry.ts`. Aligns with Sentry v8 SDK.

### Web-side
- [ ] **`zustand`:** `^4.4.0` → `^5` — after Phase 1 import fix, the `create<T>()(fn)` pattern works as-is. 1 file affected.
- [ ] **`@tanstack/react-virtual`:** `3.0.0-beta.54` → `^3.11` (stable) — API matches current usage, no code changes expected. Used in `Feed.tsx` and `Profile.tsx`.

**Verify:**
```bash
pnpm run -r type-check          # no type errors
pnpm run -r lint                # no lint errors
pnpm --filter web test          # screenshot tests catch visual regressions from react-virtual stable
pnpm --filter web build         # production build succeeds
pnpm --filter api dev           # manual API smoke test
```

> **Note:** `@tanstack/react-virtual` stable may cause minor layout shifts in Feed/Profile — if screenshot tests fail, inspect diffs before updating baselines.

---

## Phase 3: High-impact framework upgrades

### 3A: Sentry v7 → v8
- [ ] **`@sentry/react`:** `^7` → `^8`, **remove `@sentry/tracing`** (deprecated)
- Files: `web/src/index.tsx`, `web/src/App.tsx`
- Replace `new BrowserTracing(...)` with `Sentry.browserTracingIntegration()`
- Replace `Sentry.reactRouterV6Instrumentation()` with `Sentry.reactRouterV6BrowserTracingIntegration()`
- Visual impact: None expected (infrastructure-only)

### 3B: TanStack Query v4 → v5
- [ ] **`@tanstack/react-query` + devtools:** `^4` → `^5`
- Files: `web/src/hooks/useInfinitePosts.ts`, `web/src/pages/Profile.tsx`, `web/src/pages/Upload.tsx`, `web/src/index.tsx`, test files
- Convert 3-argument `useInfiniteQuery(key, fn, opts)` → single-object `useInfiniteQuery({ queryKey, queryFn, ... })`
- Convert `useQuery(key, fn)` → `useQuery({ queryKey, queryFn })`
- Convert `useMutation(fn, opts)` → `useMutation({ mutationFn, ... })`
- Rename `status === "loading"` → `status === "pending"` (source + tests)
- Add required `initialPageParam` to infinite queries
- Visual impact: None (UI identical), but test assertions need updating for status rename

### 3C: ESLint 8 → 9 + typescript-eslint v6 → v8
- [ ] Migrate `.eslintrc.cjs` → `eslint.config.js` (flat config)
- [ ] Update `eslint-plugin-react-hooks` to v5 (flat config support)
- [ ] Replace `@typescript-eslint/eslint-plugin` + `parser` with unified `typescript-eslint` package
- Visual impact: None (tooling-only)

### 3D: Tailwind CSS v3 → v4
- [ ] Run `@tailwindcss/upgrade` codemod
- [ ] Migrate `tailwind.config.cjs` → CSS-based `@theme` directives
- [ ] Migrate custom PWA variant plugin to `@custom-variant` syntax
- [ ] Replace PostCSS plugin with `@tailwindcss/vite` Vite plugin
- [ ] Remove `autoprefixer` (built into Tailwind v4)
- Visual impact: **Highest risk.** CSS output may differ. Run screenshot tests after migration and carefully review diffs. Update baselines only after confirming changes are acceptable.

**Verify after each sub-phase (3A, 3B, 3C, 3D):**
```bash
pnpm run -r type-check
pnpm run -r lint
pnpm --filter web test          # screenshot tests critical for 3B and 3D
pnpm --filter web build
```

---

## Phase 4: Future / evaluate carefully

- [ ] **React 18 → 19** — wait for ecosystem readiness (`react-feather` is unmaintained, Auth0 SDK needs testing). Replace `react-feather` with `lucide-react` first (same icons, maintained fork, 3 files / 5 icons).
- [ ] **`react-router-dom` v6 → v7** — update to latest v6 first (safe). v7 "library mode" is compatible but adds complexity. Depends on Sentry v8 router integration.
- [ ] **Replace `@ssttevee/multipart-parser`** with native `Request.formData()` — available after `compatibility_date` > `2023-11-14`
- [ ] **Replace `uuid` with `crypto.randomUUID()`** — available in Node 20+ and CF Workers. Eliminates `uuid` + `@types/uuid`.
- [ ] **TypeScript `^5.1.6` → `^5.7`** — non-breaking, best done after other upgrades settle
- [ ] **`@auth0/auth0-react`** — keep on latest v2, monitor for v3

---

## Dependency ordering constraints

```
.nvmrc fix ──────────────► lint-staged v15, wrangler v4
Zustand import fix ──────► Zustand v5
Sentry v8 (web) ─── pair with ─── toucan-js v4 (api)
react-feather → lucide-react ──► React 19
All Phase 2+3 ───────────► React 19
compatibility_date ──────► native FormData, crypto.randomUUID()
workers-types v4 ── pair with ── wrangler v4
```

---

## Key files

| File | Affected by |
|------|-------------|
| `web/src/index.tsx` | Sentry v8, TanStack Query v5 |
| `web/src/hooks/useInfinitePosts.ts` | TanStack Query v5 |
| `web/src/hooks/useImageUpload.ts` | Zustand import fix + v5 |
| `web/src/pages/Profile.tsx` | TanStack Query v5 |
| `web/src/pages/Upload.tsx` | TanStack Query v5 |
| `web/src/App.tsx` | Sentry v8 |
| `web/src/pages/__tests__/Feed.test.tsx` | TanStack Query v5 (status rename) |
| `web/src/pages/__tests__/Profile.test.tsx` | TanStack Query v5 (status rename) |
| `api/src/types/index.ts` | Hono v4, workers-types v4 |
| `api/src/middleware/sentry.ts` | toucan-js v4 |
| `.eslintrc.cjs` | ESLint 9 (delete + replace) |
| `web/tailwind.config.cjs` | Tailwind v4 (delete + replace) |
| `.nvmrc` | Node version fix |
| `wrangler.toml` / `wrangler-dev.toml` | compatibility_date, wrangler v4 |
