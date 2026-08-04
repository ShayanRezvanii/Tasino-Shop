"use client";

import { ShoppingCart, Star } from "lucide-react";
import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";

export type ProductCardData = {
  id: string;
  title: string;
  slug: string;
  image: string;
  price: number;
  oldPrice?: number | null;
  rating: number;
  categoryName?: string;
  discount?: number;
  badge?: string | null;
  specs?: string | null;
};

export default function ProductCard({ product }: { product: ProductCardData }) {
  const { addItem } = useCart();

  return (
    <article className="group relative flex flex-col rounded-2xl border border-slate-100 bg-white p-4 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      {product.discount ? (
        <div className="absolute left-3 top-3 z-10 rounded-lg bg-tasino-yellow px-2 py-0.5 text-xs font-black text-tasino-blue-deep">
          ٪{product.discount.toLocaleString("fa-IR")}
        </div>
      ) : null}

      {product.badge ? (
        <div className="absolute right-3 top-3 z-10 rounded-lg bg-tasino-blue px-2 py-0.5 text-[10px] font-bold text-white">
          {product.badge}
        </div>
      ) : null}

      <Link href={`/products/${product.slug}`} className="relative mb-3 aspect-square overflow-hidden rounded-xl bg-tasino-muted">
        <ProductImage
          src={product.image}
          alt={product.title}
          fill
          className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, 240px"
        />
      </Link>

      <p className="mb-1 text-[11px] font-medium text-tasino-blue">
        {product.categoryName}
      </p>

      <Link href={`/products/${product.slug}`}>
        <h3 className="mb-2 line-clamp-2 min-h-[2.75rem] text-sm font-semibold leading-relaxed text-tasino-text">
          {product.title}
        </h3>
      </Link>

      {product.specs ? (
        <p className="mb-2 line-clamp-1 text-xs text-slate-400">{product.specs}</p>
      ) : null}

      <div className="mb-3 flex items-center gap-1">
        <Star className="h-3.5 w-3.5 fill-tasino-yellow text-tasino-yellow" />
        <span className="text-xs text-slate-500">
          {product.rating.toLocaleString("fa-IR")}
        </span>
      </div>

      <div className="mt-auto flex items-end justify-between gap-2">
        <div>
          {product.oldPrice ? (
            <p className="text-xs text-slate-400 line-through">
              {formatPrice(product.oldPrice)}
            </p>
          ) : null}
          <p className="text-base font-bold text-tasino-blue-deep">
            {formatPrice(product.price)}
            <span className="mr-1 text-xs font-normal text-slate-500">تومان</span>
          </p>
        </div>
        <button
          type="button"
          aria-label="افزودن به سبد"
          onClick={() =>
            addItem({
              productId: product.id,
              title: product.title,
              price: product.price,
              image: product.image,
            })
          }
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-tasino-blue text-white transition hover:bg-tasino-blue-dark"
        >
          <ShoppingCart className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
