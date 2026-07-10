import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Product } from "@/types/product";
import { formatPrice } from "@/data/products";

/**
 * Placeholder feed. In production, replace this with a fetch to the
 * Instagram Graph API's /me/media edge (see src/lib/instagram.ts) and map
 * each returned media item's `permalink` back to a matching product by tag
 * or caption keyword.
 */
export default function InstagramGrid({ products }: { products: Product[] }) {
  const feed = useMemo(() => products.slice(0, 10), [products]);

  const [perView, setPerView] = useState(4);
  const [index, setIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const gap = 20;

  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      const pv = w < 640 ? 1.3 : w < 900 ? 2.2 : w < 1200 ? 3.2 : 4;
      setPerView(pv);
      const viewport = trackRef.current?.parentElement?.clientWidth ?? w;
      setCardWidth((viewport - gap * (Math.floor(pv) - 1)) / pv);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const maxIndex = Math.max(0, feed.length - Math.floor(perView));

  const goTo = (i: number) => setIndex(Math.min(Math.max(i, 0), maxIndex));

  // Autoplay — pauses whenever the pointer is over the carousel
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i >= maxIndex ? 0 : i + 1));
    }, 3800);
    return () => clearInterval(id);
  }, [paused, maxIndex]);

  const step = cardWidth + gap;
  const dragConstraint = maxIndex * step;

  return (
    <section id="instagram" className="py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="eyebrow text-gold mb-4">Shop Our Instagram</p>
          <h2 className="font-heading text-4xl md:text-5xl text-forest">@styleandglitz</h2>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Prev / Next */}
          <button
            aria-label="Previous"
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-cream border border-gold/50 items-center justify-center text-forest hover:bg-forest hover:text-cream hover:border-forest transition-colors duration-500 disabled:opacity-30 disabled:pointer-events-none"
          >
            <ArrowIcon direction="left" />
          </button>
          <button
            aria-label="Next"
            onClick={() => goTo(index + 1)}
            disabled={index === maxIndex}
            className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-cream border border-gold/50 items-center justify-center text-forest hover:bg-forest hover:text-cream hover:border-forest transition-colors duration-500 disabled:opacity-30 disabled:pointer-events-none"
          >
            <ArrowIcon direction="right" />
          </button>

          <div className="overflow-hidden">
            {cardWidth > 0 && (
              <motion.div
                ref={trackRef}
                className="flex"
                style={{ gap }}
                drag="x"
                dragConstraints={{ left: -dragConstraint, right: 0 }}
                dragElastic={0.05}
                animate={{ x: -index * step }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                onDragEnd={(_, info) => {
                  const movedBy = Math.round(-info.offset.x / step);
                  goTo(index + movedBy);
                }}
              >
                {feed.map((p) => (
                  <Link
                    key={p.id}
                    to={`/product/${p.slug}`}
                    style={{ width: cardWidth }}
                    className="group relative shrink-0 select-none"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        draggable={false}
                        className="h-full w-full object-cover transition-transform duration-[1200ms] ease-luxury group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-forest/0 group-hover:bg-forest/50 transition-colors duration-500" />
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <InstaIcon />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-1 group-hover:translate-y-0">
                        <p className="text-cream text-xs font-heading leading-tight truncate">
                          {p.name}
                        </p>
                        <p className="text-gold font-mono text-[10px] mt-0.5">
                          {formatPrice(p.price)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </motion.div>
            )}
          </div>

          {/* Dot pagination */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === index ? "w-8 bg-gold" : "w-1.5 bg-stone-dark"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function InstaIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="white" stroke="none" />
    </svg>
  );
}

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      {direction === "left" ? <path d="M15 6l-6 6 6 6" /> : <path d="M9 6l6 6-6 6" />}
    </svg>
  );
}
