See CLAUDE.md.

When adding or changing code that mutates user documents, invalidate the auth user document cache for affected users. This includes single-user updates and bulk role/user mutations; otherwise OpenID JWT request burst caching can serve a stale `req.user` until its TTL expires.

## Base44 dev environment

- Run with `docker compose -f docker-compose.base44.yml up -d` (mongodb, one-shot `setup`, `api` on 3080, vite `client` on 3000).
- The Express server refuses to boot without `client/dist/index.html`; in dev the `setup` service writes a placeholder (the real UI is served by the vite dev server on port 3000, which proxies `/api` to the api container).
- Vite's proxy target comes from `HOST`/`BACKEND_PORT`, so the client service sets `HOST=api`; the dev server host is forced via the `--host` CLI flag.
- Non-secret dev config lives in `.env.base44-defaults` (loaded before `/run/base44/app.env`, which always wins). Search/Meilisearch and the RAG API are disabled.
