"use client";

import { useEffect, useState } from "react";
import {
  formatPrice,
  orderStatusColor,
  orderStatusLabel,
} from "@/lib/utils";

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  shippingName: string;
  shippingPhone: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingProvince?: string;
  user: { name: string; email: string };
  items: { title: string; quantity: number }[];
};

const STATUSES = [
  "PENDING",
  "AWAITING_PAYMENT",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "FAILED",
];

const QUICK = [
  { status: "PROCESSING", label: "آماده‌سازی" },
  { status: "SHIPPED", label: "ارسال شد" },
  { status: "DELIVERED", label: "تحویل شد" },
  { status: "CANCELLED", label: "لغو" },
] as const;

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [busyId, setBusyId] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const load = () =>
    fetch("/api/orders?all=1")
      .then((r) => r.json())
      .then((d) => setOrders(d.orders || []));

  useEffect(() => {
    load();
  }, []);

  const setStatus = async (id: string, status: string) => {
    setBusyId(id);
    setMsg("");
    setErr("");
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(data.error || data.detail || "تغییر وضعیت ناموفق بود");
        return;
      }
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o))
      );
      setMsg(`وضعیت به «${orderStatusLabel(status)}» تغییر کرد`);
    } catch {
      setErr("خطا در ارتباط با سرور");
    } finally {
      setBusyId("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">مدیریت سفارش‌ها</h1>
        <p className="mt-1 text-sm text-slate-500">
          وضعیت سفارش را به ارسال‌شده یا تحویل‌شده تغییر دهید
        </p>
      </div>

      {msg ? (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {msg}
        </p>
      ) : null}
      {err ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {err}
        </p>
      ) : null}

      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="rounded-2xl bg-white p-5 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-bold" dir="ltr">
                    {o.orderNumber}
                  </p>
                  <span
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold ${orderStatusColor(o.status)}`}
                  >
                    {orderStatusLabel(o.status)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {o.user?.name || o.shippingName} — {o.shippingPhone}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {new Date(o.createdAt).toLocaleString("fa-IR")}
                </p>
                {o.shippingAddress ? (
                  <p className="mt-1 text-xs text-slate-500">
                    {o.shippingProvince}، {o.shippingCity}، {o.shippingAddress}
                  </p>
                ) : null}
                <p className="mt-2 text-sm">
                  {o.items.map((i) => `${i.title} ×${i.quantity}`).join("، ")}
                </p>
                <p className="mt-1 font-bold text-tasino-blue">
                  {formatPrice(o.totalAmount)} تومان
                </p>
              </div>

              <div className="w-full max-w-xs space-y-3 sm:w-auto">
                <div>
                  <label className="mb-1 block text-xs text-slate-500">
                    تغییر وضعیت
                  </label>
                  <select
                    value={o.status}
                    disabled={busyId === o.id}
                    onChange={(e) => setStatus(o.id, e.target.value)}
                    className="w-full rounded-xl border px-3 py-2 text-sm disabled:opacity-60"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {orderStatusLabel(s)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-wrap gap-2">
                  {QUICK.map((q) => (
                    <button
                      key={q.status}
                      type="button"
                      disabled={busyId === o.id || o.status === q.status}
                      onClick={() => setStatus(o.id, q.status)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold transition disabled:opacity-40 ${
                        q.status === "SHIPPED"
                          ? "bg-indigo-600 text-white hover:bg-indigo-700"
                          : q.status === "DELIVERED"
                            ? "bg-emerald-600 text-white hover:bg-emerald-700"
                            : q.status === "CANCELLED"
                              ? "bg-red-50 text-red-600 hover:bg-red-100"
                              : "bg-tasino-muted text-tasino-blue-deep hover:bg-slate-200"
                      }`}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
        {orders.length === 0 ? (
          <p className="text-sm text-slate-500">سفارشی ثبت نشده</p>
        ) : null}
      </div>
    </div>
  );
}
