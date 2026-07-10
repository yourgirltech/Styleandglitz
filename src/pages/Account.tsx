import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { getProfile, updateProfile, getCustomerOrders, type ProfileRow, type OrderRow } from "@/lib/customerOrders";
import { signOutCustomer } from "@/lib/customerAuth";
import { formatPrice } from "@/data/products";

export default function Account() {
  const { session } = useCustomerAuth();
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (!session) return;
    Promise.all([getProfile(session.user.id), getCustomerOrders(session.user.id)])
      .then(([p, o]) => {
        setProfile(p);
        setOrders(o);
        setFullName(p?.full_name ?? "");
        setPhone(p?.phone ?? "");
        setAddress(p?.address ?? "");
      })
      .finally(() => setLoading(false));
  }, [session]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    setSaving(true);
    setSaved(false);
    setSaveError("");
    try {
      await updateProfile(session.user.id, { full_name: fullName, phone, address });
      setProfile((prev) => ({ ...(prev ?? { id: session.user.id, full_name: null, phone: null, address: null }), full_name: fullName, phone, address }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-cream">Loading...</div>;

  return (
    <div className="pt-32 pb-24 px-6 max-w-5xl mx-auto min-h-[60vh]">
      <Link
        to="/"
        className="inline-flex items-center gap-2 eyebrow text-graphite/50 hover:text-forest transition-colors duration-500 mb-10"
      >
        ← Back to Home
      </Link>

      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="eyebrow text-gold mb-3">My Account</p>
          <h1 className="font-heading text-4xl text-forest">{profile?.full_name || "Welcome"}</h1>
        </div>
        <button
          onClick={() => signOutCustomer()}
          className="eyebrow border border-stone-dark px-5 py-3 text-graphite hover:border-forest transition-colors duration-500"
        >
          Sign Out
        </button>
      </div>

      <p className="text-xs text-graphite/40 font-mono mb-16">Signed in as {session?.user.email}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2">
          <p className="eyebrow text-graphite/50 mb-6">Order History</p>
          {orders.length === 0 ? (
            <p className="text-graphite/50">No orders yet.</p>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="border border-stone-dark p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-mono text-xs text-graphite/50">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                      <p className="eyebrow text-forest mt-1 capitalize">{order.status}</p>
                    </div>
                    <p className="font-mono text-forest">{formatPrice(order.total)}</p>
                  </div>
                  <div className="divide-y divide-stone-dark/50">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex justify-between py-2 text-sm">
                        <span className="text-graphite/70">
                          {item.product_name} × {item.quantity}
                        </span>
                        <span className="font-mono text-graphite/60">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="eyebrow text-graphite/50 mb-6">Profile</p>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs text-graphite/60 mb-1">Full Name</label>
              <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-graphite/60 mb-1">Phone</label>
              <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs text-graphite/60 mb-1">Shipping Address</label>
              <textarea className="input" rows={3} value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-forest text-cream eyebrow py-3 hover:bg-forest-dark transition-colors duration-500 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
            {saved && <p className="text-xs text-gold text-center">Profile saved.</p>}
            {saveError && <p className="text-xs text-red-600 text-center">{saveError}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}