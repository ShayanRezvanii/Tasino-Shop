"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import Footer from "@/components/Footer";
import Header, { HeaderSpacer } from "@/components/Header";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, total, updateQty, removeItem } = useCart();

  return (
    <div className="min-h-screen bg-tasino-muted">
      <Header />
      <HeaderSpacer />
      <main className="container-tasino py-8">
        <h1 className="mb-6 text-2xl font-bold text-tasino-text">سبد خرید</h1>

        {items.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-card">
            <p className="text-slate-500">سبد خرید شما خالی است</p>
            <Link
              href="/products"
              className="mt-4 inline-block rounded-xl bg-tasino-blue px-5 py-2.5 text-sm font-bold text-white"
            >
              مشاهده محصولات
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-3 lg:col-span-2">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-card"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-tasino-muted">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-bold text-tasino-text">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm font-bold text-tasino-blue">
                      {formatPrice(item.price)} تومان
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQty(item.productId, item.quantity - 1)}
                        className="rounded-lg border p-1"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm">
                        {item.quantity.toLocaleString("fa-IR")}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQty(item.productId, item.quantity + 1)}
                        className="rounded-lg border p-1"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="mr-2 text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-fit rounded-2xl bg-white p-5 shadow-card">
              <h2 className="mb-4 font-bold text-tasino-text">خلاصه سفارش</h2>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">جمع کل</span>
                <span className="font-bold">{formatPrice(total)} تومان</span>
              </div>
              <Link
                href="/checkout"
                className="mt-5 block rounded-xl bg-tasino-yellow py-3 text-center text-sm font-bold text-tasino-blue-deep transition hover:bg-tasino-yellow-dark"
              >
                ادامه فرآیند خرید
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
