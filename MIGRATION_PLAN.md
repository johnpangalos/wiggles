# Migration Plan: Single Cloudflare Worker Full-Stack Architecture

## Overview

Migrating from the current dual-package structure (separate `web/` and `api/`) to a unified Cloudflare Worker that serves both the React SPA and API endpoints, following the patterns described in [Cloudflare's full-stack development blog post](https://blog.cloudflare.com/sv-se/full-stack-development-on-cloudflare-workers/).

## Current State

- **Frontend**: React SPA in `web/` package built with Vite
- **Backend**: Cloudflare Worker in `api/` package using Hono
- **Deployment**: Separate deployments for static assets and API
- **Routing**: React Router for frontend, Hono for API routes

## Target State

- **Unified Worker**: Single Cloudflare Worker serving both frontend assets and API
- **SPA Mode**: Wrangler configured to serve React build output
- **Routing**: Worker handles `/api/*` routes, serves SPA for all other routes
- **Deployment**: Single `wrangler deploy` command

## Migration Phases

### Phase 1: Prepare Structure
**Goal**: Set up unified Worker configuration and build process

1. **Update Wrangler Configuration**
   - Add `assets` configuration pointing to web build output
   - Enable SPA mode for client-side routing
   - Update compatibility date and Worker settings

2. **Restructure Build Process**
   - Modify root package.json scripts for unified build
   - Configure web build to output to Worker-accessible location
   - Update development workflow for integrated local dev

3. **Prepare Worker Entry Point**
   - Create new unified Worker entry that handles both assets and API
   - Import existing API handlers and middleware
   - Add fallback to serve SPA for non-API routes

### Phase 2: Unified Routing
**Goal**: Implement routing that serves both API and frontend

4. **Modify Worker Routing**
   - Keep existing `/api/*` routes for backend functionality
   - Add catch-all route that serves `index.html` for SPA routes
   - Ensure proper MIME types for static assets

5. **Test API Endpoints**
   - Verify all existing API routes work (`/api/posts`, `/api/me`, etc.)
   - Test authentication middleware still functions
   - Confirm KV storage integration remains intact

6. **Validate Frontend Routing**
   - Test React Router handles client-side navigation
   - Verify deep linking works (direct URL access)
   - Confirm service worker registration still functions

### Phase 3: Integration
**Goal**: Unify development and deployment workflows

7. **Update Development Workflow**
   - Modify `pnpm dev` to use unified Worker dev server
   - Configure Vite build to output to correct location
   - Test hot reloading and development experience

8. **Unified Deployment**
   - Test single `wrangler deploy` deploys both frontend and API
   - Verify production builds work correctly
   - Update environment variables and secrets

9. **Integration Testing**
   - Test authentication flow end-to-end
   - Verify file upload functionality
   - Test all page routes (feed, upload, profile)

### Phase 4: Cleanup
**Goal**: Remove redundant configurations and update documentation

10. **Remove Separate Configurations**
    - Remove `web/` specific deployment configs
    - Clean up unused build scripts
    - Update workspace package.json dependencies

11. **Update Documentation**
    - Modify CLAUDE.md for new unified architecture
    - Update development commands
    - Document new deployment process

## Key Configuration Changes

### Wrangler Configuration (api/wrangler.toml)
```toml
[assets]
directory = "../web/dist"
single-page-application = true
```

### Worker Entry Point Structure
```typescript
// Handle API routes
app.route('/api', apiRouter)

// Serve SPA for all other routes
app.get('*', async (c) => {
  // Let Wrangler's assets handling serve the SPA
  return c.env.ASSETS.fetch(c.req.url)
})
```

### Build Process
```json
{
  "scripts": {
    "build": "cd web && pnpm build && cd ../api && wrangler deploy",
    "dev": "cd api && wrangler dev"
  }
}
```

## Benefits After Migration

- **Simplified Deployment**: Single command deploys entire application
- **Unified Development**: Single dev server for both frontend and backend
- **Better Performance**: Assets served from same edge locations as API
- **Reduced Complexity**: No need to coordinate separate deployments
- **Cost Optimization**: Single Worker instance instead of separate services

## Rollback Plan

If issues arise, can quickly rollback by:
1. Reverting to previous Wrangler configuration
2. Re-deploying `web/` package separately
3. Using git to restore previous working state
4. Maintaining separate development workflows temporarily