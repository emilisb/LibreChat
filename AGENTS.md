See CLAUDE.md.

When adding or changing code that mutates user documents, invalidate the auth user document cache for affected users. This includes single-user updates and bulk role/user mutations; otherwise OpenID JWT request burst caching can serve a stale `req.user` until its TTL expires.

## Base44 dev environment

`docker compose -f docker-compose.base44.yml up -d` runs LibreChat from source:
- `mongodb` (mongo:7), `setup` (one-shot `npm ci` + `npm run build:packages`, also creates a placeholder `client/dist/index.html` the API requires at boot), `api` (nodemon on 3080), `client` (vite dev on 3090 -> host port 3000, proxies `/api` and `/oauth` to `api:3080`).
- Non-secret dev env lives in `base44.defaults.env` (gitignore-safe name); real secrets come from `/run/base44/app.env`, listed last so they win.
- `SEARCH=false` so Meilisearch isn't needed. Provider API keys are `user_provided` — enter them in the UI, or set them as app secrets.
- Verify: `curl localhost:3080/api/config` and load `/login` on port 3000.
