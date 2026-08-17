See CLAUDE.md.

When adding or changing code that mutates user documents, invalidate the auth user document cache for affected users. This includes single-user updates and bulk role/user mutations; otherwise OpenID JWT request burst caching can serve a stale `req.user` until its TTL expires.

## Base44 Dev Environment Notes

### Architecture
- **Monorepo** (npm workspaces + Turborepo): `api/`, `client/`, `packages/`
- **MongoDB** (mongo:8.0) — no auth in dev, URI: `mongodb://mongodb:27017/LibreChat`
- **Meilisearch** (v1.35.1) — full-text search, master key: `base44devkey123456`
- **API** — Node.js, port 3080, run via `npx nodemon api/server/index.js`
- **Client** — Vite dev server, port 3090 (mapped to host 3000), proxies `/api` and `/oauth` to the `api` service via `BACKEND_HOST=api`

### Setup order (compose)
1. `mongodb` + `meilisearch` must be healthy
2. `setup` runs `npm install` + `npx turbo run build --filter='!@librechat/frontend'` and exits (builds shared packages only — NOT the frontend)
3. `api` + `client` start after `setup` completes

### Key quirks
- `BACKEND_HOST` env var was added to `client/vite.config.ts` (not in upstream) so the Vite proxy can target the `api` Docker service by name (`http://api:3080`) while still binding Vite to `0.0.0.0`.
- `VITE_ALLOWED_HOSTS` must include the preview hostname (`3000-$BASE44_PUBLIC_HOST_SUFFIX`); the compose file sets it dynamically.
- `SESSION_EXPIRY` / `REFRESH_TOKEN_EXPIRY` are passed as raw JS expressions in the env — this is how LibreChat expects them.
- External API keys (OpenAI, Anthropic, Google, Assistants) are passed as `user_provided` placeholders; real values come from `/run/base44/app.env` via `env_file`.
- `librechat.yaml` is the app config override file — it doesn't need to exist for the app to boot; LibreChat falls back to defaults.

### Verifying the app works
```bash
curl http://localhost:3080/api/health        # API health
curl http://localhost:3000/api/health        # Vite proxy → API (should return same)
curl http://localhost:3000/                  # Client HTML
```

### Adding AI provider keys
Use `set_secrets` or provide via the Base44 secrets UI — the platform delivers them to `/run/base44/app.env`.
