See CLAUDE.md.

When adding or changing code that mutates user documents, invalidate the auth user document cache for affected users. This includes single-user updates and bulk role/user mutations; otherwise OpenID JWT request burst caching can serve a stale `req.user` until its TTL expires.

## Base44 Dev Environment

- **Stack**: Node 24 monorepo — Express backend (port 3080) + Vite React frontend (port 3090, proxies `/api` and `/oauth` to backend).
- **Infra**: MongoDB 8 + Meilisearch 1.35. No PostgreSQL/RAG API needed for basic operation.
- **Port 3000**: maps to Vite dev server (3090) which proxies API calls to the backend.
- **npm ci + turbo build**: Required on first start to compile TypeScript packages (data-provider, data-schemas, api, client).
- **Hot reload**: Vite HMR for frontend; backend requires restart for changes.
- **Auth**: Email registration enabled, unverified email login allowed. Default API keys set to `user_provided` (users enter their own in the UI).
- **No external secrets required to boot** — AI provider keys can be added per-user through the LibreChat UI.
