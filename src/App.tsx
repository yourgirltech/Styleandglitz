import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import Watches from "@/pages/Watches";
import Moissanite from "@/pages/Moissanite";
import ProductDetail from "@/pages/ProductDetail";
import Wishlist from "@/pages/Wishlist";
import Cart from "@/pages/Cart";
import Signup from "@/pages/Signup";
import Login from "@/pages/Login";
import Account from "@/pages/Account";
import CheckoutCallback from "@/pages/CheckoutCallback";
import DisclaimerModal from "@/components/DisclaimerModal";
import RequireCustomer from "@/components/RequireCustomer";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import RequireAdmin from "@/components/RequireAdmin";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProductForm from "@/pages/admin/AdminProductForm";
import { CartFXProvider } from "@/context/CartFXContext";
import CartFXOverlay from "@/components/CartFXOverlay";
import ChatWidget from "@/components/ChatWidget";

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}


function ScrollManager() {
  const location = useLocation();

  useEffect(() => {
    let attempts = 0;
    const tryScroll = () => {
      if (location.hash) {
        const el = document.getElementById(location.hash.slice(1));
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
        if (attempts < 20) {
          attempts += 1;
          requestAnimationFrame(tryScroll);
        }
        return;
      }
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    };
    tryScroll();
  }, [location.pathname, location.hash]);

  return null;
}

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const [disclaimerAcknowledged, setDisclaimerAcknowledged] = useState(false);

  return (
    <AdminAuthProvider>
      <CartFXProvider>
        <div className="min-h-screen flex flex-col bg-cream">
          <ScrollManager />
          {!isAdminRoute && (
            <DisclaimerModal onDismiss={() => setDisclaimerAcknowledged(true)} />
          )}
          {!isAdminRoute && <Navbar />}
          <main className="flex-1">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                <Route path="/watches" element={<PageTransition><Watches /></PageTransition>} />
                <Route path="/moissanite" element={<PageTransition><Moissanite /></PageTransition>} />
                <Route path="/product/:slug" element={<PageTransition><ProductDetail /></PageTransition>} />
                <Route path="/wishlist" element={<PageTransition><Wishlist /></PageTransition>} />
                <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
                <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
                <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
                <Route
                  path="/account"
                  element={
                    <PageTransition>
                      <RequireCustomer>
                        <Account />
                      </RequireCustomer>
                    </PageTransition>
                  }
                />
                <Route path="/checkout/callback" element={<CheckoutCallback />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
                <Route path="/admin/products/new" element={<RequireAdmin><AdminProductForm /></RequireAdmin>} />
                <Route path="/admin/products/:id/edit" element={<RequireAdmin><AdminProductForm /></RequireAdmin>} />
              </Routes>
            </AnimatePresence>
          </main>
          {!isAdminRoute && <Footer />}
        </div>
        {!isAdminRoute && <CartFXOverlay />}
        {!isAdminRoute && disclaimerAcknowledged && <ChatWidget />}
      </CartFXProvider>
    </AdminAuthProvider>
  );
}