import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/types/product";
import { watches as staticWatches } from "@/data/watches";
import { moissanite as staticMoissanite } from "@/data/moissanite";

interface ProductsContextValue {
  products: Product[];
  watches: Product[];
  moissanite: Product[];
  loading: boolean;
  getById: (id: string) => Product | undefined;
  getBySlug: (slug: string) => Product | undefined;
}

const ProductsContext = createContext<ProductsContextValue | undefined>(undefined);

function rowToProduct(row: any): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brandLine: row.brand_line ?? undefined,
    category: row.category,
    subCategory: row.sub_category,
    price: Number(row.price),
    compareAtPrice: row.compare_at_price != null ? Number(row.compare_at_price) : undefined,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    badge: row.badge ?? undefined,
    description: row.description ?? "",
    materials: row.materials ?? [],
    features: row.features ?? [],
    graCertified: row.gra_certified ?? false,
    image: row.image,
    video: row.video,
    gallery: row.gallery ?? [],
    stock: row.stock ?? 0,
  };
}

// Starts with the static files so the page has something to show instantly,
// then swaps to live Supabase data once it loads.
export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([...staticWatches, ...staticMoissanite]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!supabase) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase.from("products").select("*").order("name");
      if (!cancelled) {
        if (!error && data) setProducts(data.map(rowToProduct));
        setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const watches = products.filter((p) => p.category === "watches");
  const moissanite = products.filter((p) => p.category === "moissanite");
  const getById = (id: string) => products.find((p) => p.id === id);
  const getBySlug = (slug: string) => products.find((p) => p.slug === slug);

  return (
    <ProductsContext.Provider value={{ products, watches, moissanite, loading, getById, getBySlug }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used within a ProductsProvider");
  return ctx;
}