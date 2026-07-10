import { supabase } from "./supabase";

export interface InitPaymentResult {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface VerifyPaymentResult {
  paid: boolean;
  amount: number;
  email: string;
  reference: string;
  metadata: any;
}

export async function initializePayment(
  email: string,
  amount: number,
  metadata: Record<string, unknown>
): Promise<InitPaymentResult> {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { data, error } = await supabase.functions.invoke("initialize-payment", {
    body: { email, amount, metadata },
  });
  if (error) throw error;
  if (data.error) throw new Error(data.error);
  return data;
}

export async function verifyPayment(reference: string): Promise<VerifyPaymentResult> {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { data, error } = await supabase.functions.invoke("verify-payment", {
    body: { reference },
  });
  if (error) throw error;
  if (data.error) throw new Error(data.error);
  return data;
}