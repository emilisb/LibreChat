# LibreChat

## Project Overview

LibreChat is a monorepo with the following key workspaces:

| Workspace | Language | Side | Dependency | Purpose |
|---|---|---|---|---|
| `/api` | JS (legacy) | Backend | `packages/api`, `packages/data-schemas`, `packages/data-provider`, `@librechat/agents` | Express server — minimize changes here |
| `/packages/api` | **TypeScript** | Backend | `packages/data-schemas`, `packages/data-provider` | New backend code lives here (TS only, consumed by `/api`) |
| `/packages/data-schemas` | TypeScript | Backend | `packages/data-provider` | Database models/schemas, shareable across backend projects |
| `/packages/data-provider` | TypeScript | Shared | — | Shared API types, endpoints, data-service — used by both frontend and backend |
| `/client` | TypeScript/React | Frontend | `packages/data-provider`, `packages/client` | Frontend SPA |
| `/packages/client` | TypeScript | Frontend | `packages/data-provider` | Shared frontend utilities |

## Base44 Dev Environment

### Architecture
- **Frontend**: Vite dev server (port 3090 inside container, mapped to host port 3000)
- **Backend**: Express/nodemon (port 3080), proxied via Vite's dev proxy at `/api` and `/oauth`
- **Database**: MongoDB 8.0 (no auth, internal only)

### Key Setup Notes
- The backend requires `client/dist/index.html` to exist even in dev mode (it serves the SPA in production). A minimal placeholder is created for dev.
- Packages must be built before backend/frontend start: `npx turbo run build --filter='!@librechat/frontend'`
- The `setup` service in docker-compose handles dependency installation and package builds; it's a one-shot service.
- Vite config was patched to support `VITE_ALLOWED_HOSTS=true` (boolean passthrough) and `BACKEND_HOST` env var for Docker networking.
- No external API keys are needed for the app to boot — AI provider keys default to `user_provided` which prompts users in the UI.

### How to Verify
```bash
curl http://localhost:3000/api/config  # Should return JSON with appTitle: "LibreChat"
curl http://localhost:3000/            # Should return Vite dev HTML with react-refresh
```

### Useful Commands
```bash
docker compose -f docker-compose.base44.yml up -d          # Start all services
docker compose -f docker-compose.base44.yml logs backend   # Check backend logs
docker compose -f docker-compose.base44.yml restart backend # Restart after backend code changes
```
