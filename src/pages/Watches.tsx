import { useMemo, useState } from "react";
import HeroVideo from "@/components/HeroVideo";
import CategoryFilter from "@/components/CategoryFilter";
import ProductCard from "@/components/ProductCard";
import { watchBrands } from "@/data/watches";
import { useProducts } from "@/context/ProductsContext";

export default function Watches() {
  const { watches } = useProducts();
  const [active, setActive] = useState<string>("All");

  const filtered = useMemo(
    () => (active === "All" ? watches : watches.filter((w) => w.subCategory === active)),
    [active, watches]
  );

  return (
    <>
      <HeroVideo
        video="/media/hero/WatchesPage-herovideo.mp4"
        eyebrow="Timepieces"
        headline={<>Precision, Worn Quietly.</>}
        height="h-[70vh]"
      />

      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="eyebrow text-gold mb-4">Brand Categories</p>
          <h1 className="font-heading text-4xl md:text-5xl text-forest">Luxury Watches</h1>
        </div>

        <div className="mb-16">
          <CategoryFilter options={watchBrands} active={active} onChange={setActive} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-5 gap-y-10">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-graphite/50 py-20">
            No pieces in this category yet — check back soon.
          </p>
        )}
      </section>
    </>
  );
}