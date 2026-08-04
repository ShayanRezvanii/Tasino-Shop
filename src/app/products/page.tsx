"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Footer from "@/components/Footer";
import Header, { HeaderSpacer } from "@/components/Header";
import ProductCard, { type ProductCardData } from "@/components/ProductCard";

function ProductsInner() {
  const search = useSearchParams();
  const category = search.get("category") || "";
  const q = search.get("q") || "";
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [title, setTitle] = useState("همه محصولات");

  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (q) params.set("q", q);
    fetch(`/api/products?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setProducts(d.products || []);
        if (q) setTitle(`نتایج جستجو: ${q}`);
        else if (category) setTitle("محصولات دسته‌بندی");
        else setTitle("همه محصولات");
      });
  }, [category, q]);

  return (
    <main className="container-tasino py-8">
      <h1 className="mb-6 text-2xl font-bold">{title}</h1>
      {products.length === 0 ? (
        <p className="rounded-2xl bg-white p-10 text-center text-slate-500 shadow-card">
          محصولی یافت نشد
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-tasino-muted">
      <Header />
      <HeaderSpacer />
      <Suspense fallback={<div className="p-10 text-center">...</div>}>
        <ProductsInner />
      </Suspense>
      <Footer />
    </div>
  );
}
