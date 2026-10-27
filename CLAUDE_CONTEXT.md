# CLAUDE_CONTEXT.md — Udomi Me Frontend

Udomi Me is a free animal adoption platform connecting animals in need with adopters. This document is the authoritative reference for the frontend codebase. Read it in full before making changes.

---

## Table of Contents

1. [Tech Stack](#1-tech-stack)
2. [Project Configuration](#2-project-configuration)
3. [Folder Structure](#3-folder-structure)
4. [Routing & Layout](#4-routing--layout)
5. [App Providers](#5-app-providers)
6. [Global Context & Auth](#6-global-context--auth)
7. [Axios & API Layer](#7-axios--api-layer)
8. [Entity Models & Types](#8-entity-models--types)
9. [API Hooks Reference](#9-api-hooks-reference)
10. [Feature Hooks (Auth + Forms)](#10-feature-hooks-auth--forms)
11. [Page Hooks](#11-page-hooks)
12. [Validation Schemas](#12-validation-schemas)
13. [Shared UI Components](#13-shared-ui-components)
14. [Pages Reference](#15-pages-reference)
15. [Internationalization (i18n)](#16-internationalization-i18n)
16. [Styling & CSS](#17-styling--css)
17. [Image Upload](#18-image-upload)
18. [Error Handling](#19-error-handling)
19. [Key Patterns & Conventions](#20-key-patterns--conventions)
20. [Environment Variables](#21-environment-variables)

---

## 1. Tech Stack

| Concern | Library | Version |
|---|---|---|
| Framework | React | 18.3.1 |
| Language | TypeScript | 5.6.3 |
| Build tool | Vite | 5.4.10 |
| Routing | React Router DOM | 6.27.0 |
| Server state | TanStack React Query | 5.59.19 |
| Forms | React Hook Form | 7.53.1 |
| Validation | Yup + @hookform/resolvers | 1.4.0 |
| HTTP | Axios | 1.7.7 |
| UI components | NextUI | 2.4.8 |
| Styling | Tailwind CSS | 3.4.14 |
| Animations | Framer Motion | 11.11.11 |
| Maps | React Leaflet + Leaflet | 4.2.1 / 1.9.4 |
| Drag & drop | @hello-pangea/dnd | — |
| Date utilities | Day.js | 1.11.13 |
| Date picker | @internationalized/date | 3.6.0 |
| Notifications | React Toastify | 10.0.6 |
| Icons | React Icons | 5.3.0 |
| i18n | i18next + react-i18next | 26.0.8 / 17.0.6 |
| Lang detect | i18next-browser-languagedetector | — |
| Image CDN | Cloudinary (direct REST) | — |
| Debounce | use-debounce | 10.0.4 |

---

## 2. Project Configuration

### Vite (`vite.config.ts`)

- Dev server runs on **port 3000**
- Path aliases resolve from `src/`:

| Alias | Resolves to |
|---|---|
| `_app` | `src/_app` |
| `_entities` | `src/_entities` |
| `_features` | `src/_features` |
| `_shared` | `src/_shared` |
| `_pages` | `src/_pages` |
| `_widgets` | `src/_widgets` |
| `_assets` | `src/_assets` |

Always use these aliases in imports — never use relative paths like `../../`.

### TypeScript (`tsconfig.json`)

- Target: `ESNext`, Module: `ESNext`
- JSX: `react-jsx`
- Strict mode enabled
- `baseUrl: "src"` — aliases work without `@` prefix

### Tailwind (`tailwind.config.js`)

Custom color palette:

```js
primary:    '#8EAF9D'   // main green — used for buttons, badges, focus rings
secondary:  '#A6D8D4'   // teal accent
accent:     '#6B7D7D'   // dark teal
complement: '#B9CDDA'   // blue-grey
highlight:  '#D7DAE5'   // light lavender
```

NextUI plugin is loaded with these colors. All `bg-primary`, `text-primary`, `border-primary` classes use this palette.

### ESLint

- Single quotes required
- React hooks exhaustive deps rule disabled
- No console in production
- No duplicate imports

---

## 3. Folder Structure

```
src/
├── _app/                        # App bootstrap
│   ├── api/
│   │   ├── AxiosProvider.tsx    # Axios instance, interceptors
│   │   ├── GlobalProvider.tsx   # User context (fetches /me)
│   │   └── index.ts
│   ├── ui/
│   │   ├── ErrorBoundary.tsx    # React error boundary
│   │   ├── reset.css            # Meyer reset
│   │   ├── global.css           # App-wide styles, animations
│   │   └── font.css             # Poppins font
│   └── Routing.tsx              # All route definitions + guards
│
├── _entities/                   # Domain data layer (models + API + UI atoms)
│   ├── listing/
│   │   ├── api/                 # All listing API hooks
│   │   ├── model/               # Types, enums, area codes
│   │   │   ├── types.tsx        # Listing, Image, Category, CreateListingDto
│   │   │   ├── area-codes.ts    # 250+ country dial codes
│   │   │   └── index.ts
│   │   └── ui/
│   │       └── Listing.tsx      # <ListingItem> card component
│   ├── user/
│   │   ├── api/                 # useGetMe, useGetUser, useLogout
│   │   └── model/               # User interface
│   └── resource/
│       └── lib/
│           └── upload.ts        # Cloudinary upload utility
│
├── _features/                   # Feature-specific business logic
│   ├── user/
│   │   ├── hooks/               # useLogin, useRegister, useForgotPassword
│   │   └── model/               # validation_schema.ts (login, register, forgot)
│   └── listing/
│       └── model/               # create_listing_schema.ts
│
├── _pages/                      # Full page components (each has ui/ + hooks/)
│   ├── home/                    # Browse / listing feed
│   ├── landing/                 # Marketing landing page
│   ├── login/
│   ├── register/
│   ├── forgot-password/
│   ├── verify-email/
│   ├── profile/
│   ├── create-listing/
│   ├── edit-listing/
│   ├── single-listing/          # Animal detail page
│   ├── google-callback/         # OAuth redirect handler
│   └── error/                   # ErrorPage component (handles all HTTP codes)
│
├── _shared/
│   └── ui/                      # Reusable primitive components (Input, Button, etc.)
│
├── _widgets/
│   └── AppDrawer/               # Top navigation bar (desktop + mobile drawer)
│       ├── hooks/
│       │   └── useAppDrawer.ts
│       └── ui/
│           └── AppDrawer.tsx
│
├── _assets/                     # SVG backgrounds, PNG images
├── locales/
│   ├── en.json                  # English translations
│   └── hr.json                  # Croatian translations
├── i18n.ts                      # i18next configuration
├── App.tsx                      # Root component (all providers)
└── main.tsx                     # Entry point (imports i18n before App)
```

### Architecture Rules

- `_entities` — pure data concerns (models, API calls, basic UI atoms). No page-specific logic.
- `_features` — use-case logic (form hooks, validation). Depends on `_entities`.
- `_pages` — full pages. Each page folder has `ui/` (component) and `hooks/` (page logic).
- `_shared` — generic, reusable UI components that know nothing about the domain.
- `_widgets` — complex, stateful components used across multiple pages (e.g. navbar).
- `_app` — bootstrapping only. Providers, routing, global CSS.

---

## 4. Routing & Layout

### Route Table (`src/_app/Routing.tsx`)

| Path | Component | Guard | Notes |
|---|---|---|---|
| `/` | `Landing` | Public | |
| `/browse` | `Home` | Public | |
| `/login` | `Login` | GuestRoute | Redirects to `/browse` if logged in |
| `/register` | `Register` | GuestRoute | Redirects to `/browse` if logged in |
| `/forgot-password` | `ForgotPassword` | Public | |
| `/verify-email` | `VerifyEmail` | Public | Token via `?token=` query param |
| `/profile` | `Profile` | ProtectedRoute | Redirects to `/login` if not authenticated |
| `/create-listing` | `CreateListing` | ProtectedRoute | |
| `/edit-listing/:id` | `EditListing` | ProtectedRoute | Lazy-loaded |
| `/animal/:id` | `AnimalInfo` | Public | |
| `/google-callback` | `GoogleCallback` | Public | Handles OAuth redirect |
| `/error/400–503` | `ErrorPage` | Public | Specific HTTP error codes |
| `*` | `ErrorPage (404)` | Public | Catch-all |

### Route Guards

**`ProtectedRoute`**: Reads `user` from `GlobalProvider`. If `user.id` is falsy, redirects to `/login` and saves original location in state so the user can be redirected back after login.

**`GuestRoute`**: If `user.id` exists, redirects to `/browse`.

### Layout Behaviour

The root layout conditionally shows/hides navigation elements:

- `AppDrawer` (navbar) is **hidden** on: `/login`, `/register`, `/forgot-password`
- `Footer` is **hidden** on: `/login`, `/register`, `/forgot-password`, `/` (landing)
- On the landing page `/`, the `AppDrawer` is transparent (no border, no blur) and fixed to the top

---

## 5. App Providers

Providers wrap the app in this order (outermost first):

```
ErrorBoundary
  QueryClientProvider          ← TanStack React Query
    NextUIProvider             ← NextUI theming
      AxiosProvider            ← HTTP client setup
        GlobalProvider         ← Fetches /me, provides user
          <Routing />          ← BrowserRouter + all routes
          <ToastContainer />   ← Notifications
```

### QueryClient Configuration

```ts
retry: (failureCount, error) => {
  const status = error?.response?.status;
  if (status === 401 || status === 403 || status === 404) return false;
  return failureCount < 2;
}
```

Non-retried status codes: 401, 403, 404. All others retry up to 2 times.

### ToastContainer Configuration

- Position: `bottom-right`
- Auto-close: 4000ms
- No progress bar, newest on top, closes on click, pauses on hover

---

## 6. Global Context & Auth

### `GlobalProvider` (`src/_app/api/GlobalProvider.tsx`)

```ts
type GlobalContextType = { user: User | null; isAuthLoading: boolean }
```

- Runs `useGetMe()` (GET `/me`) on mount
- Provides `user` and `isAuthLoading` throughout the app via `useGlobalContext()` hook
- `user` is `null` until the request resolves
- `isAuthLoading` is `true` until the initial `/me` request settles; `AppLayout` (`src/_app/Routing.tsx`) renders `<PageLoader />` instead of routes while this is `true`, so routes never flash the logged-out state before auth resolves

### `useGlobalContext()` (`src/_app/api/useGlobalContext.ts`)

```ts
const { user, isAuthLoading } = useGlobalContext();
```

Use this everywhere you need to read the current user. Never import GlobalProvider directly.

### Route Guards (`src/_app/api/AuthGuard.tsx`)

`ProtectedRoute` and `GuestRoute` (used in the route table below) live here, not inline in `Routing.tsx`. There is also a deprecated no-op `AuthGuard` component kept for backward compat — do not use it in new code.

### Authentication Mechanism

- Backend sets an **HTTP-only cookie** on login/register
- Axios is configured with `withCredentials: true` — cookie is sent automatically
- There is no token in localStorage or React state
- Auth state is determined purely by whether GET `/me` returns a user

---

## 7. Axios & API Layer

### `AxiosProvider` (`src/_app/api/AxiosProvider.tsx`)

- Creates an Axios instance with `baseURL = VITE_APP_BACKEND_URL`
- Provides the instance via `useAxios()` hook

### Request Config

```ts
{
  baseURL: import.meta.env.VITE_APP_BACKEND_URL,
  withCredentials: true,
}
```

### Response Interceptor

Unwraps the response `data` layer — components receive data directly, not `response.data`.

### Error Interceptor

- Extracts error message from `error.response.data.message` (handles both string and array)
- Redirects to `/login` on 401 **except** for these endpoints:
  - `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/change-password`, `/me`

### `useAxios()`

```ts
const { axios } = useAxios();
// axios is the configured instance — use it inside mutations
```

---

## 8. Entity Models & Types

### `Listing`

```ts
interface Listing {
  id: string;
  title: string;
  description?: string;
  images: Image[];
  address?: string;
  phone_number?: string;
  email?: string;
  area_code?: string;
  lat?: number;
  lng?: number;
  date_of_birth?: Date;
  is_vaccinated?: boolean;
  breed?: string;
  gender?: 'male' | 'female';
  category?: Category;
  user: User;
  created_at: Date;
  updated_at: Date;
  is_urgent: boolean;
  size: number;           // in kg
  favorite: boolean;
  is_adopted: boolean;
  is_active: boolean;
  number_of_interested_users: number;
}
```

### `Image`

```ts
interface Image {
  position: number;  // 0-based display order
  url: string;       // Cloudinary secure URL
  id: string;        // Cloudinary public_id
}
```

### `Category` (enum)

```ts
enum Category {
  DOG = 'dog',
  CAT = 'cat',
  RABBIT = 'rabbit',
  BIRD = 'bird',
  REPTILE = 'reptile',
  HORSE = 'horse',
  OTHER = 'other',
}
```

### `User`

```ts
interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: Date;
  avatar: string;
  favorite_listings: Listing[];
  interested_listings: Listing[];
}
```

### `GetAllListingsResponse`

```ts
interface GetAllListingsResponse {
  listings: Listing[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
```

### `CreateListingDto`

```ts
type CreateListingDto = {
  title: string;
  description: string;
  images?: { url: string; id: string }[];
  address?: string;
  phone_number?: string | null;
  category: Category;
  date_of_birth: Date | null;
  is_vaccinated?: boolean;
  breed?: string | null;
  gender: 'male' | 'female';
}
```

### Selector Constants

```ts
// src/_entities/listing/model/types.tsx

CategoryItems   // [{ label, key: Category, icon: ReactNode }]
GenderItems     // [{ label, key: 'male'|'female' }]
AreaCodesItems  // [{ label: '(US) +1 ', key: '(US) +1 ' }] — 250+ countries
```

---

## 9. API Hooks Reference

All hooks live in `src/_entities/*/api/`. Import them from the entity's `index.ts`.

### Listing API

```ts
// READ
const { getAllListings } = useGetListings(page, limit, search, categories[]);
// Query key: ['listings', page, limit, search, categories]
// Returns: { data?: GetAllListingsResponse, isLoading, isError, error }

const { getListing } = useGetListing(id: string);
// Query key: ['listings', id]
// Returns: { data?: { listing: Listing }, isLoading, isError }

const { getMyListings } = useGetMyListings();
// Query key: ['my-listings']
// Returns: { data?: Listing[], isLoading }

// WRITE
const { createListing, isPending } = useCreateListing({ onSuccess });
// POST /listings — body: CreateListingDto

const { updateListing, isPending } = useUpdateListing({ onSuccess });
// PUT /listings/:id — body: partial CreateListingDto

const { deleteListing, isPending } = useDeleteListing();
// DELETE /listings/:id
// Invalidates: ['my-listings'], ['listings']

const { markAsAdopted, isPending } = useMarkAsAdopted();
// POST /listings/:id/adopt
// Invalidates: ['my-listings'], ['listings']

const { favoriteListing } = useFavoriteListing();
// POST /listings/:id/favorite
// Invalidates: ['me'], ['listings']

const { showInterest } = useShowInterest();
// POST /listings/:id/interest
// Invalidates: ['me'], ['listing']
```

### User API

```ts
const { getMe } = useGetMe();
// GET /me — query key: ['me']

const { getUser } = useGetUser(id: string);
// GET /users/:id — query key: ['user', id]

const { logout } = useLogout();
// POST /logout — clears auth cookie, invalidates ['me']
```

---

## 10. Feature Hooks (Auth + Forms)

Located in `src/_features/user/hooks/`. Import from `_features/user`.

### `useLogin()`

```ts
const {
  register, handleSubmit, errors, onSubmit,
  showPassword, handleTogglePassword,
  navigate, handleGoogleLogin, isLoading,
} = useLogin();
```

- Validates with `login_schema(t)`
- On success: invalidates `['me']`, navigates to `/browse`
- `handleGoogleLogin()`: redirects to `VITE_APP_BACKEND_URL/google`

### `useRegister()`

```ts
const {
  register, handleSubmit, errors, onSubmit,
  showPassword, showConfirmPassword,
  handleTogglePassword, handleToggleConfirmPassword,
  navigate, handleGoogleRegister, isLoading,
} = useRegister();
```

- Validates with `register_schema(t)`
- On success: `toast.success(t('toast.accountCreated'))`, navigates to `/browse`

### `useForgotPassword()`

```ts
const {
  register, handleSubmit, errors, onSubmit,
  navigate, isLoading, isSuccess,
} = useForgotPassword();
```

- Validates with `forgot_password_schema(t)`
- On success: `toast.success(t('toast.passwordResetSent'))`, `isSuccess` becomes true (shows confirmation UI)

---

## 11. Page Hooks

### `useHome()` (`src/_pages/home/hooks/`)

```ts
const {
  listings, isLoading, isError, error,
  page, setPage, totalPages,
  handleOnSearch,    // debounced 500ms
  handleSetCategory, // toggles one category
  clearCategories,
  categories,        // string[] of active category keys
} = useHome();
```

- Fetches `useGetListings(page, 10, search, categories)`
- Search is debounced 500ms

### `useProfile()` (`src/_pages/profile/hooks/`)

```ts
const {
  myListings,       // Listing[]
  favoriteListings, // Listing[] — from user.favorite_listings
  isLoading,
  isError,
  user,             // User | null
} = useProfile();
```

- `myListings`: from `useGetMyListings()`
- `favoriteListings`: derived from `user.favorite_listings`

### `useAnimalInfo()` (`src/_pages/single-listing/hooks/`)

```ts
const {
  listing, isError, isLoading,
  handleFavorite, handleShowInterest,
  isFavoritePending, isInterestPending,
  isFavorited, isInterested,
  isOwner,   // user.id === listing.user.id
} = useAnimalInfo();
```

- Reads `:id` from URL params
- `isOwner` hides interest CTA from the listing author
- `isFavorited`: checks `user.favorite_listings`
- `isInterested`: checks `user.interested_listings`

### `useCreateListingPage()` (`src/_pages/create-listing/hooks/`)

```ts
const {
  register, handleSubmit, errors, onSubmit, isPending,
  handleUploadImages,   // handles Cloudinary upload, sets form value
  images,               // Image[] — current uploaded images
  handleOnDateChange,   // for DatePicker integration
  handleRemoveImage,    // removes by id
  onDragEnd,            // drag-to-reorder handler
  handleLocationChange, // sets address, lat, lng in form
  titleValue,           // live watch for char count
  descriptionValue,     // live watch for char count
  locationValue,        // { address, lat, lng }
} = useCreateListingPage();
```

- Schema: `create_listing_schema(t)`
- Max 8 images — shows toast error if exceeded
- Images uploaded to Cloudinary before form submit

### `useEditListingPage()` (`src/_pages/edit-listing/hooks/`)

Same interface as `useCreateListingPage()` plus:

```ts
const {
  // ...all of create
  isLoading,      // loading existing listing data
  initialDate,    // DateValue for DatePicker defaultValue
  navigate,
  listingId,      // string from URL :id
} = useEditListingPage();
```

- Pre-populates form via `reset()` when listing data loads
- Converts `date_of_birth` string to `DateValue` with `parseDate()`

---

## 12. Validation Schemas

All schemas are **functions that accept `t: TFunction`** — they must be called inside hooks that have `useTranslation()` set up.

```ts
// Usage pattern in hooks:
const { t } = useTranslation();
const { register } = useForm({ resolver: yupResolver(login_schema(t)) });
```

### `login_schema(t)`

| Field | Rules |
|---|---|
| `email` | valid email, required |
| `password` | required |

### `register_schema(t)`

| Field | Rules |
|---|---|
| `first_name` | required |
| `last_name` | required |
| `email` | valid email, required |
| `password` | required, 8–20 chars, must match `/(?=.*\d|.*\W)(?=.*[A-Z])(?=.*[a-z])/` |
| `confirm_password` | required, must match `password` |
| `term_and_conditions` | boolean, must be `true` |

### `forgot_password_schema(t)`

| Field | Rules |
|---|---|
| `email` | valid email, required |

### `create_listing_schema(t)`

| Field | Rules |
|---|---|
| `title` | required, 3–50 chars |
| `description` | required, 5–500 chars |
| `images` | optional array, max 8, each with `{id, url, position}` |
| `category` | required, one of `Category` enum values |
| `gender` | required, `'male'` or `'female'` |
| `date_of_birth` | required date |
| `size` | required number |
| `phone_number` | optional, phone regex (excludes empty string) |
| `email` | optional, valid email format |
| `address`, `area_code`, `lat`, `lng` | optional |
| `is_vaccinated`, `is_urgent` | optional boolean |
| `breed` | optional string |

Also used for **EditListing** (same schema, same function).

---

## 13. Shared UI Components

All components in `src/_shared/ui/`. Import from `_shared`.

### `<Button>`

```ts
interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  children: ReactNode;
  onClick?: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  color?: 'default' | 'primary';
  width?: string;
  variant?: 'solid' | 'bordered';
  className?: string;
}
```

### `<Input>`

```ts
interface InputProps {
  name?: string;
  label?: string;
  type?: string;
  error?: string;
  register?: UseFormRegisterReturn;
  endIcon?: ReactNode;
  startIcon?: ReactNode;
  onChange?: (e) => void;
  multiple?: boolean;
  value?: string;
  width?: string;
  isRequired?: boolean;
  description?: string;
  className?: string;
  id?: string;
  hidden?: boolean;
  placeholder?: string;
  maxLength?: number;
}
```

### `<TextArea>`

```ts
interface TextAreaProps {
  name?: string;
  label?: string;
  error?: string;
  register?: UseFormRegisterReturn;
  endIcon?: ReactNode;
  hide?: boolean;
  onChange?: (e) => void;
  isRequired?: boolean;
  description?: string;
  maxLength?: number;
}
```

### `<Select>`

```ts
interface SelectProps {
  register: UseFormRegisterReturn;
  error?: string;
  items: { label: string; key: string; icon?: ReactNode }[];
  label?: string;
  description?: string;
  width?: string;
  isRequired?: boolean;
}
```

### `<Checkbox>`

```ts
interface CheckboxProps {
  label: string;
  register: UseFormRegisterReturn;
  error?: string;
}
```

### `<Avatar>`

```ts
interface AvatarProps {
  user?: User | null;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
}
```

Displays avatar image if available, otherwise renders user initials on a colored background.

### `<DatePicker>`

```ts
interface DatePickerProps {
  error?: string;
  label?: string;
  maxValue?: DateValue;
  description?: string;
  onChange: (date: DateValue | undefined) => void;
  isRequired?: boolean;
  defaultValue?: DateValue;
}
```

### `<Dropdown>`

```ts
interface DropdownItem {
  key: string;
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
}

interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  onAction?: (key: string) => void;
  selectedKeys?: string[];
}
```

### `<Autocomplete>`

```ts
interface AutocompleteProps {
  label: string;
  items: { label: string; key: string }[];
  register: UseFormRegisterReturn;
  className?: string;
}
```

Used for the area code selector.

### `<ImageCarousel>`

```ts
interface ImageCarouselProps {
  images: Image[];
}
```

Renders images with drag-scrolling navigation and dot indicators.

### `<LocationPicker>`

```ts
interface LocationPickerProps {
  onChange: (v: { address: string; lat: number; lng: number }) => void;
  value?: { address: string; lat: number; lng: number };
}
```

Three-level location hierarchy: **Country → City/Town → Neighbourhood**.

- Uses Nominatim OpenStreetMap API (no API key required)
- Debounced search: 380ms
- Emits `{ address, lat, lng }` when a location is selected
- Supported countries: 46 (Europe, US, Canada, Australia, Japan, China, India, Brazil, etc.)
- Changing country resets city and neighbourhood

### `<Spinner>`

No props. Renders a NextUI spinner in primary color.

### `<Switch>`

```ts
interface SwitchProps {
  defaultSelected?: boolean;
  register: UseFormRegisterReturn;
  label?: string;
  description?: string;
}
```

### `<Footer>`

No props. Renders brand name, copyright year, and navigation links. Uses `useTranslation()` for all text.

---

## 14. AppDrawer (Navbar)

`src/_widgets/AppDrawer/ui/AppDrawer.tsx`

Renders the top navigation bar. Two variants based on `user?.id`:

**Logged-in**: Brand name → Language switcher → Create listing button → Avatar dropdown (Profile, Logout)

**Logged-out**: Brand name → Language switcher → Register button → Login button

**Mobile**: Hamburger icon → full-screen slide-in drawer (both variants)

**Landing page special behaviour**: On `/`, the navbar is transparent (`bg-transparent`, no border, no blur, fixed at top). All text/buttons are white.

**Language Switcher**: `<LanguageSwitcher>` — internal component that reads `i18n.language` and toggles between `en`/`hr`. Label shows the language you'll switch *to* (e.g. when on EN, shows "HR").

### `useAppDrawer()`

```ts
const { navigate, user, logout } = useAppDrawer();
```

- `logout()`: calls `useLogout()` mutation then navigates to `/`

---

## 15. Pages Reference

### Landing (`/`)

- Hero section with floating animal emoji animations
- Stats strip (500+ listed, 200+ adoptions, 6 categories, 100% free)
- Category browser (navigates to `/browse?category=X`)
- How It Works (3 steps)
- Why Adopt (3 reasons)
- Recently Added (fetches first 4 listings)
- CTA section

### Home / Browse (`/browse`)

- Search input (debounced 500ms)
- Category filter pills (toggleable, multi-select)
- Clear filter button
- Listing grid (4 columns on large screens, 2 on mobile)
- Pagination (NextUI `<Pagination>`)
- Empty state with sad dog image

URL query params: Not synced to URL — all state is in-memory via `useHome()`.

### Single Listing (`/animal/:id`)

- Image carousel at top
- Category/adopted/urgent badges
- Favorite + Report buttons
- Interest CTA (hidden from listing owner, hidden if adopted)
- Adopted banner (green) if `is_adopted`
- Description section
- Info grid: category, gender, size, breed, date of birth, vaccinated, urgent, interested count
- Location section with OpenStreetMap map (800m radius circle, scroll zoom disabled)
- Contact info: area code, phone, email

### Profile (`/profile`)

Three sections:
1. **User card**: Avatar, name, email, member since date, active/adopted listing counts
2. **My Listings**: Grid of `<OwnerListingCard>` with Mark Adopted + Delete buttons
3. **Favourited Animals**: Grid of `<ListingItem>` cards
4. **Change Password**: Form with current/new/confirm password fields and show/hide toggles

### Create Listing (`/create-listing`)

Four-section form:
1. **Basic Information**: Title (50 char limit) + Description (500 char limit) with live char counts
2. **Animal Details**: Category, Gender, Date of Birth, Size (kg), Breed, Vaccinated switch, Urgent switch
3. **Contact & Location**: Phone Number, Email, Address (with `<LocationPicker>`)
4. **Photos**: Drag-to-reorder image grid (max 8), Cloudinary upload on file select

### Edit Listing (`/edit-listing/:id`)

Same form as Create Listing but pre-populated. Has a back arrow navigating to `/animal/:id`.

Photos section subtitle differs: "Drag to reorder. At least one photo required."

Note: The Contact & Location section in Edit Listing includes the Area Code `<Autocomplete>` field (not present in Create Listing's current implementation but the field exists in the schema).

### Login (`/login`)

- Email + Password fields
- Forgot password link
- Sign In button
- OR divider
- Continue with Google button
- Link to register

Has animated background SVG (`register_waves.svg`).

### Register (`/register`)

- First name + Last name (2-column grid)
- Email, Password, Confirm Password
- Terms & Conditions checkbox (with modal)
- Create Account button
- OR divider
- Continue with Google
- Link to login

Has animated background SVG (`register_circles.svg`). Terms modal shows full T&C text with close and "I Understand" button.

### Forgot Password (`/forgot-password`)

- Email address field
- Send Reset Link button
- Success state: shows inbox check UI with "Back to Sign In" button
- Link to sign in

### Verify Email (`/verify-email?token=X`)

Three states: `loading` (spinner), `success` (verified message + Sign In button), `error` (failed message + Register Again button).

Calls GET `/auth/verify-email?token=X` on mount.

### Error Page

Handles all HTTP error codes via props: `<ErrorPage code={404} />`.

Emoji, numeric code, title, description from i18n keys. Go Back + Go Home buttons.

### Google Callback (`/google-callback`)

Handles the OAuth redirect from backend. No user-facing UI shown during processing.

---

## 16. Internationalization (i18n)

### Setup (`src/i18n.ts`)

- **Library**: `i18next` + `react-i18next`
- **Detection**: `i18next-browser-languagedetector`
- **Storage**: `localStorage` key `udomi-lang`
- **Detection order**: localStorage → browser language
- **Fallback**: `en`
- **Supported**: `en`, `hr` (Croatian)
- Import: `import './i18n'` in `main.tsx` (before App)

### Usage in Components

```tsx
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
// t('key.path') returns the translation string
```

### Usage in Hooks (validation schemas)

Schemas are factory functions — call them with `t`:

```ts
const { t } = useTranslation();
useForm({ resolver: yupResolver(login_schema(t)) });
```

### Translation File Structure (`src/locales/en.json`)

```
nav.*             — navigation labels (brandName, createListing, profile, logout, etc.)
landing.*         — all landing page content (hero, stats, categories, howItWorks, whyAdopt, recentlyAdded, cta)
home.*            — browse page (searchPlaceholder, clear, noAnimals, failedToLoad, retry)
login.*           — login page labels
register.*        — register page labels + register.terms.* for the T&C modal
forgotPassword.*  — forgot password page
verifyEmail.*     — verify email page
profile.*         — profile page labels + profile.changePassword.*
createListing.*   — create listing form (sections.*, fields.*)
editListing.*     — edit listing form overrides
animalInfo.*      — single listing page labels
errors.*          — error page titles + descriptions keyed by HTTP status code
footer.*          — footer links and copyright
categories.*      — category labels keyed by Category enum value (e.g. categories.dog)
genders.*         — gender labels (genders.male, genders.female)
validation.*      — all Yup validation error messages
toast.*           — all toast notification messages
listing.*         — listing card labels (newborn, listed, loginToFavourite, removeFromFavourites)
language.*        — language switcher labels
```

### Language Switcher

In `AppDrawer.tsx` as `<LanguageSwitcher>`. Calls `i18n.changeLanguage('en'|'hr')` on click. Choice persists via localStorage.

---

## 17. Styling & CSS

### CSS Files Load Order (in `main.tsx`)

1. `reset.css` — Meyer reset v2.0
2. `global.css` — App-wide styles
3. `font.css` — Poppins font

### Global CSS (`src/_app/ui/global.css`)

Key contents:

```css
/* Floating emoji animation for landing page */
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25%       { transform: translateY(-18px) rotate(3deg); }
  75%       { transform: translateY(-8px) rotate(-2deg); }
}
.floating-animal { animation: float linear infinite; }

/* Scrollbar hiding (all browsers) */
body { overflow: scrollbar-x; }
::-webkit-scrollbar { display: none; }

/* Toast customization */
.Toastify__toast { border-radius: 12px; box-shadow: ...; }
.Toastify__toast--success { border: 1px solid #8EAF9D; color: #4a7c5f; }
.Toastify__toast--error   { border: 1px solid #f5c6cb; }
```

### Tailwind Usage Patterns

- Use Tailwind utility classes for all styling — no inline styles except for dynamic animation values (e.g. `animationDelay`)
- Use `primary` color aliases: `bg-primary`, `text-primary`, `border-primary`, `bg-primary/10`, etc.
- Responsive breakpoints: `sm:` (640px), `md:` (768px), `lg:` (1024px), `2xl:` (1536px)
- Common patterns:
  - Cards: `bg-white rounded-3xl p-6 shadow-sm`
  - Buttons in cards: `py-2.5 rounded-xl bg-primary text-white font-semibold hover:opacity-90 transition-opacity`
  - Input wrappers: `flex flex-col gap-4`
  - Page wrappers: `w-full lg:max-w-6xl m-auto mt-24 pb-24 h-full px-4`

---

## 18. Image Upload

### Cloudinary Upload (`src/_entities/resource/lib/upload.ts`)

```ts
const uploadFile = async (file: File): Promise<{ url: string; id: string } | null>
```

- Uploads directly to Cloudinary REST API (no backend proxy)
- Uses `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET`
- Returns `{ url: secure_url, id: public_id }` or `null` on failure

### Image Handling in Forms

Images are stored as `Image[]` in component state and also synced into the form via `setValue('images', [...])`.

The upload flow:
1. User selects files via `<input type="file" multiple />`
2. Placeholder images show immediately (url = `'placeholder'`)
3. Actual uploads run concurrently via `Promise.all`
4. Placeholders are replaced with real images after upload
5. `setValue('images', updatedImages, { shouldValidate: true })` syncs to form

Limits:
- Max 8 images total (validated client-side and in Yup schema)
- Max 10MB per file (toast error shown, upload skipped)

---

## 19. Error Handling

### API Errors

- Axios interceptor extracts and re-throws error with `.message` string
- Hooks use `toast.error(error.message)` in `onError` callbacks
- 401 on protected endpoints → redirect to `/login`

### Form Validation Errors

- Yup schema errors displayed inline via `error` prop on `<Input>`, `<Select>`, `<TextArea>`
- All messages go through `t('validation.*')` for i18n

### React Error Boundary (`src/_app/ui/ErrorBoundary.tsx`)

- Catches uncaught React render errors
- Shows a 500-style error page with "Try Again" and "Go Home" buttons
- In dev mode: shows expandable error details

### Route-Level Errors

HTTP error codes have dedicated routes: `/error/400`, `/error/401`, etc. The `<ErrorPage code={N}>` component handles all with appropriate emoji, title, and description from i18n.

---

## 20. Key Patterns & Conventions

### Hook Return Convention

All hooks return a flat object of everything the component needs — no sub-objects.

### Component-Hook Separation

Every page has a corresponding hook. **All business logic goes in the hook. The component only renders.** Example:

```
src/_pages/profile/
├── hooks/
│   └── useProfile.ts    ← all data fetching, state, handlers
└── ui/
    └── Profile.tsx      ← pure rendering, calls useProfile()
```

### Form Pattern

```tsx
const { register, handleSubmit, errors, onSubmit, isLoading } = useXxx();

<form onSubmit={handleSubmit(onSubmit)}>
  <Input register={register('fieldName')} error={errors.fieldName?.message} label={t('...')} />
  <Button type='submit' isLoading={isLoading}>Submit</Button>
</form>
```

### Category Rendering

Always translate category keys:

```tsx
t(`categories.${listing.category}`)  // 'dog' → 'Dog' / 'Pas'
```

### Mutation + Toast Pattern

```ts
const mutation = useMutation({
  mutationFn: () => axios.post('/endpoint', payload),
  onSuccess: () => {
    toast.success(t('toast.someKey'));
    queryClient.invalidateQueries({ queryKey: ['relevantKey'] });
  },
  onError: (error) => {
    toast.error(error.message);
  },
});
```

### Date Handling

- `date_of_birth` stored as `Date` on `Listing`
- `DatePicker` from NextUI works with `DateValue` from `@internationalized/date`
- Convert with: `parseDate('YYYY-MM-DD')` for pre-populating `EditListing`
- Display with: `dayjs(date).format('DD MMM YYYY')`

### Ownership Check

```ts
const isOwner = user?.id === listing.user.id;
```

### Query Key Conventions

| Data | Key |
|---|---|
| Current user | `['me']` |
| All listings | `['listings', page, limit, search, categories]` |
| Single listing | `['listings', id]` |
| My listings | `['my-listings']` |
| Any user | `['user', id]` |

---

## 21. Environment Variables

Create a `.env` file at root:

```env
VITE_APP_BACKEND_URL=http://localhost:8080/api
VITE_CLOUDINARY_CLOUD_NAME=<your_cloud_name>
VITE_CLOUDINARY_UPLOAD_PRESET=<your_upload_preset>
```

| Variable | Purpose |
|---|---|
| `VITE_APP_BACKEND_URL` | Full base URL for the REST API (no trailing slash) |
| `VITE_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name for image uploads |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Cloudinary unsigned upload preset name |

All accessed via `import.meta.env.VITE_*`. Only `VITE_` prefixed variables are exposed to the browser by Vite.

`import.meta.env.DEV` is used in `ErrorBoundary` to conditionally show error stack traces.

---

## Quick Reference: What Goes Where

| Task | File(s) to edit |
|---|---|
| Add a new page | `src/_pages/<name>/ui/` + `hooks/` + add route in `Routing.tsx` |
| Add a new API endpoint | `src/_entities/<domain>/api/` + export from `index.ts` |
| Add a new shared component | `src/_shared/ui/` + export from `index.ts` |
| Add a translation string | `src/locales/en.json` + `src/locales/hr.json` |
| Change validation rules | `src/_features/<domain>/model/*.ts` |
| Modify the navbar | `src/_widgets/AppDrawer/ui/AppDrawer.tsx` |
| Change auth redirect logic | `src/_app/Routing.tsx` (ProtectedRoute/GuestRoute) |
| Change API base URL | `.env` → `VITE_APP_BACKEND_URL` |
| Add a new query | `src/_entities/<domain>/api/useXxx.ts` |
| Change Tailwind colors | `tailwind.config.js` |
