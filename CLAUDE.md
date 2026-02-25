# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Wiggles is a full-stack image sharing PWA built with React Router v7 framework mode on Cloudflare Workers.

- **`/app`** — React Router v7 application (routes, components, hooks, server-side logic)
- **`/workers`** — Cloudflare Workers entry point
- **`/public`** — Static assets (icons, manifest, service worker)

## Commands

### Install & Dev

```bash
pnpm install                    # install all dependencies
pnpm dev                        # start dev server (react-router dev + workerd)
```

### Build & Type Check

```bash
pnpm build                      # production build
pnpm type-check                 # react-router typegen + tsc
```

### Lint

```bash
pnpm lint                       # lint app/ directory
```

### Test

```bash
pnpm test                       # run tests once (Vitest + Playwright browser)
pnpm test:watch                 # watch mode
pnpm test:update                # update snapshots
```

## Architecture

### App (`/app`)

- **Framework:** React Router v7 framework mode with SSR on Cloudflare Workers
- **Routing:** File-based routes in `app/routes/` — `/feed`, `/login`, `/upload`, `/profile`
- **Server state:** TanStack React Query v5 with infinite scroll pagination
- **Local state:** Zustand (image upload store)
- **Auth:** Auth0 OAuth code flow with server-side cookie sessions
- **Styling:** TailwindCSS v4 with custom PWA standalone variant
- **Path alias:** `~/` maps to `./app`
- **Entry:** `workers/app.ts` → `app/root.tsx`

### Server-side (`/app/lib`)

- **Storage:** Cloudflare KV with key patterns: `account-{email}`, `post-feed-{ts}`, `post-account-{email}-{ts}`
- **Images:** Upload to R2 bucket, serve with Cloudflare Image Resizing
- **Auth:** Auth0 authorization code flow, cookie session via `createCookieSessionStorage`
- **DB layer:** `app/lib/db/accounts.ts`, `app/lib/db/posts.ts`
- **Config:** `wrangler.jsonc` (secrets via `wrangler secret` or `.dev.vars`)

### Key Patterns

- Posts use cursor-based pagination (timestamp keys in KV)
- Feed uses `@tanstack/react-virtual` for virtualized scrolling
- Layout route `_main.tsx` acts as auth guard (redirects to /login if no session)
- Resource routes (`api.*`) replace the old Hono API handlers
- Image URLs are served via `/api/images/:key` with optional resize params

## Git

- Always use `--no-gpg-sign` when committing

## Code Style

- TypeScript strict mode everywhere
- Unused variables must be prefixed with `_`
- ESLint with react-hooks and @typescript-eslint plugins
- Husky pre-commit hooks run lint-staged
- Node 20 (see `.nvmrc`)
