import { motion } from "framer-motion";
import HeroVideo from "@/components/HeroVideo";
import CategoryDiptych from "@/components/CategoryDiptych";
import ProductCard from "@/components/ProductCard";
import MoissaniteCard from "@/components/MoissaniteCard";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import ConciergeSection from "@/components/ConciergeSection";
import InstagramGrid from "@/components/InstagramGrid";
import { useProducts } from "@/context/ProductsContext";

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const { watches, moissanite, products } = useProducts();

  if (watches.length === 0 || moissanite.length === 0) {
    return <div className="min-h-screen flex items-center justify-center bg-cream">Loading...</div>;
  }

  const collections = [
    { title: "New Arrivals", image: watches[3]?.image, video: watches[3]?.video },
    { title: "Best Sellers", image: watches[0]?.image, video: watches[0]?.video },
    { title: "Signature Timepieces", image: watches[7]?.image, video: watches[7]?.video },
    { title: "Wedding Collection", image: moissanite[2]?.image, video: moissanite[2]?.video },
    { title: "Everyday Luxury", image: moissanite[8]?.image, video: moissanite[8]?.video },
    { title: "Limited Edition", image: watches[1]?.image, video: watches[1]?.video },
  ];

  const featured = [...watches.slice(0, 8), ...moissanite.slice(0, 7)];

  return (
    <>
      <HeroVideo
        video="/media/hero/Herosection-Video.mp4"
        eyebrow="Style & Glitz"
        headline={<>Luxury That Speaks Without Words.</>}
        cta={[
          { label: "Explore Watches", to: "/watches" },
          { label: "Shop Jewellery", to: "/moissanite" },
        ]}
      />

      <section className="py-28 px-6 max-w-7xl mx-auto">
        <Reveal>
          <p className="eyebrow text-gold text-center mb-4">Luxury Collections</p>
          <h2 className="font-heading text-4xl md:text-5xl text-forest text-center mb-16">
            Curated By Occasion
          </h2>
        </Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {collections.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.06}>
              <div className="group relative aspect-[4/4.6] overflow-hidden bg-stone">
                {c.video ? (
                  <video
                    src={c.video}
                    poster={c.image}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-luxury group-hover:scale-105"
                  />
                ) : (
                  <img
                    src={c.image}
                    alt={c.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-luxury group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-graphite/80 via-graphite/10 to-transparent" />
                <p className="absolute bottom-4 left-4 font-heading text-lg text-cream">{c.title}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-10 px-6 max-w-7xl mx-auto">
        <Reveal>
          <CategoryDiptych
            watchesImage={watches[5]?.image}
            watchesVideo={watches[5]?.video}
            watchesCount={watches.length}
            moissaniteImage={moissanite[1]?.image}
            moissaniteVideo={moissanite[1]?.video}
            moissaniteCount={moissanite.length}
          />
        </Reveal>
      </section>

      <section className="py-28 px-6 max-w-7xl mx-auto">
        <Reveal>
          <p className="eyebrow text-gold text-center mb-4">Featured</p>
          <h2 className="font-heading text-4xl md:text-5xl text-forest text-center mb-16">
            The Edit
          </h2>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-5 gap-y-10">
          {featured.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 0.06}>
              {p.category === "watches" ? <ProductCard product={p} /> : <MoissaniteCard product={p} />}
            </Reveal>
          ))}
        </div>
      </section>

      <section id="about" className="py-28 px-6 bg-stone/40">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
          <Reveal>
            <div className="aspect-[4/5] overflow-hidden">
              <img src={watches[8]?.image} alt="Craftsmanship" className="h-full w-full object-cover" />
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="eyebrow text-gold mb-6">Our Story</p>
            <h2 className="font-heading text-4xl md:text-5xl text-forest mb-8 leading-tight">
              Craftsmanship worn quietly.
            </h2>
            <p className="text-graphite/70 leading-relaxed mb-6">
              Style & Glitz began with a simple frustration: luxury shouldn't require a passport
              or a waitlist. Every piece we carry, from a hand-set VVS1 moissanite tennis chain to
              a fully iced custom timepiece, is chosen and finished with the same standard we'd
              want for ourselves.
            </p>
            <p className="text-graphite/70 leading-relaxed">
              We're not interested in selling watches or jewellery. We're interested in the
              confidence someone carries after they put one on.
            </p>
          </Reveal>
        </div>
      </section>

      <ReviewsCarousel />
      <InstagramGrid products={products} />
      <ConciergeSection />
    </>
  );
}