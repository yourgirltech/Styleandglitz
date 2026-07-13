import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { verifyPayment } from "@/lib/payments";
import { createOrderFromCart } from "@/lib/createOrder";
import { getProfile } from "@/lib/customerOrders";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/context/ProductsContext";

type Status = "verifying" | "success" | "failed";

export default function CheckoutCallback() {
  const [searchParams] = useSearchParams();
  const { session, loading: authLoading } = useCustomerAuth();
  const { clearCart } = useCart();
  const { getById } = useProducts();
  const [status, setStatus] = useState<Status>("verifying");
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;

    const reference = searchParams.get("reference") || searchParams.get("trxref");

    if (!reference || !session) {
      setStatus("failed");
      setError("Missing payment reference or session.");
      return;
    }

    (async () => {
      try {
        const result = await verifyPayment(reference);
        if (!result.paid) {
          setStatus("failed");
          setError("Payment was not completed.");
          return;
        }

        // The cart lines travel through Paystack itself (as metadata
        // sent when initializing payment), not through browser storage —
        // this is what Paystack hands back, confirmed and authoritative.
        const cartLines = result.metadata?.cart;
        if (!cartLines) {
          setStatus("failed");
          setError("Payment succeeded, but order details were lost. Please contact support with reference: " + reference);
          return;
        }

        const profile = await getProfile(session.user.id);

        await createOrderFromCart(
          session.user.id,
          cartLines,
          getById,
          result.amount,
          profile?.address ?? ""
        );

        clearCart();
        setStatus("success");
      } catch (err) {
        setStatus("failed");
        setError(err instanceof Error ? err.message : "Something went wrong confirming your order.");
      }
    })();
  }, [searchParams, session, authLoading, getById, clearCart]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-6 text-center">
      <div className="max-w-md">
        {status === "verifying" && (
          <>
            <p className="eyebrow text-gold mb-4">Please Wait</p>
            <h1 className="font-heading text-3xl text-forest mb-4">Confirming Your Payment</h1>
            <p className="text-graphite/60">This will only take a moment.</p>
          </>
        )}
        {status === "success" && (
          <>
            <p className="eyebrow text-gold mb-4">Thank You</p>
            <h1 className="font-heading text-3xl text-forest mb-4">Order Confirmed</h1>
            <p className="text-graphite/60 mb-8">
              Your payment was successful. You can track this order from your account.
            </p>
            <Link
              to="/account"
              className="eyebrow bg-forest text-cream px-8 py-4 hover:bg-forest-dark transition-colors duration-500"
            >
              View Order
            </Link>
          </>
        )}
        {status === "failed" && (
          <>
            <p className="eyebrow text-red-600 mb-4">Payment Issue</p>
            <h1 className="font-heading text-3xl text-forest mb-4">Something Went Wrong</h1>
            <p className="text-graphite/60 mb-8">{error}</p>
            <Link
              to="/cart"
              className="eyebrow border border-forest text-forest px-8 py-4 hover:bg-forest hover:text-cream transition-colors duration-500"
            >
              Back to Cart
            </Link>
          </>
        )}
      </div>
    </div>
  );
}