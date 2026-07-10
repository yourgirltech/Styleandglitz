import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const reviews = [
  {
    quote:
      "The quality exceeded my expectations. It honestly felt like opening something from a luxury boutique.",
    name: "Daniel O.",
    piece: "Rolex Datejust — Blue Dial",
  },
  {
    quote:
      "I ordered the custom Hublot with moissanite and the video updates during the build kept me at ease the whole time.",
    name: "Amara N.",
    piece: "Custom Hublot — VVS1 Moissanite",
  },
  {
    quote:
      "The tennis cross pendant is even better in person. Packaging alone felt like a gift.",
    name: "Chidi E.",
    piece: "Tennis Cross Pendant Necklace",
  },
  {
    quote:
      "Concierge replied within minutes on WhatsApp and walked me through sizing before I paid a dime.",
    name: "Folake A.",
    piece: "Cartier Panthère",
  },
];

export default function ReviewsCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % reviews.length), 6000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="reviews" className="bg-forest text-cream py-28 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <p className="eyebrow text-gold mb-6">Customer Reviews</p>
        <div className="relative h-56 md:h-40 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <p className="text-gold text-lg mb-4">★★★★★</p>
              <p className="font-heading text-2xl md:text-3xl leading-snug">
                "{reviews[index].quote}"
              </p>
              <p className="eyebrow text-cream/50 mt-6">
                {reviews[index].name} · {reviews[index].piece}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex justify-center gap-2 mt-10">
          {reviews.map((_, i) => (
            <button
              key={i}
              aria-label={`Show review ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === index ? "w-8 bg-gold" : "w-1.5 bg-cream/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
