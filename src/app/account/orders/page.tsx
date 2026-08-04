"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatPrice, orderStatusColor, orderStatusLabel } from "@/lib/utils";

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: { title: string; quantity: number }[];
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((d) => setOrders(d.orders || []))
      .catch(() => {});
  }, []);

  return (
    <div className="rounded-2xl bg-white p-5 shadow-card">
      <h2 className="mb-4 text-lg font-bold">وضعیت سفارش‌ها</h2>
      {orders.length === 0 ? (
        <p className="text-sm text-slate-500">سفارشی یافت نشد</p>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <Link
              key={o.id}
              href={`/account/orders/${o.id}`}
              className="block rounded-xl border border-slate-100 p-4 transition hover:border-tasino-blue/30 hover:bg-tasino-muted/50"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-bold" dir="ltr">
                    {o.orderNumber}
                  </p>
                  <p className="text-xs text-slate-400">
                    {new Date(o.createdAt).toLocaleString("fa-IR")}
                  </p>
                </div>
                <span
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold ${orderStatusColor(o.status)}`}
                >
                  {orderStatusLabel(o.status)}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                {o.items.map((i) => `${i.title} × ${i.quantity}`).join("، ")}
              </p>
              <p className="mt-2 text-sm font-bold text-tasino-blue">
                {formatPrice(o.totalAmount)} تومان
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
