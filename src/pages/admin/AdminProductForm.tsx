import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getProduct,
  upsertProduct,
  uploadProductMedia,
  type ProductRow,
} from "@/lib/adminProducts";

const emptyProduct: ProductRow = {
  id: "",
  slug: "",
  name: "",
  brand_line: "",
  category: "watches",
  sub_category: "",
  price: 0,
  compare_at_price: null,
  rating: 4.8,
  review_count: 0,
  badge: null,
  description: "",
  materials: [],
  features: [],
  gra_certified: false,
  image: "",
  video: "",
  gallery: [],
  stock: 0,
};

export default function AdminProductForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [product, setProduct] = useState<ProductRow>(emptyProduct);
  const [materialsText, setMaterialsText] = useState("");
  const [featuresText, setFeaturesText] = useState("");
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    getProduct(id)
      .then((data) => {
        if (data) {
          setProduct(data);
          setMaterialsText(data.materials.join(", "));
          setFeaturesText(data.features.join(", "));
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load product."))
      .finally(() => setLoading(false));
  }, [id]);

  const update = <K extends keyof ProductRow>(key: K, value: ProductRow[K]) =>
    setProduct((prev) => ({ ...prev, [key]: value }));

  const handleFileUpload = async (file: File, field: "image" | "video") => {
    if (!product.slug) {
      alert("Set the product name/slug first, so the file has somewhere to go.");
      return;
    }
    const setUploading = field === "image" ? setUploadingImage : setUploadingVideo;
    setUploading(true);
    try {
      const url = await uploadProductMedia(file, product.category, product.slug);
      update(field, url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleNameChange = (name: string) => {
    update("name", name);
    if (!isEditing) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      update("slug", slug);
      update("id", `${product.category === "watches" ? "w" : "m"}-${slug}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const finalProduct: ProductRow = {
        ...product,
        materials: materialsText.split(",").map((s) => s.trim()).filter(Boolean),
        features: featuresText.split(",").map((s) => s.trim()).filter(Boolean),
      };
      await upsertProduct(finalProduct);
      navigate("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-cream flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-cream px-6 py-10 max-w-3xl mx-auto">
      <p className="eyebrow text-gold mb-2">Admin</p>
      <h1 className="font-heading text-4xl text-forest mb-10">
        {isEditing ? "Edit Product" : "Add Product"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs text-graphite/60 mb-1">Name</label>
          <input className="input" value={product.name} onChange={(e) => handleNameChange(e.target.value)} required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-graphite/60 mb-1">Category</label>
            <select className="input" value={product.category} onChange={(e) => update("category", e.target.value as ProductRow["category"])}>
              <option value="watches">Watches</option>
              <option value="moissanite">Moissanite</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-graphite/60 mb-1">Sub-category</label>
            <input className="input" value={product.sub_category} onChange={(e) => update("sub_category", e.target.value)} placeholder="e.g. Necklaces, Rolex Inspired" required />
          </div>
        </div>

        <div>
          <label className="block text-xs text-graphite/60 mb-1">Brand line (optional)</label>
          <input className="input" value={product.brand_line ?? ""} onChange={(e) => update("brand_line", e.target.value || null)} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-graphite/60 mb-1">Price</label>
            <input type="number" className="input" value={product.price} onChange={(e) => update("price", Number(e.target.value))} required />
          </div>
          <div>
            <label className="block text-xs text-graphite/60 mb-1">Stock</label>
            <input type="number" className="input" value={product.stock} onChange={(e) => update("stock", Number(e.target.value))} required />
          </div>
          <div>
            <label className="block text-xs text-graphite/60 mb-1">Badge</label>
            <select className="input" value={product.badge ?? ""} onChange={(e) => update("badge", e.target.value || null)}>
              <option value="">None</option>
              <option value="NEW">NEW</option>
              <option value="BEST SELLER">BEST SELLER</option>
              <option value="LIMITED">LIMITED</option>
              <option value="CUSTOM">CUSTOM</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs text-graphite/60 mb-1">Description</label>
          <textarea className="input" rows={3} value={product.description} onChange={(e) => update("description", e.target.value)} />
        </div>

        <div>
          <label className="block text-xs text-graphite/60 mb-1">Materials (comma separated)</label>
          <input className="input" value={materialsText} onChange={(e) => setMaterialsText(e.target.value)} />
        </div>

        <div>
          <label className="block text-xs text-graphite/60 mb-1">Features (comma separated)</label>
          <input className="input" value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} />
        </div>

        <label className="flex items-center gap-2 text-sm text-graphite/70">
          <input type="checkbox" checked={product.gra_certified} onChange={(e) => update("gra_certified", e.target.checked)} />
          GRA Certified
        </label>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-xs text-graphite/60 mb-1">Photo</label>
            {product.image && <img src={product.image} alt="" className="w-full aspect-square object-cover mb-2 border border-stone-dark" />}
            <input
              type="file"
              accept="image/*"
              disabled={uploadingImage}
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "image")}
              className="text-xs"
            />
            {uploadingImage && <p className="text-xs text-gold mt-1">Uploading...</p>}
          </div>
          <div>
            <label className="block text-xs text-graphite/60 mb-1">Video</label>
            {product.video && <video src={product.video} className="w-full aspect-square object-cover mb-2 border border-stone-dark" muted loop autoPlay playsInline />}
            <input
              type="file"
              accept="video/*"
              disabled={uploadingVideo}
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], "video")}
              className="text-xs"
            />
            {uploadingVideo && <p className="text-xs text-gold mt-1">Uploading...</p>}
          </div>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={saving} className="bg-forest text-cream eyebrow px-6 py-3 hover:bg-forest-dark transition-colors duration-500 disabled:opacity-50">
            {saving ? "Saving..." : "Save Product"}
          </button>
          <button type="button" onClick={() => navigate("/admin")} className="border border-stone-dark text-graphite eyebrow px-6 py-3">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}