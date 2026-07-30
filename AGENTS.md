See CLAUDE.md.

When adding or changing code that mutates user documents, invalidate the auth user document cache for affected users. This includes single-user updates and bulk role/user mutations; otherwise OpenID JWT request burst caching can serve a stale `req.user` until its TTL expires.

## Base44 Dev Setup Notes

- **docker-compose.base44.yml** runs all services from source with hot reload.
- A placeholder `client/dist/index.html` is required — the API server reads it on startup even in dev mode.
- `client/vite.config.ts` was patched to support `VITE_ALLOWED_HOSTS=true` (allows all hosts) and `BACKEND_HOST` env var (for Docker networking, so Vite proxies API calls to the `api` container).
- API keys are set to `user_provided` — users can enter their own keys in the LibreChat UI settings.
- The RAG API container may restart-loop if it lacks proper env config; this is non-critical for basic operation.
- Packages must be built before the API starts. The `setup` service handles `npm ci` + `turbo build` (excluding frontend).
