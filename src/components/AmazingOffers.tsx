"use client";

import { useEffect, useState } from "react";
import ProductCard, { type ProductCardData } from "@/components/ProductCard";

export default function AmazingOffers() {
  const [products, setProducts] = useState<ProductCardData[]>([]);

  useEffect(() => {
    fetch("/api/products?limit=8")
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .catch(() => {});
  }, []);

  return (
    <section id="products" className="container-tasino pb-10">
      <div className="mb-6 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-tasino-text sm:text-2xl">
            پیشنهادهای تاسینو
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            محصولات منتخب تأسیسات ساختمانی
          </p>
        </div>
        <a
          href="/products"
          className="text-sm font-medium text-tasino-blue hover:underline"
        >
          مشاهده همه
        </a>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
