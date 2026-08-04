"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ShoppingCart, Star } from "lucide-react";
import Footer from "@/components/Footer";
import Header, { HeaderSpacer } from "@/components/Header";
import ProductImage from "@/components/ProductImage";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";

type Product = {
  id: string;
  title: string;
  slug: string;
  image: string;
  price: number;
  oldPrice?: number | null;
  rating: number;
  specs?: string | null;
  description?: string | null;
  badge?: string | null;
  discount?: number;
  categoryName?: string;
  stock: number;
};

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    fetch(`/api/products/${params.slug}`)
      .then((r) => r.json())
      .then((d) => setProduct(d.product || null));
  }, [params.slug]);

  if (!product) {
    return (
      <div className="min-h-screen bg-tasino-muted">
        <Header />
        <HeaderSpacer />
        <div className="p-10 text-center">در حال بارگذاری...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tasino-muted">
      <Header />
      <HeaderSpacer />
      <main className="container-tasino py-8">
        <div className="grid gap-6 rounded-2xl bg-white p-5 shadow-card lg:grid-cols-2 lg:p-8">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-tasino-muted">
            <ProductImage
              src={product.image}
              alt={product.title}
              fill
              className="object-contain p-6"
            />
          </div>
          <div>
            <p className="text-sm text-tasino-blue">{product.categoryName}</p>
            <h1 className="mt-2 text-2xl font-black text-tasino-text">
              {product.title}
            </h1>
            {product.specs ? (
              <p className="mt-2 text-sm text-slate-500">{product.specs}</p>
            ) : null}
            <div className="mt-3 flex items-center gap-1">
              <Star className="h-4 w-4 fill-tasino-yellow text-tasino-yellow" />
              <span className="text-sm">
                {product.rating.toLocaleString("fa-IR")}
              </span>
            </div>
            <div className="mt-6">
              {product.oldPrice ? (
                <p className="text-sm text-slate-400 line-through">
                  {formatPrice(product.oldPrice)} تومان
                </p>
              ) : null}
              <p className="text-3xl font-black text-tasino-blue">
                {formatPrice(product.price)}
                <span className="mr-2 text-sm font-normal text-slate-500">
                  تومان
                </span>
              </p>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              موجودی: {product.stock.toLocaleString("fa-IR")}
            </p>
            {product.description ? (
              <p className="mt-4 text-sm leading-7 text-slate-600">
                {product.description}
              </p>
            ) : null}
            <button
              type="button"
              onClick={() =>
                addItem({
                  productId: product.id,
                  title: product.title,
                  price: product.price,
                  image: product.image,
                })
              }
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-tasino-blue px-6 py-3 text-sm font-bold text-white hover:bg-tasino-blue-dark"
            >
              <ShoppingCart className="h-4 w-4" />
              افزودن به سبد
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
