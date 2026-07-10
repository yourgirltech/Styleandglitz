export type ProductCategory = "watches" | "moissanite";

export type Badge = "NEW" | "BEST SELLER" | "LIMITED" | "CUSTOM";

export interface Product {
  id: string;
  slug: string;
  name: string;
  brandLine?: string;
  category: ProductCategory;
  subCategory: string;
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  badge?: Badge;
  description: string;
  materials: string[];
  features: string[];
  graCertified?: boolean;
  image: string;
  video: string;
  gallery?: string[];
  stock: number;
}

export interface CartLine {
  productId: string;
  quantity: number;
}
