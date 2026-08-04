"use client";

import { useEffect, useState } from "react";
import { formatPrice, orderStatusLabel } from "@/lib/utils";

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  shippingName: string;
  shippingPhone: string;
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

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  const load = () =>
    fetch("/api/orders?all=1")
      .then((r) => r.json())
      .then((d) => setOrders(d.orders || []));

  useEffect(() => {
    load();
  }, []);

  const setStatus = async (id: string, status: string) => {
    await fetch("/api/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    load();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black">مدیریت سفارش‌ها</h1>
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="rounded-2xl bg-white p-5 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-bold" dir="ltr">
                  {o.orderNumber}
                </p>
                <p className="text-sm text-slate-500">
                  {o.user?.name} — {o.shippingPhone}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {new Date(o.createdAt).toLocaleString("fa-IR")}
                </p>
                <p className="mt-2 text-sm">
                  {o.items.map((i) => `${i.title} ×${i.quantity}`).join("، ")}
                </p>
                <p className="mt-1 font-bold text-tasino-blue">
                  {formatPrice(o.totalAmount)} تومان
                </p>
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">وضعیت</label>
                <select
                  value={o.status}
                  onChange={(e) => setStatus(o.id, e.target.value)}
                  className="rounded-xl border px-3 py-2 text-sm"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {orderStatusLabel(s)}
                    </option>
                  ))}
                </select>
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
