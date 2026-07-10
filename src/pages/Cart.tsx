import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/context/ProductsContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { getProfile } from "@/lib/customerOrders";
import { initializePayment } from "@/lib/payments";
import { formatPrice } from "@/data/products";

export default function Cart() {
  const { lines, setQuantity, removeFromCart, subtotal } = useCart();
  const { getById } = useProducts();
  const { session } = useCustomerAuth();
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState("");

  const rows = lines
    .map((l) => ({ line: l, product: getById(l.productId) }))
    .filter((r) => r.product);

  const handleCheckout = async () => {
    if (!session) {
      navigate("/login");
      return;
    }
    setError("");
    setCheckingOut(true);
    try {
      const profile = await getProfile(session.user.id);
      if (!profile?.address) {
        setError("Please add a shipping address in your account before checking out.");
        setCheckingOut(false);
        navigate("/account");
        return;
      }

      const result = await initializePayment(session.user.email!, subtotal, {
        customer_id: session.user.id,
        cart: lines,
      });

      window.location.href = result.authorization_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed. Please try again.");
      setCheckingOut(false);
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 max-w-6xl mx-auto min-h-[60vh]">
      <div className="text-center mb-16">
        <p className="eyebrow text-gold mb-4">Bag</p>
        <h1 className="font-heading text-4xl md:text-5xl text-forest">Your Cart</h1>
      </div>

      {rows.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-graphite/50 mb-8">Your cart is empty.</p>
          <Link
            to="/watches"
            className="eyebrow border border-forest text-forest px-8 py-4 hover:bg-forest hover:text-cream transition-colors duration-500"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 divide-y divide-stone-dark">
            {rows.map(({ line, product }) => (
              <div key={line.productId} className="flex gap-6 py-8">
                <Link to={`/product/${product!.slug}`} className="w-28 h-28 shrink-0 overflow-hidden bg-stone">
                  <img src={product!.image} alt={product!.name} className="h-full w-full object-cover" />
                </Link>
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    {product!.brandLine && (
                      <p className="eyebrow text-gold/80 mb-1">{product!.brandLine}</p>
                    )}
                    <Link to={`/product/${product!.slug}`} className="font-heading text-xl text-graphite hover:text-forest">
                      {product!.name}
                    </Link>
                    <p className="font-mono text-sm text-forest mt-2">{formatPrice(product!.price)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-stone-dark">
                      <button
                        onClick={() => setQuantity(line.productId, line.quantity - 1)}
                        className="w-9 h-9 flex items-center justify-center text-graphite/60 hover:text-forest"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-10 text-center font-mono text-sm">{line.quantity}</span>
                      <button
                        onClick={() => setQuantity(line.productId, line.quantity + 1)}
                        className="w-9 h-9 flex items-center justify-center text-graphite/60 hover:text-forest"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(line.productId)}
                      className="eyebrow text-graphite/40 hover:text-forest"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-stone/30 p-8 h-fit">
            <p className="eyebrow text-graphite/50 mb-6">Order Summary</p>
            <div className="flex justify-between text-sm mb-3">
              <span className="text-graphite/60">Subtotal</span>
              <span className="font-mono">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm mb-6">
              <span className="text-graphite/60">Shipping</span>
              <span className="font-mono text-graphite/50">Calculated at checkout</span>
            </div>
            <div className="hairline mb-6" />
            <div className="flex justify-between text-lg mb-8">
              <span className="font-heading text-forest">Total</span>
              <span className="font-mono text-forest">{formatPrice(subtotal)}</span>
            </div>

            {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="w-full bg-forest text-cream eyebrow py-4 hover:bg-forest-dark transition-colors duration-500 disabled:opacity-50"
            >
              {checkingOut ? "Redirecting to payment..." : "Checkout"}
            </button>
            <p className="text-[11px] text-graphite/40 mt-4 text-center">
              Secure payment via Paystack.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}