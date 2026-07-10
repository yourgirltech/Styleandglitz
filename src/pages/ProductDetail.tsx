import { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { formatPrice } from "@/data/products";
import { useProducts } from "@/context/ProductsContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/ProductCard";
import MoissaniteCard from "@/components/MoissaniteCard";
import { DISCLAIMER_TEXT } from "@/components/DisclaimerModal";

export default function ProductDetail() {
  const { slug } = useParams();
  const { products, getBySlug, loading } = useProducts();
  const product = slug ? getBySlug(slug) : undefined;
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [showVideo, setShowVideo] = useState(false);

  if (loading && !product) {
    return <div className="min-h-screen flex items-center justify-center bg-cream">Loading...</div>;
  }
  if (!product) return <Navigate to="/" replace />;

  const related = products
    .filter((p) => p.id !== product.id && p.subCategory === product.subCategory)
    .slice(0, 4);

  const wishlisted = isWishlisted(product.id);

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <nav className="eyebrow text-graphite/40 mb-10">
        <Link to="/" className="hover:text-forest">Home</Link>
        <span className="mx-2">/</span>
        <Link to={`/${product.category}`} className="hover:text-forest capitalize">
          {product.category}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-graphite/70">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <div className="relative aspect-square overflow-hidden bg-stone mb-4">
            {showVideo ? (
              <video src={product.video} autoPlay muted loop playsInline className="h-full w-full object-cover" />
            ) : (
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            )}
            {product.badge && (
              <span className="absolute top-5 left-5 eyebrow bg-cream/90 text-forest px-3 py-1">
                {product.badge}
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowVideo(false)}
              className={`eyebrow px-4 py-2 border ${!showVideo ? "border-forest text-forest" : "border-stone-dark text-graphite/50"}`}
            >
              Image
            </button>
            <button
              onClick={() => setShowVideo(true)}
              className={`eyebrow px-4 py-2 border ${showVideo ? "border-forest text-forest" : "border-stone-dark text-graphite/50"}`}
            >
              Video
            </button>
          </div>
        </div>

        <div>
          {product.brandLine && <p className="eyebrow text-gold mb-3">{product.brandLine}</p>}
          <h1 className="font-heading text-4xl md:text-5xl text-forest mb-4">{product.name}</h1>
          <p className="text-sm text-graphite/50 mb-6">
            {"★".repeat(Math.round(product.rating))}
            <span className="text-graphite/25">{"★".repeat(5 - Math.round(product.rating))}</span>
            <span className="ml-2 font-mono text-xs">({product.reviewCount} reviews)</span>
          </p>
          <p className="font-mono text-2xl text-forest mb-8">{formatPrice(product.price)}</p>

          <p className="text-graphite/70 leading-relaxed mb-6">{product.description}</p>

          <p className="text-[11px] text-graphite/45 leading-relaxed border-l-2 border-gold/40 pl-4 mb-10">
            {DISCLAIMER_TEXT}
          </p>

          <div className="grid grid-cols-2 gap-8 mb-10">
            <div>
              <p className="eyebrow text-graphite/40 mb-3">Materials</p>
              <ul className="text-sm text-graphite/70 space-y-1">
                {product.materials.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow text-graphite/40 mb-3">Features</p>
              <ul className="text-sm text-graphite/70 space-y-1">
                {product.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          </div>

          {product.graCertified && (
            <div className="border border-gold/40 bg-gold/5 px-5 py-4 mb-10">
              <p className="eyebrow text-gold mb-1">GRA Certificate</p>
              <p className="text-sm text-graphite/60">
                Every stone ships with an independent GRA certificate confirming cut, clarity, and
                carat weight.
              </p>
            </div>
          )}

          <div className="flex gap-4 mb-8">
            <button
              onClick={() => addToCart(product.id)}
              className="flex-1 bg-forest text-cream eyebrow py-4 hover:bg-forest-dark transition-colors duration-500"
            >
              Add to Cart
            </button>
            <button
              onClick={() => addToCart(product.id)}
              className="flex-1 bg-gold text-graphite eyebrow py-4 hover:bg-gold-dark transition-colors duration-500"
            >
              Buy Now
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              aria-label="Toggle wishlist"
              className={`w-14 flex items-center justify-center border transition-colors duration-500 ${
                wishlisted ? "bg-gold border-gold text-graphite" : "border-stone-dark text-forest hover:border-forest"
              }`}
            >
              <HeartIcon filled={wishlisted} />
            </button>
          </div>

          <div className="hairline mb-6" />
          <p className="text-[10px] text-graphite/40 eyebrow mb-8">
            An independent, inspired-by design — not a product of the named brand.
          </p>
          <div className="flex justify-between text-xs text-graphite/50 eyebrow">
            <span>Shipping: 3–7 business days</span>
            <span>Warranty: 2 years</span>
            <span>{product.stock > 0 ? `${product.stock} in stock` : "Made to order"}</span>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-28">
          <p className="eyebrow text-gold text-center mb-4">You May Also Like</p>
          <h2 className="font-heading text-3xl md:text-4xl text-forest text-center mb-14">
            Related Pieces
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-x-5 gap-y-10">
            {related.map((p) =>
              p.category === "watches" ? (
                <ProductCard key={p.id} product={p} />
              ) : (
                <MoissaniteCard key={p.id} product={p} />
              )
            )}
          </div>
        </section>
      )}
    </div>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
      <path d="M12 21s-7.5-4.6-10-9.3C.4 8 2 4 6 4c2.2 0 3.9 1.4 6 4 2.1-2.6 3.8-4 6-4 4 0 5.6 4 4 7.7C19.5 16.4 12 21 12 21z" />
    </svg>
  );
}