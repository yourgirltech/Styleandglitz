import { createClient } from "@supabase/supabase-js";
import { watches } from "../src/data/watches.ts";
import { moissanite } from "../src/data/moissanite.ts";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!supabaseUrl || !supabaseAnonKey || !adminEmail || !adminPassword) {
  console.error("Missing env vars.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function toRow(p) {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand_line: p.brandLine ?? null,
    category: p.category,
    sub_category: p.subCategory,
    price: p.price,
    compare_at_price: p.compareAtPrice ?? null,
    rating: p.rating,
    review_count: p.reviewCount,
    badge: p.badge ?? null,
    description: p.description,
    materials: p.materials,
    features: p.features,
    gra_certified: p.graCertified ?? false,
    image: p.image,
    video: p.video,
    gallery: p.gallery ?? [],
    stock: p.stock,
  };
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function run() {
  console.log("Signing in as admin...");
  const { error: authError } = await supabase.auth.signInWithPassword({
    email: adminEmail,
    password: adminPassword,
  });
  if (authError) {
    console.error("Auth failed:", authError.message);
    process.exit(1);
  }
  console.log("Signed in successfully.");

  const allProducts = [...watches, ...moissanite].map(toRow);
  const batches = chunk(allProducts, 5);
  console.log(`Inserting ${allProducts.length} products in ${batches.length} batches of 5...`);

  let successCount = 0;
  for (let i = 0; i < batches.length; i++) {
    try {
      const { data, error } = await supabase
        .from("products")
        .upsert(batches[i], { onConflict: "id" })
        .select("id");

      if (error) {
        console.error(`Batch ${i + 1}/${batches.length} FAILED:`, error.message);
      } else {
        successCount += data.length;
        console.log(`Batch ${i + 1}/${batches.length} OK (${data.length} rows)`);
      }
    } catch (err) {
      console.error(`Batch ${i + 1}/${batches.length} THREW:`, err.message);
      if (err.cause) console.error("  Underlying cause:", err.cause);
    }
  }

  console.log(`\nDone. ${successCount}/${allProducts.length} products inserted/updated.`);
  process.exit(0);
}

run();