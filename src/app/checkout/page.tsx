"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";
import Header, { HeaderSpacer } from "@/components/Header";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const { items, total, clear } = useCart();
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/auth?next=/checkout");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!items.length) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
          shippingName: name,
          shippingPhone: phone,
          shippingProvince: province,
          shippingCity: city,
          shippingAddress: address,
          note,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "خطا در ثبت سفارش");
        return;
      }
      clear();
      window.location.href = data.paymentUrl;
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <div className="p-10 text-center">در حال بارگذاری...</div>;
  }

  if (!items.length) {
    return (
      <div className="min-h-screen bg-tasino-muted">
        <Header />
        <HeaderSpacer />
        <div className="container-tasino py-16 text-center">
          <p className="text-slate-500">سبد خرید خالی است</p>
          <Link href="/products" className="mt-4 inline-block text-tasino-blue">
            بازگشت به فروشگاه
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tasino-muted">
      <Header />
      <HeaderSpacer />
      <main className="container-tasino py-8">
        <h1 className="mb-6 text-2xl font-bold">تسویه حساب</h1>
        <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 rounded-2xl bg-white p-5 shadow-card lg:col-span-2">
            <h2 className="font-bold">اطلاعات ارسال</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="نام گیرنده"
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-tasino-blue"
              />
              <input
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="موبایل"
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-tasino-blue"
              />
              <input
                required
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                placeholder="استان"
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-tasino-blue"
              />
              <input
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="شهر"
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-tasino-blue"
              />
            </div>
            <textarea
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="آدرس کامل"
              rows={3}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-tasino-blue"
            />
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="توضیحات سفارش (اختیاری)"
              rows={2}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-tasino-blue"
            />
            {error ? (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            ) : null}
          </div>

          <div className="h-fit rounded-2xl bg-white p-5 shadow-card">
            <h2 className="mb-4 font-bold">پرداخت</h2>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-slate-500">مبلغ کالاها</span>
              <span>{formatPrice(total)} تومان</span>
            </div>
            <div className="mb-4 flex justify-between text-sm">
              <span className="text-slate-500">هزینه ارسال</span>
              <span>محاسبه در ثبت سفارش</span>
            </div>
            <p className="mb-4 rounded-lg bg-tasino-muted p-3 text-xs text-slate-600">
              پس از ثبت سفارش به درگاه پرداخت زرین‌پال هدایت می‌شوید.
            </p>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-tasino-blue py-3 text-sm font-bold text-white hover:bg-tasino-blue-dark disabled:opacity-60"
            >
              {loading ? "در حال انتقال به درگاه..." : "پرداخت و ثبت سفارش"}
            </button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
