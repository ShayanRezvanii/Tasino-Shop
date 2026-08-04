export { formatPrice } from "@/lib/utils";

/** @deprecated Static demo data — use /api/products instead */
export type Product = {
  id: string;
  title: string;
  image: string;
  price: number;
  oldPrice?: number;
  rating: number;
  category: string;
  discount?: number;
  badge?: string;
  specs?: string;
};

export const products: Product[] = [];
export const categories: { id: string; title: string; icon: string; desc: string }[] = [];
