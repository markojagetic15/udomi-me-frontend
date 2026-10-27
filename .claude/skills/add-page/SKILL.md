---
name: add-page
description: Use when adding a new route/page to the Udomi Me frontend (e.g. a new screen reachable via the router). Covers the ui/hooks split, route registration, and nav/footer visibility rules.
---

# Add a new page

1. Create `src/_pages/<name>/`:
   - `hooks/use<Name>.ts` — ALL state, data fetching, handlers. Return a flat object (no nested sub-objects) of everything the component needs.
   - `ui/<Name>.tsx` — pure render, calls `use<Name>()`, no business logic.
   - `ui/index.ts` — `export * from './<Name>'`
   - `index.ts` (page root) — `export * from './ui'` (add `export * from './hooks'` only if the hook is consumed outside the page)

2. Register the route in `src/_app/Routing.tsx`:
   - Add a `lazy(() => import('_pages/<name>').then((m) => ({ default: m.<Name> })))` import.
   - Add `<Route path='/<path>' element={<...Name />} />` inside `<Routes>`. Wrap in `<ProtectedRoute>` or `<GuestRoute>` (from `./api/AuthGuard`) if the page needs an auth gate.
   - If the navbar or footer should be hidden on this route, add the path to `hideAppDrawerRoutes` / `hideFooterRoutes` arrays in `AppLayout`.

3. Add any new translation keys to **both** `src/locales/en.json` and `src/locales/hr.json` under a new top-level key named after the page (see `add-translation-key` skill).

4. If the page needs data, add/reuse an `_entities/<domain>/api/useXxx.ts` hook (see `add-api-hook` skill) rather than calling axios directly from the page hook.

5. Run `npm run lint` and `npm run build` before considering it done — `tsc -b` catches the lazy-import default-export mismatch that's easy to get wrong here.
