# LibreChat – Dev Environment Notes

## Architecture
- **Monorepo** with npm workspaces: `api/`, `client/`, `packages/*`
- Packages (`data-provider`, `data-schemas`, `api`, `client`) must be built before the app runs: `npm run build:packages`
- The client (Vite/React) must also be built (`cd client && npm run build`) because the API reads `client/dist/index.html` at startup via `fs.readFileSync`.
- In dev mode, a Vite dev server on port 3090 proxies `/api` and `/oauth` to the backend on port 3080 (same container).

## Running
```bash
docker compose -f docker-compose.base44.yml up -d
```
- The `setup` service installs deps and builds packages + client, then exits.
- The `app` service starts the Node.js API backend (port 3080) and then the Vite dev server (port 3090, mapped to host port 3000).
- MongoDB and MeiliSearch run as infrastructure services.

## Key env vars
- `HOST=0.0.0.0` – bind address for both API and Vite
- `BACKEND_HOST` / `BACKEND_PORT` – used by Vite config to set the proxy target (added for Docker compatibility)
- `VITE_ALLOWED_HOSTS=all` – allows external hostname access (modified vite.config.ts to support `"all"` → `true`)
- `DOMAIN_CLIENT` / `DOMAIN_SERVER` – set to the public preview URL

## Vite config modifications
- `client/vite.config.ts`: Added `BACKEND_HOST` env var for proxy target (separate from `HOST` which sets bind address). Added `VITE_ALLOWED_HOSTS=all` support to set `allowedHosts: true`.

## External secrets
- No AI provider API keys are required to boot – the app runs without them (users configure providers after login).
- If the user wants to pre-configure AI providers, they can set `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GOOGLE_KEY`, etc. via `/run/base44/app.env`.

## Verification
- `curl http://localhost:3000/` returns Vite-served HTML with React hot-reload
- `curl http://localhost:3000/api/config` returns JSON app config via the Vite proxy
