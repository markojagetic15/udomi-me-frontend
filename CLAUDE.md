# Udomi Me Frontend

Free animal adoption platform — React 18 + TypeScript + Vite SPA, consumed by browsers, talking only to the sibling `udomi-backend` repo over REST.

**Full reference: see `CLAUDE_CONTEXT.md` in this directory — read it before making any non-trivial change.** It has the complete route table, every API hook, every page hook, every shared component's props, validation schemas, and i18n key structure. This file is just the fast-load summary.

## Commands

```bash
npm install
npm run dev       # Vite dev server on port 3000
npm run build      # tsc -b && vite build
npm run lint
npm run preview
```

## Stack

React 18 + TypeScript 5.6 + Vite 5 · React Router 6 · TanStack Query 5 · React Hook Form + Yup · Axios · NextUI + Tailwind · i18next (en/hr) · React Leaflet (maps) · Cloudinary (direct REST image upload, no backend proxy).

## Architecture rule (Feature-Sliced Design-ish)

```
_app       bootstrap only: providers, routing, global CSS
_entities  pure data: models, API hooks, basic UI atoms — no page logic
_features  use-case logic (form hooks, validation) — depends on _entities
_pages     full pages, each with ui/ + hooks/ — ALL logic lives in the hook, component only renders
_shared    generic domain-agnostic UI components
_widgets   complex stateful cross-page components (e.g. AppDrawer navbar)
```

Dependency direction: `_app → _widgets/_pages → _features → _entities → _shared`. Never import a higher layer from a lower one. Always use path aliases (`_entities`, `_shared`, etc.) — never relative `../../` imports.

## Auth

Session is a backend-set **HTTP-only cookie** (`withCredentials: true` on the shared axios instance). There is no JWT in localStorage or React state. Logged-in state is derived purely from whether `GET /me` (`useGetMe`, query key `['me']`) returns a user — exposed via `useGlobalContext()` → `{ user, isAuthLoading }`. `ProtectedRoute` / `GuestRoute` (`src/_app/api/AuthGuard.tsx`) gate routes on `user?.id`.

## Env vars (`.env` at root)

```
VITE_APP_BACKEND_URL=http://localhost:8080/api
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
```

## Gotchas

- `package.json` carries dead dependencies (`aws-sdk`, `@aws-sdk/client-s3`, `@react-oauth/google`) that are not used anywhere in `src/` — Google login is a plain redirect to `${VITE_APP_BACKEND_URL}/google`, not the `@react-oauth/google` SDK. Don't assume these packages are wired up.
- Both `tailwind` and `tailwindcss` packages are present; only `tailwindcss` (v3) is actually configured (`tailwind.config.js`).
- **Docker build fixed 2026-10-27.** `Dockerfile` now declares `ARG VITE_API_URL` + `ENV VITE_APP_BACKEND_URL=$VITE_API_URL` before `RUN npm run build`, so the `--build-arg VITE_API_URL=...` already passed by root `docker-compose.yml` actually reaches Vite at build time instead of baking in `undefined`.
- **Port mismatch fixed 2026-10-27.** Root `nginx/conf.d/apps.conf` now proxies to `udomi-frontend:80` (the nginx:alpine default the Dockerfile's final stage actually listens on), not `:3000`.
- A `vercel.json` also exists, suggesting Vercel may be (or may have been) an alternate/actual deployment target where env vars are set via dashboard instead of Docker build args — check which deployment path is actually live before debugging "it works locally but not in prod."
