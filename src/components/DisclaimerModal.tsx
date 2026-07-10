import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export const DISCLAIMER_TEXT =
  "Style & Glitz is an independent jeweller and watch atelier. We are not affiliated with, endorsed by, or authorized by Rolex, Patek Philippe, Audemars Piguet, Cartier, Hublot, Casio G-Shock, or any other wristwatch brand referenced on this site. Product names and styles are used only to describe the design our pieces are inspired by and modelled after; every item sold is a Style & Glitz original build, not a product of the named brand.";

export default function DisclaimerModal() {
  const [open, setOpen] = useState(false);

  // Shows once every time the site is loaded (not gated behind storage), so
  // it reliably greets every visitor on entry as requested.
  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => setOpen(false);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-graphite/70 backdrop-blur-sm px-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="disclaimer-heading"
            className="relative max-w-lg w-full bg-cream border border-gold/40 p-8 sm:p-10"
          >
            <p className="eyebrow text-gold mb-4">Before You Enter</p>
            <h2 id="disclaimer-heading" className="font-heading text-3xl text-forest mb-5">
              A Note on Our Designs
            </h2>
            <p className="text-sm text-graphite/70 leading-relaxed mb-8">{DISCLAIMER_TEXT}</p>
            <button
              onClick={dismiss}
              className="w-full bg-forest text-cream eyebrow py-4 hover:bg-forest-dark transition-colors duration-500"
            >
              I Understand
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
