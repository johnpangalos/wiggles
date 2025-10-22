# Repository Guidelines

## Project Structure & Module Organization
- `app/` — React Router code: routes (`app/routes/*.tsx`), root layout (`app/root.tsx`), server entry (`app/entry.server.tsx`), and global styles (`app/app.css`).
- `workers/` — Cloudflare Worker entry (`workers/app.ts`) that delegates requests to React Router.
- `public/` — Static assets served in preview/production.
- Config: `wrangler.jsonc` (deployment/env), `vite.config.ts` (plugins: Cloudflare, Tailwind, React Router), `tsconfig*.json` (strict TS), `.react-router/` (generated types).

## Build, Test, and Development Commands
- `pnpm install` — Install deps; runs Cloudflare type generation postinstall.
- `pnpm dev` — Start dev server with HMR via React Router.
- `pnpm build` — Create production server/client bundles.
- `pnpm preview` — Serve the built app locally.
- `pnpm deploy` — Build and deploy using Wrangler.
- `pnpm typecheck` — Generate types and run TypeScript in build mode.
- `pnpm cf-typegen` — Regenerate Cloudflare Worker types.

## Coding Style & Naming Conventions
- Language: TypeScript (strict), ES2022 modules, React 19, React Router 7.
- Indentation: 2 spaces; prefer functional components and named exports.
- Routes: place in `app/routes/` and mirror URLs (e.g., `app/routes/home.tsx` → `/home`).
- Styling: Tailwind-first; keep global CSS in `app/app.css`.
- Imports: use `~/*` alias for `app/*`; keep relative paths short and clear.

## Testing Guidelines
- This template does not include tests yet. If adding tests:
  - Use Vitest + React Testing Library for units/components.
  - Name files `*.test.ts(x)` alongside sources or under `app/__tests__/`.
  - Add a `test` script (`vitest run`) and ensure CI-friendly, deterministic runs.

## Commit & Pull Request Guidelines
- Commits: imperative present, scoped and concise.
  - Examples: `feat(app): add profile route`, `chore(build): update wrangler`.
- PRs: include a summary, linked issues, verification steps, screenshots for UI changes, and a Cloudflare preview URL when applicable.

## Security & Configuration Tips
- Do not commit secrets. Use `wrangler secret put NAME` for sensitive values.
- Non-secret env values live in `wrangler.jsonc` under `vars` and are available via `context.cloudflare.env.NAME` (see usage in `app/routes/home.tsx`).
