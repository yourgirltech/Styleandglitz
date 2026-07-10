import { useMemo, useState } from "react";
import HeroVideo from "@/components/HeroVideo";
import CategoryFilter from "@/components/CategoryFilter";
import MoissaniteCard from "@/components/MoissaniteCard";
import { moissaniteCategories } from "@/data/moissanite";
import { useProducts } from "@/context/ProductsContext";

export default function Moissanite() {
  const { moissanite } = useProducts();
  const [active, setActive] = useState<string>("All");

  const filtered = useMemo(
    () => (active === "All" ? moissanite : moissanite.filter((m) => m.subCategory === active)),
    [active, moissanite]
  );

  const categoriesWithStock = moissaniteCategories.filter((c) =>
    moissanite.some((m) => m.subCategory === c)
  );

  return (
    <>
      <HeroVideo
        video="/media/hero/Moissanite-section-herovideo.mp4"
        eyebrow="VVS1 Moissanite"
        headline={<>Light, Certified.</>}
        height="h-[70vh]"
      />

      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="eyebrow text-gold mb-4">GRA Certified</p>
          <h1 className="font-heading text-4xl md:text-5xl text-forest">Moissanite Jewellery</h1>
        </div>

        <div className="mb-16">
          <CategoryFilter options={categoriesWithStock} active={active} onChange={setActive} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-5 gap-y-10">
          {filtered.map((p) => (
            <MoissaniteCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}