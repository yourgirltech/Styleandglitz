import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "@/types/product";
import { formatPrice } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export default function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const handleEnter = () => {
    setHovered(true);
    videoRef.current?.play().catch(() => {});
  };
  const handleLeave = () => {
    setHovered(false);
    videoRef.current?.pause();
    if (videoRef.current) videoRef.current.currentTime = 0;
  };

  return (
    <div
      className="group relative bg-cream border border-stone-dark/60 hover:border-gold/60 transition-colors duration-700 ease-luxury"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <Link to={`/product/${product.slug}`} className="block">
        {/* Mat / frame padding around the image, like a boutique catalog card */}
        <div className="p-3">
          <div className="relative aspect-[4/4.6] overflow-hidden bg-stone">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1200ms] ease-luxury ${
                hovered && !videoFailed ? "opacity-0 scale-[1.03]" : "opacity-100 scale-100"
              }`}
            />
            {!videoFailed && (
              <video
                ref={videoRef}
                src={product.video}
                muted
                loop
                playsInline
                preload="none"
                onError={() => setVideoFailed(true)}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-luxury ${
                  hovered ? "opacity-100" : "opacity-0"
                }`}
              />
            )}

            <div
              className={`absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-graphite/60 to-transparent transition-opacity duration-700 ease-luxury ${
                hovered ? "opacity-100" : "opacity-0"
              }`}
            />

            {product.badge && (
              <span className="absolute top-3 left-3 eyebrow bg-cream/95 text-forest px-2.5 py-1 text-[10px]">
                {product.badge}
              </span>
            )}

            <button
              aria-label="Toggle wishlist"
              onClick={(e) => {
                e.preventDefault();
                toggleWishlist(product.id);
              }}
              className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-700 ease-luxury ${
                hovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
              } ${wishlisted ? "bg-gold text-graphite" : "bg-cream/85 text-forest hover:bg-cream"}`}
            >
              <HeartIcon filled={wishlisted} />
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                addToCart(product.id);
              }}
              className={`absolute bottom-3 left-3 right-3 bg-cream text-forest text-[11px] eyebrow py-2.5 transition-all duration-700 ease-luxury hover:bg-gold hover:text-graphite ${
                hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
              }`}
            >
              Add to Cart
            </button>
          </div>
        </div>

        <div className="px-4 pb-4 pt-1 border-t border-stone-dark/40 flex items-start justify-between gap-3">
          <div className="min-w-0">
            {product.brandLine && (
              <p className="eyebrow text-gold-dark/80 mb-1 truncate">{product.brandLine}</p>
            )}
            <p className="font-heading text-lg leading-snug text-graphite truncate">{product.name}</p>
            <p className="text-[11px] text-graphite/45 mt-1">
              {"★".repeat(Math.round(product.rating))}
              <span className="text-graphite/25">{"★".repeat(5 - Math.round(product.rating))}</span>
              <span className="ml-1.5 font-mono text-[10px]">({product.reviewCount})</span>
            </p>
          </div>
          <p className="font-mono text-xs text-forest whitespace-nowrap pt-1">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </div>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
      <path d="M12 21s-7.5-4.6-10-9.3C.4 8 2 4 6 4c2.2 0 3.9 1.4 6 4 2.1-2.6 3.8-4 6-4 4 0 5.6 4 4 7.7C19.5 16.4 12 21 12 21z" />
    </svg>
  );
}
