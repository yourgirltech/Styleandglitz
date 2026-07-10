import { supabase } from "./supabase";

export async function subscribeToNewsletter(email: string): Promise<void> {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { error } = await supabase.from("newsletter_subscribers").insert({ email });
  if (error) {
    if (error.code === "23505") {
      throw new Error("This email is already subscribed.");
    }
    throw error;
  }
}