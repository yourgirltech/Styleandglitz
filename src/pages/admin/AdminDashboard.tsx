import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listProducts, deleteProduct, type ProductRow } from "@/lib/adminProducts";
import { signOutAdmin } from "@/lib/adminAuth";
import { formatPrice } from "@/data/products";

export default function AdminDashboard() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "watches" | "moissanite">("all");

  const load = async () => {
    setLoading(true);
    try {
      setProducts(await listProducts());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"? This can't be undone.`)) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed.");
    }
  };

  const filtered = products.filter((p) => filter === "all" || p.category === filter);

  return (
    <div className="min-h-screen bg-cream px-6 py-10 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="eyebrow text-gold mb-2">Admin</p>
          <h1 className="font-heading text-4xl text-forest">Products</h1>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/products/new" className="bg-forest text-cream eyebrow px-5 py-3 hover:bg-forest-dark transition-colors duration-500">
            + Add Product
          </Link>
          <button onClick={() => signOutAdmin()} className="border border-stone-dark text-graphite eyebrow px-5 py-3 hover:border-forest transition-colors duration-500">
            Sign Out
          </button>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        {(["all", "watches", "moissanite"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`eyebrow px-4 py-2 border transition-colors duration-300 ${
              filter === f ? "bg-forest text-cream border-forest" : "border-stone-dark text-graphite/70"
            }`}
          >
            {f === "all" ? "All" : f}
          </button>
        ))}
      </div>

      {loading && <p className="text-graphite/60">Loading...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto border border-stone-dark">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone/40 text-left eyebrow text-graphite/60">
                <th className="p-3">Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Sub-category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-stone-dark/50">
                  <td className="p-3 font-heading text-base text-graphite">{p.name}</td>
                  <td className="p-3 capitalize text-graphite/70">{p.category}</td>
                  <td className="p-3 text-graphite/70">{p.sub_category}</td>
                  <td className="p-3 font-mono text-forest">{formatPrice(p.price)}</td>
                  <td className="p-3 text-graphite/70">{p.stock}</td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <Link to={`/admin/products/${p.id}/edit`} className="text-gold-dark hover:text-forest eyebrow text-xs mr-4">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(p.id, p.name)} className="text-red-600 hover:text-red-800 eyebrow text-xs">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="p-6 text-center text-graphite/50">No products in this category yet.</p>}
        </div>
      )}
    </div>
  );
}