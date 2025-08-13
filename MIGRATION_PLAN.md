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

## Migration Status

### ✅ Phase 1: COMPLETED
**Goal**: Set up unified Worker configuration and build process

**Actual Implementation:**
1. ✅ **Wrangler Configuration Updated**
   - Added `assets` section with `directory = "../web/dist"`
   - Configured `not_found_handling = "single-page-application"`
   - Set `binding = "ASSETS"` and `run_worker_first = ["/api/*"]`
   - Created separate development KV namespace for testing

2. ✅ **Build Process Integrated**
   - Root package.json already had unified scripts
   - Web builds to `web/dist/` which Worker assets reference
   - Development workflow supports `pnpm dev:unified`

3. ✅ **Worker Entry Point Ready**
   - Unified Worker already implemented in `api/src/index.ts`
   - All API routes preserved: `/api/posts`, `/api/me`, `/api/upload`, `/api/bulk-delete`
   - Fallback route serves SPA: `app.get('*', async (c) => c.env.ASSETS.fetch(c.req.raw))`

4. ✅ **Development Testing Environment**
   - Added debug authentication bypass for development
   - Created separate KV namespace: `WIGGLES_DEV` (ID: `a884d6ec4f0740f1acb1fcab72096746`)
   - Populated with test data for safe API endpoint testing
   - Fixed API endpoint bugs: query parameter handling, key format mismatches

**Key Discoveries:**
- Phase 1 was largely already implemented in the codebase
- Main work involved setting up safe development environment
- Found and fixed minor bugs in API endpoints during testing
- Confirmed all major functionality works: auth bypass, API routes, SPA serving

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
binding = "ASSETS"
not_found_handling = "single-page-application"
run_worker_first = ["/api/*"]
```

### Worker Entry Point Structure
```typescript
// Existing API routes with middleware
app.use("/api/*", auth());
app.use("/api/*", logger());
app.use("/api/*", sentry(/* config */));

app.get("/api/posts", GetPosts);
app.get("/api/me", GetMe);
app.post("/api/upload", PostUpload);
app.post("/api/bulk-delete", DeletePosts);

// Serve SPA for all other routes
app.get('*', async (c) => {
  return c.env.ASSETS.fetch(c.req.raw);
});
```

### Build Process
```json
{
  "scripts": {
    "build": "cd web && pnpm build && cd ../api && pnpm deploy",
    "build:web": "cd web && pnpm build",
    "build:api": "cd api && pnpm deploy", 
    "dev:unified": "pnpm build:web && cd api && pnpm dev",
    "dev": "Start development servers for both web and api"
  }
}
```

## Benefits After Migration

- **Simplified Deployment**: Single command deploys entire application
- **Unified Development**: Single dev server for both frontend and backend
- **Better Performance**: Assets served from same edge locations as API
- **Reduced Complexity**: No need to coordinate separate deployments
- **Cost Optimization**: Single Worker instance instead of separate services

## Phase 1 Implementation Summary

### ✅ What Was Completed
- **Unified Worker Configuration**: Assets serving properly configured
- **API Endpoint Testing**: All endpoints verified working with test data
- **Development Environment**: Safe testing setup with separate KV namespace  
- **Authentication Debug Mode**: Development bypass implemented
- **Bug Fixes**: Query parameter handling and key format issues resolved

### 🔧 Technical Details
- **Development KV**: `WIGGLES_DEV` namespace (ID: `a884d6ec4f0740f1acb1fcab72096746`)
- **Preview KV**: Separate preview namespace (ID: `96652f6d962a4712a239304868414da2`)
- **Debug Auth**: `x-debug-bypass: true` header bypasses authentication in development
- **Asset Serving**: React SPA served from `web/dist/` via Worker assets
- **API Routes**: All preserved and functional (`/api/posts`, `/api/me`, `/api/upload`, `/api/bulk-delete`)

### 🚀 Current Status
**Phase 1 is COMPLETE and ready for Phase 2**
- Unified Worker is fully functional
- Both API and SPA serving correctly
- Development environment is safe and isolated
- All major functionality verified

## Next Steps (Phase 2)
Focus on:
- Comprehensive integration testing
- Production deployment validation
- Performance optimization
- Cleanup of development artifacts

## Rollback Plan

If issues arise, can quickly rollback by:
1. Reverting to previous Wrangler configuration
2. Re-deploying `web/` package separately
3. Using git to restore previous working state
4. Switching back to separate development workflows
5. Restoring original KV namespace configuration