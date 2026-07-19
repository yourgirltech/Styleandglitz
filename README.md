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

**Backend / Infrastructure**
- **[Supabase](https://supabase.com)** — Postgres database, Auth (separate admin and customer logins), Storage (product image/video uploads), and Edge Functions (serverless functions for payment processing)
- **[Paystack](https://paystack.com)** — payment processing (chosen over Stripe, which doesn't support Nigerian merchants directly)
- **[Netlify](https://netlify.com)** — hosting, with automatic deploys on every push to GitHub

---

## Design System

| Token | Hex | Used for |
|---|---|---|
| `forest` (primary) | `#0F172A` Midnight Navy | Headings, dark backgrounds, primary buttons |
| `sage` (secondary) | `#334155` Slate Blue | Muted text, secondary accents |
| `cream` (base) | `#FAF8F4` Soft Ivory | Site-wide background |
| `stone` (neutral) | `#E5E7EB` Warm Platinum | Card backgrounds, dividers |
| `gold` (accent) | `#C9A227` Brushed Gold | Prices, borders, hover states, badges |
| `graphite` (ink) | `#14171F` | Body text |

**Typography:** Cormorant Garamond (headings), DM Serif Display (subheadings), Inter (body), IBM Plex Mono (prices, eyebrows, numeric labels)

All tokens are defined once in `tailwind.config.ts` — no hardcoded hex values should appear in component files.

---

## Getting Started

```bash
npm install
cp .env.example .env.local  
npm run dev
```

### Required environment variables (`.env.local`)