import { motion } from "framer-motion";
import { ReactNode } from "react";

interface HeroVideoProps {
  video: string;
  poster?: string;
  eyebrow: string;
  headline: ReactNode;
  cta?: { label: string; to: string }[];
  height?: string;
}

export default function HeroVideo({
  video,
  poster,
  eyebrow,
  headline,
  cta,
  height = "h-screen",
}: HeroVideoProps) {
  return (
    <section className={`relative w-full ${height} min-h-[560px] bg-graphite overflow-hidden`}>
      {/* Backdrop: the same clip, blurred and over-scaled, fills every edge so the
          section always reads full-bleed even though the source footage is portrait. */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster={poster}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover scale-125 blur-2xl opacity-50"
      >
        <source src={video} type="video/mp4" />
      </video>

      {/* Foreground: the real subject, shown uncropped instead of zoomed/cut off. */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster={poster}
        className="absolute inset-0 h-full w-full object-contain"
      >
        <source src={video} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-graphite/70 via-graphite/10 to-graphite/75" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="eyebrow text-gold mb-6"
        >
          {eyebrow}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading text-4xl sm:text-5xl md:text-7xl text-cream max-w-4xl leading-[1.05]"
        >
          {headline}
        </motion.h1>

        {cta && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 flex flex-col sm:flex-row gap-4"
          >
            {cta.map((c) => (
              <a
                key={c.label}
                href={c.to}
                className="eyebrow border border-cream/40 text-cream px-8 py-4 hover:bg-cream hover:text-forest transition-colors duration-700 ease-luxury"
              >
                {c.label}
              </a>
            ))}
          </motion.div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-cream/60 eyebrow z-10"
      >
        Scroll
      </motion.div>
    </section>
  );
}
