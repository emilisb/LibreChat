See CLAUDE.md.

When adding or changing code that mutates user documents, invalidate the auth user document cache for affected users. This includes single-user updates and bulk role/user mutations; otherwise OpenID JWT request burst caching can serve a stale `req.user` until its TTL expires.

## Base44 dev environment

- Run: `docker compose -f docker-compose.base44.yml up -d`. Services: `mongodb`, one-shot `setup` (`npm ci` + `npm run build:packages`), `api` (nodemon, :3080 internal), `client` (Vite dev on host :3000, proxies `/api` and `/oauth` to `api` via `HOST=api`).
- Changes under `packages/*` are compiled output consumed via `dist/`: after editing them, rebuild (`docker compose -f docker-compose.base44.yml run --rm setup` or `exec api npm run build:<pkg>`); the api then restarts via nodemon.
- The API refuses to start without `client/dist/index.html`; `setup` seeds it from `client/index.html` (Vite serves the real UI in dev).
- `CREDS_KEY`/`CREDS_IV` must be hex (64/32 chars). `.base44/api-entrypoint.sh` hashes non-hex values (Base44 placeholders are base64) into valid hex; valid hex passes through.
- Non-secret defaults live in `.base44/defaults.env` (not `.env*`, which is gitignored). `SEARCH=false` (no Meilisearch), no `librechat.yaml` (logs a harmless ENOENT error), no RAG API.
- Verify: `curl localhost:3000/api/config` returns JSON; register at `/register` (first user becomes ADMIN), log in, land on `/c/new`.
