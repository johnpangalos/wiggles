# Migrate to React Router 7 Framework Mode on Cloudflare

## Context

Wiggles is a pnpm monorepo with `/web` (React SPA) and `/api` (Hono Workers). We're merging into a single React Router 7 framework-mode app with SSR on Cloudflare. Auth moves from client-side Auth0 SDK to server-side OAuth2 code flow with cookie sessions.

Each step below is self-contained: implement it, verify it, then move to the next.

---

## Step 1: Scaffold project and install dependencies

**Goal**: Flat package with RR7+Cloudflare config files. `pnpm install` succeeds and `pnpm dev` boots.

**Do**:

- Delete `pnpm-workspace.yaml`
- Delete `web/package.json`, `api/package.json` and both `node_modules/` dirs (keep source files for copying later)
- Rewrite root `package.json` — merge all deps, add RR7 scripts
- Create `react-router.config.ts` — `ssr: true`, `future: { v8_viteEnvironmentApi: true }`
- Create `vite.config.ts` — cloudflare + tailwindcss + reactRouter plugins
- Create `wrangler.jsonc` — KV, R2 bindings, Auth0 vars (from `api/wrangler.jsonc`)
- Create `workers/app.ts` — Cloudflare entry with `createRequestHandler`
- Create `tsconfig.json` — paths `~/*` → `./app/*`
- Create minimal `app/root.tsx` — bare HTML shell with `<Outlet/>`
- Create `app/routes.ts` — empty route config
- Create `app/styles/index.css` — copy from `web/src/styles/index.css`
- Run `pnpm install`

**Verify**: `pnpm dev` starts without errors, visiting localhost shows the empty shell.

---

## Step 2: Root layout, entry points, and static assets

**Goal**: Full HTML shell with QueryClientProvider, service worker registration, public assets.

**Do**:

- Flesh out `app/root.tsx` — `<Meta/>`, `<Links/>`, `<Scripts/>`, `<ScrollRestoration/>`, `QueryClientProvider`, SW registration via `useEffect`
- Create `app/entry.client.tsx` — `hydrateRoot` with `<HydratedRouter/>`
- Copy `web/public/*` → `public/` (manifest.json, icons, sw.js, robots.txt)

**Verify**: `pnpm dev` renders the HTML shell, service worker registers, PWA manifest loads.

---

## Step 3: Types and DB layer (port from API)

**Goal**: Server-side data layer that talks directly to KV/R2 without Hono.

**Do**:

- Create `app/types/index.ts` — merge `Account`, `Post`, `NewPost` types, add `Env` interface
- Create `app/lib/db/accounts.ts` — port from `api/src/db/accounts.ts`, change `(c: WigglesContext)` → `(kv: KVNamespace, ...)`
- Create `app/lib/db/posts.ts` — port from `api/src/db/posts.ts`, same refactor
- Create `app/lib/utils.server.ts` — port `imageUrl()` (take `origin: string` instead of Hono context), port `parseFormData()`

**Verify**: `pnpm run type-check` passes (after `react-router typegen`).

---

## Step 4: Auth infrastructure (server-only)

**Goal**: Cookie sessions + Auth0 OAuth2 code flow helpers + RR7 middleware.

**Do**:

- Create `app/context.ts` — `userContext` via `createContext` (holds email, name, picture)
- Create `app/lib/session.server.ts` — `createCookieSessionStorage` with `SESSION_SECRET` from env
- Create `app/lib/auth.server.ts` — `getAuthorizationUrl()`, `exchangeCodeForTokens()`, `decodeIdToken()`, `getLogoutUrl()`
- Create `app/lib/require-session.server.ts` — helper for resource routes: read session cookie, throw redirect if missing
- Create `app/middleware/auth.ts` — RR7 middleware: reads session → sets `userContext`, redirects to `/login` if missing

**Verify**: Type-check passes.

---

## Step 5: Auth routes

**Goal**: Login/callback/logout routes work end-to-end with Auth0.

**Do**:

- Create `app/routes/login.tsx` — loader redirects to Auth0 `/authorize`
- Create `app/routes/auth.callback.tsx` — loader exchanges code for tokens, creates session, redirects to `/feed`
- Create `app/routes/auth.logout.tsx` — action destroys session, redirects to Auth0 `/v2/logout`
- Update `app/routes.ts` with auth route definitions

**Verify**: `pnpm dev` → visit `/login` → Auth0 redirect → callback creates cookie → `/feed` loads (empty) → logout clears session.

