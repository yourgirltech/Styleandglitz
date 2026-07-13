# Style & Glitz — Luxury Digital Flagship Store

A cinematic e-commerce front-end for fine watches and GRA-certified VVS1 moissanite jewellery.
Built with React + TypeScript + Vite + Tailwind + Framer Motion, structured for Supabase,
paystack, and the Instagram Graph API to be wired in next.

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

See `public/media/README.md`
`src/data/watches.ts` and `src/data/moissanite.ts` 
## What's stubbed, ready to connect

- **Supabase** (`src/lib/supabase.ts`) — 
  `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` 
  .
- **Instagram Graph API** (`src/lib/instagram.ts`) — `fetchRecentInstagramMedia()`
  call once `VITE_IG_USER_ID` / `VITE_IG_ACCESS_TOKEN`
  `
## Deploying



- Build command: `npm run build`
- Publish directory: `dist`

## Design tokens

Colors, type, and motion are defined once in `tailwind.config.ts`:
- Midnight Navy / Slate Blue/ Soft Ivory/  Warm Platinum / warm gold / deep graphite
- Cormorant Garamond (headings), DM Serif Display (subheadings), Inter (body),
  IBM Plex Mono (prices, numbers, eyebrows)
- A single easing curve (`ease-luxury`) used everywhere so motion feels consistent
