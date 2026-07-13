import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "@/types/product";
import { formatPrice } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCartFX } from "@/context/CartFXContext";

export default function MoissaniteCard({ product }: { product: Product }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const heartRef = useRef<HTMLButtonElement>(null);
  const addBtnRef = useRef<HTMLButtonElement>(null);
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { triggerAddToCartFX } = useCartFX();
  const wishlisted = isWishlisted(product.id);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (inView) v.play().catch(() => {});
    else v.pause();
  }, [inView]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
  };
  const handleLeave = () => {
    setHovered(false);
    if (containerRef.current) containerRef.current.style.transform = "rotateX(0deg) rotateY(0deg)";
  };

  const handleHeartMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = heartRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.35;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.35;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };
  const handleHeartLeave = () => {
    if (heartRef.current) heartRef.current.style.transform = "translate(0,0)";
  };
  const handleHeartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    toggleWishlist(product.id);
    heartRef.current?.animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.3)" }, { transform: "scale(1)" }],
      { duration: 320, easing: "cubic-bezier(.34,1.56,.64,1)" }
    );
  };

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    addToCart(product.id);
    triggerAddToCartFX(e.currentTarget, product.image, product.name);
    addBtnRef.current?.animate(
      [{ transform: "scale(1)" }, { transform: "scale(0.94)" }, { transform: "scale(1)" }],
      { duration: 260, easing: "cubic-bezier(.34,1.56,.64,1)" }
    );
  };

  return (
    <div style={{ perspective: "900px" }}>
      <div
        ref={containerRef}
        className="group relative bg-cream border border-stone-dark/60 hover:border-gold/60 transition-[border-color] duration-700 ease-luxury"
        style={{ transformStyle: "preserve-3d", transition: "transform 150ms ease-out, border-color 700ms ease" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleLeave}
        onMouseMove={handleMove}
      >
        <Link to={`/product/${product.slug}`} className="block">
          <div className="p-3">
            <div className="relative aspect-[4/4.6] overflow-hidden bg-stone">
              {videoFailed ? (
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-luxury group-hover:scale-[1.03]"
                />
              ) : (
                <video
                  ref={videoRef}
                  src={product.video}
                  poster={product.image}
                  muted
                  loop
                  playsInline
                  preload="none"
                  onError={() => setVideoFailed(true)}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-luxury group-hover:scale-[1.03]"
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
              {product.graCertified && (
                <span className="absolute top-3 right-3 eyebrow bg-forest/85 text-cream px-2 py-1 text-[9px]">
                  GRA
                </span>
              )}

              <button
                ref={heartRef}
                aria-label="Toggle wishlist"
                onClick={handleHeartClick}
                onMouseMove={handleHeartMove}
                onMouseLeave={handleHeartLeave}
                style={{ transition: "transform 100ms ease-out, opacity 700ms ease, background-color 700ms ease, color 700ms ease" }}
                className={`absolute top-11 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm ${
                  hovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
                } ${wishlisted ? "bg-gold text-graphite" : "bg-cream/85 text-forest hover:bg-cream"}`}
              >
                <HeartIcon filled={wishlisted} />
              </button>

              <button
                ref={addBtnRef}
                onClick={handleAddToCart}
                className={`absolute bottom-3 left-3 right-3 bg-cream text-forest text-[11px] eyebrow py-2.5 transition-all duration-700 ease-luxury hover:bg-gold hover:text-graphite active:scale-[0.97] ${
                  hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
                }`}
              >
                Add to Cart
              </button>
            </div>
          </div>

          <div className="px-4 pb-4 pt-1 border-t border-stone-dark/40 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="eyebrow text-gold-dark/80 mb-1 truncate">{product.subCategory}</p>
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