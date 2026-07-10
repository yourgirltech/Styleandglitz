# Media assets

Your real photos and videos from "style and glitz media" are already in place below —
this file is now just a map of what's here and a guide for adding more later.

A couple of products are missing a matching asset from what was uploaded so far:
- **Hoop Earring** (moissanite) has a photo but no video yet — the card falls back to
  the static photo automatically until a video is added.
- **Cuban Necklace & Jesus Piece**, **HER Necklace**, **HER Stack Combo**,
  **Hublot & Tennis Combo**, **Men's Bracelet**, **Tennis Cross Pendant Necklace**,
  **Unisex Stud Earring**, **Cloud Stud Earring**, and **Bracelet Stack** didn't have a
  matching photo uploaded — a still frame was pulled from each product's own video with
  ffmpeg to use as the card's fallback poster image. Swap in a real product photo any
  time by replacing the matching `.jpeg` file with the same name.

To add new products later, copy files into the matching folder below using the
**exact filenames** referenced in `src/data/watches.ts` / `src/data/moissanite.ts`.

```
public/media/
├── hero/
│   ├── Herosection-Video.mp4              → Home page hero
│   ├── WatchesPage-herovideo.mp4          → Watches page hero
│   └── Moissanite-section-herovideo.mp4   → Moissanite page hero
├── watches/
│   ├── Rolex-Skydweller-pic.jpeg
│   ├── Rolex-Skydweller-vid.mp4
│   ├── Rolex-stonedcosmograph-pic.jpeg
│   ├── ...one -pic.jpeg + one -vid.mp4 per watch, see src/data/watches.ts
└── moissanite/
    ├── VVS1 MOISSANITE CROSS PENDANT.jpeg
    ├── VVS1 CROSS PENDANT NECKLACE.mp4
    ├── ...see src/data/moissanite.ts for the full file list
```

Every product's expected filenames are listed in `src/data/watches.ts` and
`src/data/moissanite.ts` (the `image` / `video` fields). If you rename a file on your
end, update that one line rather than the whole catalog.

Until real assets are dropped in, `<img>` tags will 404 gracefully to broken-image
icons and videos simply won't play — everything else (layout, cart, wishlist,
filters) works with placeholder data already.
