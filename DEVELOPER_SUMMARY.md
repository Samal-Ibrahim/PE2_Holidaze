# Developer Summary — Holidaze Venue Booking Platform

## What the Application Does

Holidaze is a full-stack-style single-page application that functions as a two-sided venue booking marketplace. Regular users can search, filter, and book venues, manage their reservations, and customise their profiles. Venue managers get a dedicated dashboard to create, edit, and delete their listings, and can see exactly which dates are reserved by guests — all from the same authenticated experience.

---

## Problem It Solves

Most accommodation booking interfaces are read-only for guests and require a separate admin tool for hosts. Holidaze unifies both workflows in one React application: a guest can reserve a venue in a few clicks using a live availability calendar, while the same app lets a property manager list and manage multiple venues without ever leaving the site. The platform targets Noroff students, so it enforces institutional email registration and a shared API key model, solving the authentication complexity of a school-issued REST API.

---

## Key Features

### Guest Experience
- **Search & filter** venues by name, city, price range, star rating, and amenities (WiFi, parking, breakfast, pets) — all processed client-side for instant feedback
- **Interactive booking calendar** powered by React Day Picker — already-booked dates are disabled and highlighted in red; past dates are blocked automatically; the user picks a date range and guest count
- **Profile page** with separate "My Bookings" and "My Venues" tabs
- **Cancel a booking** with a confirmation prompt and optimistic cache invalidation

### Venue Manager Experience
- **Create & edit venues** with multi-image management, amenity toggles, and full location fields including optional GPS coordinates
- **Dynamic media list** — managers can add or remove images individually; each item tracks both a URL and alt-text
- **Role-gated navigation** — the "Create Venue" route is hidden and server-validated for non-managers; unauthorised visits are silently redirected
- **Delete venue** with confirmation

### Cross-Cutting
- **Token-based auth** with persistent session (localStorage) and global AuthContext
- **Toast notifications** for every success and failure state
- **Skeleton loading UI** to prevent layout shift during data fetches
- **404 not-found page** with navigation back to home
- **Biome + Husky + lint-staged** enforce code style on every commit

---

## My Responsibilities as the Developer

I implemented the entire application from scratch:

- **Architecture** — Designed the folder structure separating the API layer (`src/api/`), shared components, hooks, validators, types, and page-level code; established a single-entry `apiClient.ts` that every API module uses
- **Authentication flow** — Registration with Zod-validated forms, login with JWT storage, logout, route guards (`ProtectedRoute`, `LoggedInRoute`, `VenueManagerRoute`), and an `AuthContext` that survives page reloads via localStorage
- **Venue browsing page** — Fetching paginated venue lists, all five filter types, four sort options, and client-side pagination logic using `useMemo` to avoid redundant re-computation
- **Booking system** — Date-range selection with React Day Picker, pre-disabling booked date ranges by building a `Set<string>` from the venue's existing bookings, guest-count validation, and the POST booking mutation with cache invalidation
- **Profile dashboard** — Two-tab layout; "My Bookings" with cancellation, "My Venues" with inline edit/delete; edit-profile modal that overlays the profile page using React Router location state
- **Venue create/edit forms** — Dynamic media array state, Zod schema validation for every field, create and update mutations, and navigation back to the profile after success
- **Error handling** — Custom `ApiError` class that captures HTTP status and the API's error message array; all errors surface as toast notifications with a human-readable message
- **Data normalisation utilities** — `normalizeVenues` and `normalizeSingleVenue` clean API responses and supply sensible defaults (fallback images, "N/A" strings) to prevent runtime crashes from missing fields
- **Full TypeScript coverage** — All components, hooks, API functions, and utility helpers are typed; Zod schemas generate TypeScript types via `z.infer<>` so form types and validation rules share a single definition

---

## Technical Challenges and How They Were Solved

**1. Calendar state de-sync after booking**
After a booking was created, the date picker briefly kept the previously selected range. The root cause was `useState` initialising from props only once. The fix was to explicitly reset the selected range inside the mutation's `onSuccess` callback, making the cleared state the source of truth rather than the parent component re-rendering.

**2. Server state vs. UI state boundary**
It was unclear whether filters, pagination, and sort order should live in React Query or local state. I settled on TanStack Query for all *remote* data and plain `useState` for all *derived UI state* (filters, page index, etc.), keeping query keys stable and avoiding unnecessary cache busts.

**3. Role check timing**
`VenueManagerRoute` needed to verify the `venueManager` flag before rendering the route. I used a `useQuery` inside the guard component to fetch the profile, displayed a loading state while the check was pending, and only redirected once the response was confirmed. This prevented false redirects caused by the race between rendering and auth resolution.

