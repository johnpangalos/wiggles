# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

This is a pnpm workspace with two packages: `web` (React frontend) and `api` (Cloudflare Worker).

### Root level commands:
- `pnpm dev` - Start development servers for both web and api
- `pnpm lint` - Run linting across all packages

### Web package (React frontend):
- `pnpm --filter web dev` - Start Vite dev server
- `pnpm --filter web build` - Build for production
- `pnpm --filter web preview` - Preview staging build
- `pnpm --filter web lint` - ESLint with auto-fix
- `pnpm --filter web type-check` - TypeScript type checking

### API package (Cloudflare Worker):
- `pnpm --filter api dev` - Start Wrangler dev server with remote mode
- `pnpm --filter api type-check` - TypeScript type checking

## Architecture

### Web Frontend (React/Vite)
- **Stack**: React 18, TypeScript, TailwindCSS, Vite
- **State Management**: Zustand for app state, React Query for server state
- **Router**: React Router v6
- **UI Components**: Custom components in `src/components/`
- **Pages**: Feed, Login, Upload, Profile
- **Hooks**: Custom hooks in `src/hooks/` for breakpoints, image upload, infinite posts
- **Auth**: JWT-based authentication with Cloudflare Access
- **Error Monitoring**: Sentry integration

### API Backend (Cloudflare Worker)
- **Framework**: Hono for HTTP routing
- **Storage**: Cloudflare KV for data persistence
- **Auth**: Cloudflare Access JWT validation middleware
- **Handlers**: Organized in `src/handlers/` for posts, accounts, uploads
- **Database**: Custom database abstraction in `src/db/`
- **Middleware**: Authentication, Sentry error tracking, logging

### Key Integrations
- **Cloudflare KV**: Data storage (binding: "WIGGLES")
- **Cloudflare Access**: Authentication provider
- **Sentry**: Error monitoring for both frontend and backend
- **Service Worker**: PWA functionality with manual registration

## File Structure Notes
- Both packages use path aliases (`@/` maps to `src/`)
- Web package uses Vite for bundling and dev server
- API uses Wrangler for Cloudflare Worker deployment
- Shared TypeScript configuration and ESLint rules at workspace root
- Husky + lint-staged for pre-commit hooks
