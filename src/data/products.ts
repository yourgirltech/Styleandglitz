import { watches } from "./watches";
import { moissanite } from "./moissanite";
import type { Product } from "@/types/product";

export const allProducts: Product[] = [...watches, ...moissanite];

export const getProductById = (id: string): Product | undefined =>
  allProducts.find((p) => p.id === id);

export const getProductBySlug = (slug: string): Product | undefined =>
  allProducts.find((p) => p.slug === slug);

export const formatPrice = (amount: number): string =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