**4. Whitespace-caused refactor failures**
When standardising Tailwind class strings across components, some search-and-replace operations silently failed. Inspecting the raw file revealed tabs mixed with spaces — a good reminder that visual similarity does not guarantee byte equality. Biome's formatter fixed the inconsistency across the whole codebase in one pass.

**5. Scalable image management in forms**
Allowing managers to add/remove multiple images with individual URLs and alt-text could have become a tangle of indexed state. I modelled the list as an array of objects `{ url, alt }` and extracted `handleAddImage` and `handleRemoveImage` helpers so each operation was a pure array transformation that React could reconcile predictably.

---

## Technologies Used — and How

| Technology | How it was actually used |
|---|---|
| **React 19** | Functional components throughout; hooks for all side-effects and local state; no class components |
| **TypeScript ~5.9** | Strict mode enabled; generic types on API helpers (`apiCall<T>`); Zod-inferred types mean form types are never duplicated |
| **Vite 7** | Dev server with HMR; path alias `@` → `src/`; environment variable validation at boot via `validateEnv()` |
| **React Router 7** | Nested routes with three custom guard components; modal overlays built on `location.state` so the background page stays mounted |
| **TanStack Query 5** | `useQuery` for all reads, `useMutation` for writes; `queryClient.invalidateQueries()` called in `onSuccess` for automatic UI refresh; `staleTime: 5 min` and `gcTime: 10 min` tuned to the API's update frequency |
| **Tailwind CSS 4** | Utility classes with a custom `2xs: 320px` breakpoint; component classes (`.btn`, `.card`) extracted to `components.css` to avoid repetition; `@tailwindcss/line-clamp` for venue card descriptions |
| **Zod 4** | Schema-first validation: schemas defined once in `lib/validators/schemas.ts`, types inferred with `z.infer<>`, and validated at form-submit time — no manual field checks |
| **React Day Picker 9** | Calendar configured with `mode="range"`, `disabled` prop fed a computed array of all booked dates, and `onDayClick` wired to local range state |
| **React Toastify** | Single `<ToastContainer>` in `App.tsx`; `toast.success` / `toast.error` called from mutations; avoids prop-drilling an alert system |
| **Biome** | Replaces ESLint + Prettier in a single tool; runs on `pre-commit` via Husky + lint-staged; enforces tab indentation, double quotes, and 100-char lines |
| **Fetch API** | Wrapped in `apiCall<T>()` which attaches `Authorization: Bearer <token>` and `X-Noroff-API-Key` headers, parses JSON, and throws a structured `ApiError` on non-2xx responses |

---

## Performance, UX, and Architectural Decisions

**Performance**
- **Client-side filtering** avoids extra API round-trips for every filter change; the full page of 100 venues is fetched once and filtered in memory using `useMemo`, recomputing only when the filter dependencies change
- **Skeleton loading** components occupy the exact layout space of real venue cards, so the page does not jump when data arrives
- **Single image in venue lists** — only the first photo is rendered per card, reducing initial DOM size; the gallery is only mounted on the detail page
- **Query caching** — a venue visited and re-visited within 5 minutes is served from cache with no network request

**UX**
- Booked dates rendered in a distinct red colour inside the calendar, not just disabled, so managers and guests can understand availability at a glance
- Filter panel collapses to a slide-in overlay on mobile rather than hiding, keeping the feature accessible without consuming viewport space
- After a booking is cancelled the list refreshes automatically — the user does not need to reload
- Empty search results show a clear message instead of a blank page

**Architecture**
- The API layer (`src/api/`) is completely decoupled from React; every file exports plain async functions; this makes it easy to unit-test or swap the underlying transport without touching components
- `normalizeVenues` and `normalizeSingleVenue` utilities sit between the API and the UI; they guarantee that every field used in a template has at least a sensible default, pushing defensive logic out of components
- All route paths and API base URLs live in `config/constants.ts` — changing the API host requires editing one line

---

## What Stands Out for a Recruiter

- **End-to-end implementation** — this is not a tutorial follow-along; every layer (routing, auth, data fetching, validation, UI) was designed and built as a cohesive system
- **Two distinct user roles** with separate protected routes, separate profile tabs, and a server-verified role check — not just a flag hidden in local state
- **Real-world patterns**: centralised API client with typed errors, Zod schema-driven forms, React Query with deliberate cache settings, and location-state modals
- **Self-directed code review** — after completing initial features, a systematic codebase audit was performed, catching and fixing 20+ inconsistencies before they became bugs
- **TypeScript used meaningfully** — not just for function signatures, but for generic API helpers, schema-inferred form types, and prop interfaces; the type system was used as a refactoring safety net
- **Tooling maturity** — Biome, Husky, and lint-staged mean no unformatted or un-linted code can be committed; this is the kind of CI hygiene expected in professional teams