---

## Step 6: Move UI components and hooks

**Goal**: All frontend components available under `app/components/` and `app/hooks/`.

**Do**:

- Copy `web/src/components/*` → `app/components/` — update `@/` → `~/` imports
- Copy `web/src/hooks/*` → `app/hooks/` — update imports
- Copy `web/src/layouts/main.tsx` → `app/components/BottomNavigation.tsx` (extract BottomNav only)
- Update `useInfinitePosts`: remove `getAuthHeaders()`, use relative URL `/api/posts`, accept optional `initialData`
- Remove all `getAuthHeaders()` usage (cookies auto-sent)
- Remove `web/src/utils/index.ts` token accessor (no longer needed)
- Copy `web/src/register-sw.ts` → `app/lib/register-sw.ts`

**Verify**: Type-check passes (components won't render yet since routes aren't wired up).

---

## Step 7: Resource routes (API replacements)

**Goal**: All API endpoints work as RR7 resource routes.

**Do**:

- Create `app/routes/api.images.$key.ts` — port from `api/src/handlers/images.ts` (no auth, R2 + image resizing)
- Create `app/routes/api.posts.ts` — port `GetPosts`, validate session via `requireSession()`
- Create `app/routes/api.upload.ts` — port `PostUpload`, validate session, upload to R2
- Create `app/routes/api.bulk-delete.ts` — port `DeletePosts`, validate session
- Update `app/routes.ts` with resource route definitions

**Verify**: `curl` the endpoints (with valid session cookie) returns correct JSON / image data.

---

## Step 8: Page routes

**Goal**: All pages render with SSR and client-side interactivity.

**Do**:

- Create `app/routes/_main.tsx` — layout with auth middleware, `<Outlet/>` + `<BottomNavigation/>`
- Create `app/routes/_main._index.tsx` — redirect to `/feed`
- Create `app/routes/_main.feed.tsx` — loader fetches first page from KV, component uses `useInfiniteQuery` with `initialData`
- Create `app/routes/_main.upload.tsx` — client-side preview + upload to `/api/upload`
- Create `app/routes/_main.profile.tsx` — loader fetches user posts, React Query pagination, bulk delete
- Create `app/routes/catchall.tsx` — redirect to `/feed`
- Update `app/routes.ts` with all route definitions

**Verify**: Full app works — feed loads with SSR, infinite scroll, upload, profile, delete, logout.

---

## Step 9: Tests

**Goal**: Existing tests pass with updated imports.

**Do**:

- Copy `web/src/pages/__tests__/*` → `app/routes/__tests__/`
- Update imports, remove `@auth0/auth0-react` mocks
- Update test setup for new data flow
- Re-baseline visual regression screenshots

**Verify**: `pnpm test` passes.

---

## Step 10: Cleanup

**Goal**: Remove old code, update project docs and CI.

**Do**:

- Delete `/web/` and `/api/` directories entirely
- Create `eslint.config.mjs` at root — lint `./app`
- Update `CLAUDE.md` for new architecture
- Update `.github/` workflows for single-package deploy
- Update `.gitignore`

**Verify**: `pnpm build && pnpm run type-check && pnpm run lint` all pass.

---

## Key Files Reference

| Source (current)             | Destination (new)                              |
| ---------------------------- | ---------------------------------------------- |
| `api/src/db/posts.ts`        | `app/lib/db/posts.ts`                          |
| `api/src/db/accounts.ts`     | `app/lib/db/accounts.ts`                       |
| `api/src/handlers/images.ts` | `app/routes/api.images.$key.ts`                |
| `api/src/handlers/posts.ts`  | `app/routes/api.{posts,upload,bulk-delete}.ts` |
| `api/src/utils/index.ts`     | `app/lib/utils.server.ts`                      |
| `web/src/components/*`       | `app/components/*`                             |
| `web/src/hooks/*`            | `app/hooks/*`                                  |
| `web/src/styles/index.css`   | `app/styles/index.css`                         |
| `web/src/pages/Feed.tsx`     | `app/routes/_main.feed.tsx`                    |
| `web/src/pages/Profile.tsx`  | `app/routes/_main.profile.tsx`                 |
| `web/src/pages/Upload.tsx`   | `app/routes/_main.upload.tsx`                  |
| `web/src/layouts/main.tsx`   | `app/components/BottomNavigation.tsx`          |
| `web/public/*`               | `public/*`                                     |
