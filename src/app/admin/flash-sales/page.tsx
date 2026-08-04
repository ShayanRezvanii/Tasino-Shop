"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";

type Product = {
  id: string;
  title: string;
  price: number;
  oldPrice?: number | null;
  isFlashSale: boolean;
  flashEndsAt?: string | null;
  categoryName?: string;
};

export default function AdminFlashSales() {
  const [products, setProducts] = useState<Product[]>([]);
  const [msg, setMsg] = useState("");

  const load = () =>
    fetch("/api/products?all=1")
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []));

  useEffect(() => {
    load();
  }, []);

  const toggleFlash = async (p: Product, enable: boolean) => {
    setMsg("");
    const res = await fetch("/api/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: p.id,
        isFlashSale: enable,
        flashEndsAt: enable
          ? new Date(Date.now() + 12 * 3600000).toISOString()
          : null,
      }),
    });
    if (!res.ok) {
      const d = await res.json();
      setMsg(d.error || "خطا");
      return;
    }
    setMsg(enable ? "به فروش ویژه اضافه شد" : "از فروش ویژه حذف شد");
    load();
  };

  const flash = products.filter((p) => p.isFlashSale);
  const others = products.filter((p) => !p.isFlashSale);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">فروش ویژه</h1>
        <p className="mt-1 text-sm text-slate-500">
          محصولات فروش ویژه در بنر فلش‌سیل صفحه اصلی نمایش داده می‌شوند
        </p>
      </div>
      {msg ? (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {msg}
        </p>
      ) : null}

      <div className="rounded-2xl bg-white p-5 shadow-card">
        <h2 className="mb-3 font-bold">محصولات فروش ویژه فعال</h2>
        {flash.length === 0 ? (
          <p className="text-sm text-slate-500">فعلاً محصولی در فروش ویژه نیست</p>
        ) : (
          <div className="space-y-2">
            {flash.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50/50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-bold">{p.title}</p>
                  <p className="text-xs text-slate-500">
                    {formatPrice(p.price)} تومان
                    {p.oldPrice ? ` ← قبل: ${formatPrice(p.oldPrice)}` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleFlash(p, false)}
                  className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-red-600 border"
                >
                  حذف از ویژه
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-card">
        <h2 className="mb-3 font-bold">افزودن به فروش ویژه</h2>
        <div className="space-y-2">
          {others.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-xl border px-4 py-3"
            >
              <div>
                <p className="text-sm font-bold">{p.title}</p>
                <p className="text-xs text-slate-400">{p.categoryName}</p>
              </div>
              <button
                type="button"
                onClick={() => toggleFlash(p, true)}
                className="rounded-lg bg-tasino-yellow px-3 py-1.5 text-xs font-bold text-tasino-blue-deep"
              >
                فعال‌سازی ویژه
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
