import { supabase } from "./supabase";

export interface ProductRow {
  id: string;
  slug: string;
  name: string;
  brand_line: string | null;
  category: "watches" | "moissanite";
  sub_category: string;
  price: number;
  compare_at_price: number | null;
  rating: number;
  review_count: number;
  badge: string | null;
  description: string;
  materials: string[];
  features: string[];
  gra_certified: boolean;
  image: string;
  video: string;
  gallery: string[];
  stock: number;
}

function assertSupabase() {
  if (!supabase) throw new Error("Supabase is not configured.");
  return supabase;
}

export async function listProducts(): Promise<ProductRow[]> {
  const client = assertSupabase();
  const { data, error } = await client.from("products").select("*").order("name");
  if (error) throw error;
  return data as ProductRow[];
}

export async function getProduct(id: string): Promise<ProductRow | null> {
  const client = assertSupabase();
  const { data, error } = await client.from("products").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data as ProductRow | null;
}

export async function upsertProduct(row: ProductRow): Promise<void> {
  const client = assertSupabase();
  const { error } = await client.from("products").upsert(row, { onConflict: "id" });
  if (error) throw error;
}

export async function deleteProduct(id: string): Promise<void> {
  const client = assertSupabase();
  const { error } = await client.from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function uploadProductMedia(
  file: File,
  category: string,
  slug: string
): Promise<string> {
  const client = assertSupabase();
  const ext = file.name.split(".").pop();
  const path = `${category}/${slug}-${Date.now()}.${ext}`;
  const { error } = await client.storage.from("product-media").upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = client.storage.from("product-media").getPublicUrl(path);
  return data.publicUrl;
}