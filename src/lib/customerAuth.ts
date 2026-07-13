import { supabase } from "./supabase";

export async function signUpCustomer(email: string, password: string, fullName: string) {
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;

  
  if (data.user) {
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({ id: data.user.id, full_name: fullName });
    if (profileError) throw profileError;
  }

  return data;
}

export async function signInCustomer(email: string, password: string) {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOutCustomer() {
  if (!supabase) return;
  await supabase.auth.signOut();
}