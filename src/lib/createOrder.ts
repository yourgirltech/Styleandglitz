import { supabase } from "./supabase";
import type { CartLine } from "@/types/product";
import type { Product } from "@/types/product";

export async function createOrderFromCart(
  customerId: string,
  lines: CartLine[],
  getProduct: (id: string) => Product | undefined,
  subtotal: number,
  shippingAddress: string
): Promise<string> {
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_id: customerId,
      status: "paid",
      subtotal,
      total: subtotal,
      shipping_address: shippingAddress,
    })
    .select("id")
    .single();

  if (orderError) throw orderError;

  const items = lines
    .map((line) => {
      const product = getProduct(line.productId);
      if (!product) return null;
      return {
        order_id: order.id,
        product_id: product.id,
        product_name: product.name,
        price: product.price,
        quantity: line.quantity,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const { error: itemsError } = await supabase.from("order_items").insert(items);
  if (itemsError) throw itemsError;

  
  for (const item of items) {
    const { error: stockError } = await supabase.rpc("decrement_product_stock", {
      p_product_id: item.product_id,
      p_quantity: item.quantity,
    });
    if (stockError) {
      
      console.error(`Failed to update stock for ${item.product_id}:`, stockError.message);
    }
  }

  return order.id;
}