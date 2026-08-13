import { useState } from "react";
import { Link } from "react-router-dom";
import { subscribeToNewsletter } from "@/lib/newsletter";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeError, setSubscribeError] = useState("");

  return (
    <footer className="bg-forest text-cream/90">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-20 grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-9 h-9 border border-gold/70 flex items-center justify-center shrink-0">
              <span className="font-heading text-sm text-gold">S&amp;G</span>
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-[13px] tracking-[0.28em] uppercase font-medium">Style &amp; Glitz</span>
              <span className="font-mono text-[8px] tracking-[0.25em] uppercase text-cream/40 mt-1.5">
                Luxury Atelier
              </span>
            </span>
          </div>
          <p className="text-cream/60 text-sm leading-relaxed max-w-xs">
            Fine timepieces and GRA-certified VVS1 moissanite, styled by a house that treats every
            piece like the last one you'll need to buy.
          </p>
          <div className="hairline w-16 my-6" />
          <p className="eyebrow text-cream/50">Est. Digital Flagship</p>
        </div>

        <div className="md:col-span-3">
          <p className="eyebrow text-gold mb-5">Quick Links</p>
          <ul className="space-y-3 text-sm text-cream/70">
            <li><Link to="/shipping" className="hover:text-cream transition-colors">Shipping</Link></li>
            <li><Link to="/returns" className="hover:text-cream transition-colors">Returns</Link></li>
            <li><Link to="/privacy" className="hover:text-cream transition-colors">Privacy</Link></li>
            <li><Link to="/terms" className="hover:text-cream transition-colors">Terms</Link></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <p className="eyebrow text-gold mb-5">Follow</p>
          <ul className="space-y-3 text-sm text-cream/70">
            <li>
              <a href="https://instagram.com/styleandglitzz" target="_blank" rel="noreferrer" className="hover:text-cream transition-colors">
                Instagram
              </a>
            </li>
            <li>
              <a href="https://wa.me/2349036423694" target="_blank" rel="noreferrer" className="hover:text-cream transition-colors">
                WhatsApp
              </a>
            </li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <p className="eyebrow text-gold mb-5">Newsletter</p>
          <p className="text-sm text-cream/60 mb-4">First look at new arrivals and limited pieces.</p>
          {submitted ? (
            <p className="text-sm text-gold">You're on the list.</p>
          ) : (
            <>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setSubscribeError("");
                  setSubscribing(true);
                  try {
                    await subscribeToNewsletter(email);
                    setSubmitted(true);
                  } catch (err) {
                    setSubscribeError(err instanceof Error ? err.message : "Something went wrong.");
                  } finally {
                    setSubscribing(false);
                  }
                }}
                className="flex border-b border-cream/30 focus-within:border-gold transition-colors"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="bg-transparent flex-1 py-2 text-sm placeholder:text-cream/40 focus:outline-none"
                />
                <button type="submit" disabled={subscribing} className="text-gold text-sm eyebrow pb-2 disabled:opacity-50">
                  {subscribing ? "..." : "Join"}
                </button>
              </form>
              {subscribeError && <p className="text-xs text-red-400 mt-2">{subscribeError}</p>}
            </>
          )}
        </div>
      </div>
      <div className="border-t border-cream/10 py-6 text-center text-xs text-cream/40 font-mono">
        © {new Date().getFullYear()} Style & Glitz. All rights reserved.
      </div>
    </footer>
  );
}