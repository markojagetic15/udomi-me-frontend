---
name: add-translation-key
description: Use when adding or changing any user-facing text in the Udomi Me frontend. The app supports English and Croatian via i18next; both locale files must stay in sync.
---

# Add a translation key

1. Add the key to **both** `src/locales/en.json` and `src/locales/hr.json`, under the matching top-level namespace (`nav.*`, `landing.*`, `home.*`, `login.*`, `register.*`, `profile.*`, `createListing.*`, `animalInfo.*`, `errors.*`, `validation.*`, `toast.*`, `categories.*`, `genders.*`, etc. — match an existing page's namespace, don't invent a new top-level key for an existing page). Never add a key to only one locale file — missing keys silently fall back to the key string itself, not an error.

2. Use it in components via `useTranslation()`:
   ```tsx
   const { t } = useTranslation();
   t('namespace.key')
   ```

3. Use it in Yup validation schemas (`src/_features/*/model/*.ts`) by passing `t` into the schema factory function — schemas are `(t: TFunction) => yup.object(...)`, called inside a hook that already has `useTranslation()` set up. Never hardcode an English validation message.

4. Enum-keyed translations (category, gender) are looked up dynamically — e.g. `t(\`categories.${listing.category}\`)` — so a new `Category` enum value requires a matching `categories.<value>` key in both locale files, or the UI will render the raw enum string.

5. Language switch persists to `localStorage['udomi-lang']` and is read by `i18next-browser-languagedetector` on next load — no action needed in code for persistence, it's automatic.
