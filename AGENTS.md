See CLAUDE.md.

When adding or changing code that mutates user documents, invalidate the auth user document cache for affected users. This includes single-user updates and bulk role/user mutations; otherwise OpenID JWT request burst caching can serve a stale `req.user` until its TTL expires.

## Base44 dev environment

- Run with `docker compose -f docker-compose.base44.yml up -d` (mongodb + api on 3080 + vite client on 3000, single origin via vite's /api proxy).
- The `setup` service runs `npm install`, `npm run build:packages`, copies `.env.example` to `.env` if missing, and writes a stub `client/dist/index.html` (the API refuses to boot without it, even in dev).
- The API container gets `HOST=api` so vite's proxy targets `http://api:3080`; the vite bind host is overridden by the `--host` CLI flag.
- Meilisearch and the RAG API are not started; `[indexSync] error` and the RAG warning in the api logs are expected.
- Model provider keys default to `user_provided` — users enter their own key in the UI.
