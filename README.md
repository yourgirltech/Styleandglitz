# Style & Glitz — Luxury Digital Flagship Store

A cinematic e-commerce front-end for fine watches and GRA-certified VVS1 moissanite jewellery.
Built with React + TypeScript + Vite + Tailwind + Framer Motion, structured for Supabase,
Stripe, and the Instagram Graph API to be wired in next.

## Pages in this build

- **Home** — cinematic hero, luxury collections, shop-by-category, featured products, Our Story,
  Reviews, Shop-the-Instagram, and Personal Shopping Concierge (About / Reviews / Contact live
  here as sections, not separate routes)
- **Watches** — hero + brand-category filters (Rolex, Patek Philippe, Audemars Piguet, Cartier,
  Hublot, G-Shock inspired) + product grid with the hover-to-video card interaction
- **Moissanite** — hero + jewellery-category filters + product grid, where every card **always**
  plays its sparkle video (no hover required) since that's the whole point of the stone
- **Wishlist** and **Cart** — fully working with in-memory state (see `src/context`)
- **Product Detail** — supporting route every product card links to (image/video toggle,
  materials, GRA certificate block, related products)

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Supabase / Instagram / Stripe keys when ready
npm run dev
```

## Dropping in your real photos and videos

See `public/media/README.md`. Every product's expected filename is defined in
`src/data/watches.ts` and `src/data/moissanite.ts` — copy files in with the same names
and everything lights up with no code changes.

## What's stubbed, ready to connect

- **Supabase** (`src/lib/supabase.ts`) — client initializes automatically once
  `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are set. Suggested tables are listed inline.
  This is also where an **admin dashboard** (add/edit/delete product, inventory, orders,
  customers, wishlist analytics) would read and write from.
- **Instagram Graph API** (`src/lib/instagram.ts`) — `fetchRecentInstagramMedia()` is ready to
  call once `VITE_IG_USER_ID` / `VITE_IG_ACCESS_TOKEN` are set. Until then, the Instagram grid
  on the homepage falls back to a product-based placeholder feed.
- **Stripe** — the Cart page's Checkout button is wired to nothing yet; swap in
  `@stripe/stripe-js` + a Checkout Session once payments are ready.

## Deploying

This is a standard Vite app — connect the repo to Netlify (or Vercel) and use:

- Build command: `npm run build`
- Publish directory: `dist`

## Design tokens

Colors, type, and motion are defined once in `tailwind.config.ts`:
- Forest green / sage / warm cream / soft stone / muted gold / deep graphite
- Cormorant Garamond (headings), DM Serif Display (subheadings), Inter (body),
  IBM Plex Mono (prices, numbers, eyebrows)
- A single easing curve (`ease-luxury`) used everywhere so motion feels consistent
