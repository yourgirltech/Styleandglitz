import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { useCartFX } from "@/context/CartFXContext";

const links = [
  { to: "/watches", label: "Watches" },
  { to: "/moissanite", label: "Moissanite" },
  { to: "/#about", label: "About" },
  { to: "/#reviews", label: "Reviews" },
  { to: "/#concierge", label: "Contact" },
];

const HERO_ROUTES = ["/", "/watches", "/moissanite"];

export default function Navbar() {
  const location = useLocation();
  const hasHero = HERO_ROUTES.includes(location.pathname);
  const [scrolledPast, setScrolledPast] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { productIds } = useWishlist();
  const { session } = useCustomerAuth();
  const { cartIconRef, bounceKey } = useCartFX();

  const scrolled = scrolledPast || !hasHero;

  useEffect(() => {
    const onScroll = () => setScrolledPast(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname]);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-700 ease-luxury ${
          scrolled
            ? "bg-cream/80 backdrop-blur-md shadow-[0_1px_0_0_rgba(35,35,35,0.06)]"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 md:px-10 h-16 md:h-[68px] flex items-center justify-between">
          <Link to="/" className="flex flex-col leading-none shrink-0 group">
            <span
              className={`font-heading text-lg md:text-xl tracking-[0.08em] transition-colors duration-700 ease-luxury ${
                scrolled ? "text-forest" : "text-cream"
              }`}
            >
              Style <span className="text-gold">&amp;</span> Glitz
            </span>
            <span
              className={`font-mono text-[8px] tracking-[0.3em] uppercase mt-0.5 transition-colors duration-700 ease-luxury ${
                scrolled ? "text-graphite/40" : "text-cream/50"
              }`}
            >
              Luxury Atelier
            </span>
          </Link>

          <nav
            className={`hidden lg:flex items-center gap-10 eyebrow transition-colors duration-700 ease-luxury ${
              scrolled ? "text-graphite/80" : "text-cream/85"
            }`}
          >
            {links.map((l) => (
              <NavLink
                key={l.label}
                to={l.to}
                className={({ isActive }) =>
                  `relative pb-1 transition-colors duration-500 hover:text-gold ${
                    isActive ? (scrolled ? "text-forest" : "text-cream") : ""
                  } after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-px after:bg-gold after:transition-all after:duration-500 ${
                    isActive ? "after:w-full" : "after:w-0 hover:after:w-full"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link to={session ? "/account" : "/login"} className="pb-1 hover:text-gold transition-colors duration-500">
              {session ? "My Account" : "Sign In"}
            </Link>
          </nav>

          <div className="flex items-center gap-5">
            <Link
              to={session ? "/account" : "/login"}
              aria-label="Account"
              className={`relative transition-colors duration-700 ease-luxury ${
                scrolled ? "text-graphite/80 hover:text-forest" : "text-cream/90 hover:text-gold"
              }`}
            >
              <UserIcon />
            </Link>
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className={`relative transition-colors duration-700 ease-luxury ${
                scrolled ? "text-graphite/80 hover:text-forest" : "text-cream/90 hover:text-gold"
              }`}
            >
              <HeartIcon />
              {productIds.length > 0 && (
                <span className="absolute -top-2 -right-2 text-[10px] font-mono bg-forest text-cream w-4 h-4 rounded-full flex items-center justify-center">
                  {productIds.length}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              aria-label="Cart"
              className={`relative transition-colors duration-700 ease-luxury ${
                scrolled ? "text-graphite/80 hover:text-forest" : "text-cream/90 hover:text-gold"
              }`}
            >
              <div ref={cartIconRef} key={bounceKey} className={bounceKey ? "animate-cart-bounce" : ""}>
                <BagIcon />
              </div>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 text-[10px] font-mono bg-gold text-graphite w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              className={`lg:hidden transition-colors duration-700 ease-luxury ${
                scrolled ? "text-graphite/80" : "text-cream/90"
              }`}
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-x-0 top-16 md:top-[68px] max-h-[calc(100vh-4rem)] pb-8 bg-cream backdrop-blur-md z-50 flex flex-col overflow-y-auto shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
          >
            <div className="flex justify-end p-6">
              <button
                className="text-graphite"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
              >
                <CloseIcon />
              </button>
            </div>
            <nav className="flex flex-col items-center gap-8 mt-4 font-heading text-3xl text-graphite">
              {links.map((l, i) => (
                <motion.div
                  key={l.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i, duration: 0.6 }}
                >
                  <NavLink to={l.to} onClick={() => setMenuOpen(false)} className="hover:text-gold">
                    {l.label}
                  </NavLink>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * links.length, duration: 0.6 }}
              >
                <Link to={session ? "/account" : "/login"} onClick={() => setMenuOpen(false)} className="hover:text-gold">
                  {session ? "My Account" : "Sign In"}
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 21s-7.5-4.6-10-9.3C.4 8 2 4 6 4c2.2 0 3.9 1.4 6 4 2.1-2.6 3.8-4 6-4 4 0 5.6 4 4 7.7C19.5 16.4 12 21 12 21z" />
    </svg>
  );
}
function BagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 8h12l1 12H5L6 8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}