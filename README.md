# Style & Glitz — Luxury Digital Flagship Store

A full-stack e-commerce site for fine watches and GRA-certified VVS1 moissanite jewelry — built as a cinematic, boutique-style storefront rather than a generic shop template, with a complete backend (accounts, admin dashboard, and payments) behind it.

**Live site:** https://styleandglitz.netlify.app

---

## Tech Stack

**Frontend**
- React + TypeScript, built with [Vite](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Framer Motion](https://www.framer.com/motion/) for page transitions and reveal animations
- [React Router](https://reactrouter.com) for client-side routing
- [Redux Toolkit](https://redux-toolkit.js.org) for cart/wishlist state (see [State Management](#state-management))

**Backend / Infrastructure**
- **[Supabase](https://supabase.com)** — Postgres database, Auth (separate admin and customer logins), Storage (product image/video uploads), and Edge Functions (serverless functions for payment processing)
- **[Paystack](https://paystack.com)** — payment processing (chosen over Stripe, which doesn't support Nigerian merchants directly)
- **[Netlify](https://netlify.com)** — hosting, with automatic deploys on every push to GitHub

**Testing**
- [Jest](https://jestjs.io) + [ts-jest](https://kulshekhar.github.io/ts-jest/) for the test runner
- [React Testing Library](https://testing-library.com/react) for component tests

---

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

### Required environment variables (`.env.local`)

| Variable | Purpose | Required? |
|---|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes — the app falls back to the static catalog and disables auth/checkout without it |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key | Yes, same as above |
| `VITE_IG_USER_ID` | Instagram Graph API user ID | No — only needed once the live Instagram sync (see [Known Gaps](#known-gaps--not-yet-done)) is wired up |
| `VITE_IG_ACCESS_TOKEN` | Instagram Graph API access token | No, same as above |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Reserved for a possible future Stripe integration | No — unused; Paystack is the only active payment provider |

> `.env.example` ships with this project's actual Supabase URL and anon key pre-filled, since the anon key is safe to expose publicly (access is enforced by Postgres RLS policies, not by keeping the key secret). Payment secrets are never exposed to the frontend — see [Payments](#payments-paystack).

### Other scripts

```bash
npm run build     # tsc -b && vite build
npm run preview   # preview the production build locally
npm run lint      # ESLint
npm test          # Jest (unit + component tests)
```

---

## Design System

| Token | Hex | Used for |
|---|---|---|
| `forest` (primary) | `#0F172A` Midnight Navy | Headings, dark backgrounds, primary buttons |
| `sage` (secondary) | `#334155` Slate Blue | Muted text, secondary accents |
| `cream` (base) | `#FAF8F4` Soft Ivory | Site-wide background |
| `stone` (neutral) | `#E5E7EB` Warm Platinum | Card backgrounds, dividers |
| `gold` (accent) | `#C9A227` Brushed Gold | Prices, borders, hover states, badges |
| `graphite` (ink) | `#0B1120` | Body text |

**Typography:** Cormorant Garamond (headings), DM Serif Display (subheadings), Inter (body), IBM Plex Mono (prices, eyebrows, numeric labels)

All tokens are defined once in `tailwind.config.ts` — no hardcoded hex values should appear in component files.

---

## Pages & Routes

| Route | Purpose |
|---|---|
| `/` | Home — hero, curated collections, category diptych, featured products, reviews, Instagram-style carousel, concierge |
| `/watches`, `/moissanite` | Category pages with brand/type filtering |
| `/product/:slug` | Product detail — gallery, description, GRA certificate info, related items |
| `/cart` | Cart + checkout |
| `/wishlist` | Saved items |
| `/signup`, `/login`, `/account` | Customer accounts — signup, login, profile, order history |
| `/checkout/callback` | Landing page after Paystack payment — verifies payment server-side before confirming the order |
| `/admin/login`, `/admin`, `/admin/products/new`, `/admin/products/:id/edit` | Admin dashboard (protected, single admin account) |

---

## State Management

Split deliberately rather than using one approach everywhere:

- **Redux Toolkit** (`src/store/`) — cart and wishlist. Both have real reducer logic worth testing in isolation (quantity increment/decrement, the "quantity ≤ 0 removes the line" edge case, toggle-on/toggle-off), so a dedicated slice with unit tests made sense.
- **React Context** — products (synced from Supabase), customer auth session, admin auth session, and cart visual-effects state (the fly-to-cart animation). These either wrap an external subscription (Supabase's auth listener) or are simple enough that a full store would be overhead without benefit.

Components consume both through custom hooks (`useCart()`, `useWishlist()`, `useProducts()`, etc.) — the underlying implementation (Redux vs. Context) is an internal detail; call sites don't need to know or care which one they're using.

---

## Testing

```bash
npm test
```

- **Reducer tests** (`src/store/*.test.ts`) — cart and wishlist slices, covering add/remove/quantity edge cases and toggle behavior.
- **Component tests** (`src/components/*.test.tsx`) — render with React Testing Library against a real (in-memory) Redux store and the app's own context providers, so assertions check actual state changes rather than mocked callbacks.
- Config lives in `jest.config.ts` (ts-jest + jsdom); `jest.setup.ts` adds `@testing-library/jest-dom` matchers and a minimal polyfill for `Element.prototype.animate` (used by the fly-to-cart animation, which jsdom doesn't implement).
- Static assets (`.mp4`, `.jpeg`, `.jpg`, `.png`, `.svg`) are mapped to a stub module (`src/__mocks__/fileMock.ts`) so importing them doesn't break the test environment.
- `src/lib/supabase.ts` returns `null` when Supabase env vars are absent, so component tests mock it out (`jest.mock("@/lib/supabase", ...)`) rather than hitting the network.

---

## Database (Supabase — `public` schema)

| Table | Purpose |
|---|---|
| `products` | Full catalog — the single source of truth once seeded; the storefront reads live from here, not from the static `src/data/*.ts` files |
| `profiles` | Customer name, phone, shipping address |
| `orders` / `order_items` | Order history, linked to the customer who placed them |
| `newsletter_subscribers` | Footer newsletter signups |

A `decrement_product_stock` Postgres function (called via RPC, not a direct table write) handles stock reduction after a confirmed order — customers can trigger this one narrow operation without needing broad write access to the `products` table.

> **Note:** this Supabase project is shared with another, unrelated app. Tables and RLS policies here were written defensively with that in mind — nothing here should assume it's the only thing using this database.

### Seeding the database

`src/data/watches.ts` and `src/data/moissanite.ts` hold the original static catalog (also used as an instant-render fallback in `ProductsContext` while the live Supabase fetch is in flight). To push that catalog into Supabase:

```bash
VITE_SUPABASE_URL=... VITE_SUPABASE_ANON_KEY=... ADMIN_EMAIL=... ADMIN_PASSWORD=... npx tsx scripts/seed-products.mjs
```

From then on, use the `/admin` dashboard to manage products — no need to touch the static files or re-run the seed script.

---

## Key Features

- **Product cards** — hover-to-video reveal on watch cards; moissanite cards autoplay their video by default (the sparkle is the point); subtle 3D tilt tracking on hover; magnetic wishlist button; fly-to-cart animation with a gold sparkle burst and a self-drawing checkmark toast on Add to Cart
- **Admin dashboard** — add/edit/delete products, direct image/video upload to Supabase Storage, locked to one specific admin email at both the database (RLS) and frontend level
- **Customer accounts** — signup/login, profile + shipping address, order history
- **Checkout** — Paystack-hosted payment page → payment verified server-side via a Supabase Edge Function (never trusts the redirect alone) → order saved → stock decremented
- **Legal disclaimer** — entry modal plus a repeated note on every product page, clarifying that pieces are independent, inspired-by designs and not licensed by the named watch brands
- **Newsletter** — real email capture into Supabase, viewable in Table Editor
- **Route-aware navbar** — solid/dark-on-cream styling on pages without a hero video, transparent-fading-to-solid on pages that have one, rather than relying on scroll position alone

---

## Payments (Paystack)

Two Supabase Edge Functions handle payment, keeping the secret key server-side:

- `initialize-payment` — starts a transaction, returns the hosted payment page URL
- `verify-payment` — confirms with Paystack directly whether a payment actually succeeded (cart contents travel through Paystack's own `metadata` field, not browser storage, since `sessionStorage`/`localStorage` proved unreliable across the redirect round-trip)

**Required Supabase secrets** (Edge Functions → Manage secrets):

| Secret | Value |
|---|---|
| `PAYSTACK_SECRET_KEY` | Your Paystack secret key (`sk_test_...` or `sk_live_...`) |
| `SITE_URL` | Your deployed site's exact URL, no trailing slash |

Switching between Paystack test and live mode only requires swapping `PAYSTACK_SECRET_KEY` — no code changes, no redeploy.

---

## Deployment

Connected to Netlify via GitHub — every push to `main` triggers an automatic deploy.

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Required Netlify environment variables:** same two as `.env.local` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) — must be added in Netlify's site settings separately, since `.env.local` is git-ignored and never uploaded
- **`public/_redirects`** contains `/* /index.html 200` — required for a single-page app on Netlify, otherwise direct links to any route other than `/` 404

---

## Known Gaps / Not Yet Done

- **CI test automation** — Jest tests currently run locally only (`npm test`); a GitHub Actions workflow to run them automatically on every push/PR is planned but not yet wired up
- **Component-level RTL tests** — coverage so far is the cart/wishlist reducers plus `ProductCard`; interaction tests for checkout, admin, and auth flows are the next planned addition
- **Shop Our Instagram** section currently pulls from the product catalog, not a live Instagram feed — real sync via the Instagram API (Instagram Login flow, no Facebook Page required) is in progress
- **Shipping / Returns / Privacy / Terms** footer links point to homepage anchors that don't exist yet — need either real written policy pages or placeholder pages
