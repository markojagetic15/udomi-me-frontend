# Udomi Me Frontend

Free animal adoption platform (Croatia) — React 18 + TypeScript + Vite SPA, talking only to the sibling `udomi-backend` over REST (same origin, `/api`). Rebuilt 2026-10-27 on shadcn/ui.

## Commands

```bash
npm install
npm run dev        # Vite dev server on :3000 (set VITE_APP_BACKEND_URL)
npm run build      # tsc -b && vite build — run before calling anything done
npm run lint
npx prettier --write "src/**/*.{ts,tsx}"
```

## Stack

React 18 · Vite 5 · React Router 6 · TanStack Query 5 · React Hook Form + Yup · Axios · **shadcn/ui** (Radix primitives + Tailwind 3, components live in `src/_shared/ui/` — edit them freely) · lucide-react icons · sonner toasts · react-day-picker · i18next (hr default, en) · React Leaflet · Photon (komoot) for geocoding — **not Nominatim** (its policy forbids autocomplete). Fonts self-hosted via @fontsource (Google Fonts would be a GDPR issue). Sentry is opt-in and lazy-loaded (`VITE_SENTRY_DSN`).

## Architecture (Feature-Sliced-ish)

```
_app       providers, Routing.tsx (lazy pages + layout), AuthGuard (Protected/Guest/AdminRoute)
_entities  data + API hooks + small UI per domain: listing, user, messaging, notification, admin, resource(upload)
_features  use cases: auth (schemas, AuthLayout), listing-filters (URL state), listing-form (create/edit shared),
           listing-actions (report/adopt/contact/share/owner menu), shelter (application form)
_widgets   header (nav, bell, language), footer, notices (cookie, verify-email), listing-browser
_pages     one dir per page: hooks/useX.ts (all logic) + ui/X.tsx (render)
_shared    ui/ (shadcn + app primitives), lib/ (cn, format, errors, photon, monitoring)
```

Dependency direction `_app → _pages/_widgets → _features → _entities → _shared`. Use path aliases, never `../../`.

## Conventions that matter

- **Dates are DD.MM.YYYY everywhere** — `formatDate` in `_shared/lib/format.ts`, `DateInput` for entry.
- **Translations:** every user-facing string in both `src/locales/hr.json` and `en.json`. Croatian plurals need `_one/_few/_other`. Backend error codes (UPPER_SNAKE) map to `errors.<CODE>` via `errorMessage()`.
- **Browse filters live in the URL** (`_features/listing-filters/model/filters.ts`): friendly URL keys ↔ API params (`toApiParams`), same shape saved searches store.
- **FormField** wires label/aria to its child; when the real input is nested (Controller, Radix Select trigger) pass a render function `{(ctl) => <SelectTrigger {...ctl} />}`.
- Auth = httpOnly cookie; `useGlobalContext()` → `{ user, isLoggedIn, isAdmin }` from the `['me']` query. `user.verification_required` says whether the server enforces email verification (only when email sending is configured).
- Listing photos upload to the backend (`POST /api/upload`) before the listing is saved; the backend sweeps orphans daily.
- Lazy page chunks auto-reload once if a deploy removed them (`Routing.tsx`).
- **Effects always use a block body** — `useEffect(() => { doThing(); }, [])`, never `useEffect(() => doThing(), [])`. The return value is treated as cleanup; Chrome 155+ returns a Promise from `window.scrollTo`, and returning it crashed every navigation (2026-10-27).
- Crashes caught by the ErrorBoundary are POSTed to `/api/client-errors` and land in the backend log: `docker compose logs udomi-backend | grep client-error`. Check there first when a user reports "Ups, nešto je puklo".

## Testing

No unit tests. A Playwright UI run against the live site (41 checks: register, create listing, filters, messaging, report, settings, language, mobile) lived in the deploy session's scratchpad; recreate it for big changes rather than trusting tsc alone.
