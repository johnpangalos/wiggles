# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Wiggles is a full-stack image sharing PWA. It's a pnpm monorepo with two packages:

- **`/api`** — Cloudflare Workers backend using Hono, with KV for storage and Cloudflare Images for media
- **`/web`** — React 18 frontend using Vite, TailwindCSS, and React Router v6

## Commands

### Install & Dev

```bash
pnpm install                    # install all dependencies
pnpm --filter web dev           # start frontend dev server (Vite)
pnpm --filter api dev           # start API dev server (wrangler dev --remote)
```

### Build & Type Check

```bash
pnpm --filter web build         # production build of frontend
pnpm run -r type-check          # typecheck all packages
```

### Lint

```bash
pnpm run -r lint                # lint all packages
```

### Test (web only)

```bash
pnpm --filter web test          # run tests once (Vitest + Playwright browser)
pnpm --filter web test:watch    # watch mode
pnpm --filter web test:update   # update snapshots
```

## Architecture

### Frontend (`/web/src`)

- **Routing:** React Router v6 — routes: `/feed`, `/login`, `/upload`, `/profile`
- **Server state:** TanStack React Query v4 with infinite scroll pagination
- **Local state:** Zustand (image upload store)
- **Auth:** Google OAuth ID tokens stored in localStorage, validated via `RequireAuth` wrapper
- **Styling:** TailwindCSS with custom PWA standalone variant
- **Path alias:** `@/` maps to `./src`
- **Entry:** `index.tsx` → `App.tsx`

### Backend (`/api/src`)

- **Framework:** Hono with middleware pattern (auth, sentry)
- **Storage:** Cloudflare KV with key patterns: `account-{email}`, `post-feed-{ts}`, `post-account-{email}-{ts}`
- **Images:** Upload to Cloudflare Images API, deliver via HMAC-signed URLs cached in KV
- **Auth middleware:** Validates Google JWT RS256 signatures against Google's public keys
- **Config:** `wrangler.toml` (prod), `wrangler-dev.toml` (dev)

### Key Patterns

- Posts use cursor-based pagination (timestamp keys in KV)
- Feed uses `@tanstack/react-virtual` for virtualized scrolling
- Image URLs are signed with HMAC and expire after 1 day

## Code Style

- TypeScript strict mode everywhere
- Unused variables must be prefixed with `_`
- ESLint with react-hooks and @typescript-eslint plugins
- Husky pre-commit hooks run lint-staged
- Node 20 (see `.nvmrc`)
