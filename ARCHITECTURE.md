# Architecture — Udomi Me Frontend

For the exhaustive file/hook/component reference, see `CLAUDE_CONTEXT.md`. This doc is the higher-altitude view: why it's shaped this way, and how data actually flows.

## Layering (Feature-Sliced-Design-flavored)

```
┌─────────────────────────────────────────────────────────┐
│ _app       providers, router, global CSS — composition root │
├─────────────────────────────────────────────────────────┤
│ _widgets   AppDrawer (navbar) — cross-page, stateful       │
│ _pages     one folder per route: ui/ (render) + hooks/ (logic) │
├─────────────────────────────────────────────────────────┤
│ _features  use-case logic: auth form hooks, validation schemas │
├─────────────────────────────────────────────────────────┤
│ _entities  domain data: types, API hooks (TanStack Query), model atoms │
├─────────────────────────────────────────────────────────┤
│ _shared    dumb, reusable UI primitives (Input, Button, Avatar…) │
└─────────────────────────────────────────────────────────┘
```

Each layer may only depend on layers below it. This keeps API/data concerns (`_entities`) reusable across unrelated pages, and keeps `_shared` components free of any domain knowledge (they take props, nothing else). The **component/hook split within every page** (`ui/` renders, `hooks/` holds all state and side effects) is the same idea applied at the page level — it makes pages trivially testable/readable because the hook is a plain function call that returns everything the view needs.

## Data flow (reads)

```
Page component (_pages/home/ui/Home.tsx)
  → calls usePageHook() (_pages/home/hooks/useHome.ts)
      → calls entity API hook (_entities/listing/api/useGetListings.ts)
          → TanStack Query → shared axios instance (useAxios())
              → GET {VITE_APP_BACKEND_URL}/listings  (withCredentials: true)
                  → udomi-backend (sibling repo, NestJS, /api prefix)
```

Response interceptor on the axios instance unwraps `response.data` before it reaches React Query, so hook consumers get domain data directly, never a raw Axios response envelope.

## Auth / session architecture

There is no client-held token. The backend sets an HTTP-only session cookie on login/register/OAuth callback; every subsequent request automatically carries it (`withCredentials: true`). The frontend's only way to know "am I logged in" is the result of `GET /me`:

```
App mounts
  → GlobalProvider (_app/api/GlobalProvider.tsx) fires useGetMe() once
      → isAuthLoading: true until it settles
      → AppLayout (_app/Routing.tsx) shows <PageLoader /> while isAuthLoading
      → once settled: user = response or null
  → useGlobalContext() exposes { user, isAuthLoading } app-wide
  → ProtectedRoute / GuestRoute (_app/api/AuthGuard.tsx) redirect based on user?.id
```

This avoids any route ever flashing the wrong auth state, at the cost of a blocking loader on every full page load.

## Provider tree (outermost → innermost)

```
ErrorBoundary
  QueryClientProvider        (retry policy: never retry 401/403/404, else retry ≤2)
    NextUIProvider
      AxiosProvider          (baseURL + withCredentials, response/error interceptors)
        GlobalProvider       (fetches /me, exposes user/isAuthLoading)
          Routing            (BrowserRouter + AppLayout + route table)
          ToastContainer     (react-toastify, bottom-right)
```

## Cross-cutting concerns

- **i18n**: `i18next` initialized in `src/i18n.ts`, imported before `App` in `main.tsx` so translations are ready before first render. Language persisted to `localStorage['udomi-lang']`. Validation schemas are factory functions `(t) => yup.object(...)` because Yup schemas can't react to language changes otherwise — they must be constructed inside a component/hook that calls `useTranslation()`.
- **Styling**: Tailwind utility-first, NextUI component library layered on top sharing the same custom color palette (`tailwind.config.js`). No CSS-in-JS.
- **Images**: uploaded directly from the browser to Cloudinary's REST API (no backend proxy, no server-side credential needed beyond a public unsigned upload preset).
- **Maps**: React Leaflet + Nominatim (OpenStreetMap) for geocoding — no paid maps API key required.

## Deployment

This repo is one of three independently-deployed services on the same host (see root `/var/www/CLAUDE.md`). Per `docker-compose.yml` at the repo root of `/var/www`:

- Built as a multi-stage Docker image: `node:18-alpine` builds the Vite static bundle (receiving `VITE_API_URL` as a build-arg, mapped to `VITE_APP_BACKEND_URL` since the `ARG`/`ENV` fix on 2026-10-27), then `nginx:alpine` serves `dist/` on its default port 80.
- Container name `udomi-frontend`; the *outer* reverse-proxy nginx (`/var/www/nginx/conf.d/apps.conf`) routes `udomi-me.com/` → `udomi-frontend:80` and `udomi-me.com/api/` → `udomi-backend:5000` (fixed 2026-10-27 — previously pointed at port `:3000`, which nothing in this image listens on).
- This frontend has exactly one backend dependency: the sibling `udomi-backend` NestJS API. It has no direct database or third-party server-side access of its own — Cloudinary and Nominatim are called directly from the browser.
