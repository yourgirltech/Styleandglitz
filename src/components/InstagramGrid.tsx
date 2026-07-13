import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "@/types/product";
import { formatPrice } from "@/data/products";


export default function InstagramGrid({ products }: { products: Product[] }) {
  const feed = useMemo(() => products.slice(0, 10), [products]);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cardWidth, setCardWidth] = useState(300);
  const wrapRef = useRef<HTMLDivElement>(null);
  const sideScale = 0.78;

  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      setCardWidth(w < 480 ? 170 : w < 768 ? 210 : w < 1100 ? 250 : 280);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  useEffect(() => {
    if (paused || feed.length === 0) return;
    const id = setInterval(() => {
      setActive((a) => (a + 1) % feed.length);
    }, 3600);
    return () => clearInterval(id);
  }, [paused, feed.length]);

  const gap = 84;
  const cardHeight = cardWidth * 1.25;
  const sideOffset = cardWidth * sideScale + gap;
  const stageWidth = cardWidth + sideOffset * 2 + 20;
  const stageHeight = cardHeight + 24;

  return (
    <section id="instagram" className="py-28 bg-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="eyebrow text-gold mb-4">Shop Our Instagram</p>
          <h2 className="font-heading text-4xl md:text-5xl text-forest">@styleandglitz</h2>
        </div>

        <div
          ref={wrapRef}
          className="relative mx-auto overflow-hidden"
          style={{ width: stageWidth, height: stageHeight }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {feed.map((p, i) => {
            let delta = (i - active + feed.length) % feed.length;
            if (delta > feed.length / 2) delta -= feed.length;

            let x = 0;
            let opacity = 0;
            let scale = sideScale * 0.9;
            let z = 0;
            let pointerEvents: "auto" | "none" = "none";
            let isActive = false;

            if (delta === 0) {
              x = 0;
              opacity = 1;
              scale = 1;
              z = 3;
              pointerEvents = "auto";
              isActive = true;
            } else if (delta === 1) {
              x = sideOffset;
              opacity = 0.55;
              scale = sideScale;
              z = 2;
              pointerEvents = "auto";
            } else if (delta === -1) {
              x = -sideOffset;
              opacity = 0.55;
              scale = sideScale;
              z = 2;
              pointerEvents = "auto";
            } else {
              x = delta > 0 ? sideOffset * 1.6 : -sideOffset * 1.6;
              opacity = 0;
              z = 0;
            }

            return (
              <Link
                key={p.id}
                to={`/product/${p.slug}`}
                onClick={(e) => {
                  if (delta === 1 || delta === -1) {
                    e.preventDefault();
                    setActive(i);
                  }
                }}
                className="absolute top-3 left-1/2"
                style={{
                  width: cardWidth,
                  height: cardHeight,
                  marginLeft: -cardWidth / 2,
                  transform: `translateX(${x}px) scale(${scale})`,
                  opacity,
                  zIndex: z,
                  pointerEvents,
                  transition: "transform 800ms cubic-bezier(0.22,1,0.36,1), opacity 800ms cubic-bezier(0.22,1,0.36,1)",
                }}
              >
                <div
                  className="relative w-full h-full overflow-hidden"
                  style={{
                    border: isActive ? "1px solid #C9A227" : "1px solid transparent",
                    boxShadow: isActive ? "0 24px 48px rgba(15,23,42,0.22)" : "none",
                  }}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    draggable={false}
                    className="h-full w-full object-cover"
                    style={{
                      transform: isActive ? "scale(1.06)" : "scale(1)",
                      transition: "transform 3600ms ease-out",
                    }}
                  />
                  <div
                    className="absolute inset-0 bg-forest transition-opacity duration-700"
                    style={{ opacity: isActive ? 0 : 0.38, mixBlendMode: "multiply" }}
                  />

                  {isActive && (
                    <>
                      <CornerMark className="top-2 left-2" />
                      <CornerMark className="top-2 right-2 rotate-90" />
                      <CornerMark className="bottom-2 left-2 -rotate-90" />
                      <CornerMark className="bottom-2 right-2 rotate-180" />
                    </>
                  )}

                  <div
                    className="absolute inset-x-0 bottom-0 p-4 transition-opacity duration-500"
                    style={{ opacity: isActive ? 1 : 0 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-graphite/80 via-graphite/15 to-transparent -z-10" />
                    <p className="eyebrow text-gold/90 mb-1">{p.subCategory || p.brandLine}</p>
                    <p className="text-cream text-sm font-heading leading-tight truncate">{p.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-gold font-mono text-xs">{formatPrice(p.price)}</p>
                      <span className="text-cream/70 text-[10px] eyebrow">View piece →</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-4 mt-8">
          <span className="font-mono text-xs text-graphite/40">
            {String(active + 1).padStart(2, "0")} — {String(feed.length).padStart(2, "0")}
          </span>
          <div className="w-32 h-px bg-stone-dark relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gold transition-all duration-700 ease-luxury"
              style={{ width: `${((active + 1) / feed.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function CornerMark({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={`absolute text-gold ${className}`}>
      <path d="M1 15V5a4 4 0 0 1 4-4h10" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}