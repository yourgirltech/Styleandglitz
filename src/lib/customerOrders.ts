import { supabase } from "./supabase";

export interface OrderItemRow {
  id: string;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
}

export interface OrderRow {
  id: string;
  status: string;
  subtotal: number;
  total: number;
  shipping_address: string | null;
  created_at: string;
  order_items: OrderItemRow[];
}

export interface ProfileRow {
  id: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
}

export async function getProfile(userId: string): Promise<ProfileRow | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error) throw error;
  return data;
}

export async function updateProfile(userId: string, updates: Partial<ProfileRow>): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from("profiles")
    .upsert({ id: userId, ...updates }, { onConflict: "id" });
  if (error) throw error;
}

export async function getCustomerOrders(userId: string): Promise<OrderRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("customer_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as OrderRow[];
}