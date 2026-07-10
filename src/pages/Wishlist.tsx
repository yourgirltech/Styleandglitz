import { Link } from "react-router-dom";
import { useWishlist } from "@/context/WishlistContext";
import { useProducts } from "@/context/ProductsContext";
import ProductCard from "@/components/ProductCard";
import MoissaniteCard from "@/components/MoissaniteCard";

export default function Wishlist() {
  const { productIds } = useWishlist();
  const { getById } = useProducts();
  const products = productIds.map(getById).filter(Boolean) as NonNullable<ReturnType<typeof getById>>[];

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-[60vh]">
      <div className="text-center mb-16">
        <p className="eyebrow text-gold mb-4">Saved</p>
        <h1 className="font-heading text-4xl md:text-5xl text-forest">Your Wishlist</h1>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-graphite/50 mb-8">
            Nothing saved yet. Tap the heart on any piece to keep it here.
          </p>
          <Link
            to="/watches"
            className="eyebrow border border-forest text-forest px-8 py-4 hover:bg-forest hover:text-cream transition-colors duration-500"
          >
            Browse Watches
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-5 gap-y-10">
          {products.map((p) =>
            p.category === "watches" ? (
              <ProductCard key={p.id} product={p} />
            ) : (
              <MoissaniteCard key={p.id} product={p} />
            )
          )}
        </div>
      )}
    </div>
  );
}