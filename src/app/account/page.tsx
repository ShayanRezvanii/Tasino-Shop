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
};

export default function AccountHome() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((d) => setOrders(d.orders || []))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white p-5 shadow-card">
        <h2 className="mb-2 text-lg font-bold">پنل مشتری</h2>
        <p className="text-sm text-slate-500">
          وضعیت سفارش‌ها و اطلاعات حساب کاربری شما
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-tasino-muted p-4">
            <p className="text-xs text-slate-500">تعداد سفارش</p>
            <p className="mt-1 text-2xl font-black text-tasino-blue">
              {orders.length.toLocaleString("fa-IR")}
            </p>
          </div>
          <div className="rounded-xl bg-tasino-muted p-4">
            <p className="text-xs text-slate-500">در انتظار پرداخت</p>
            <p className="mt-1 text-2xl font-black text-amber-600">
              {orders
                .filter((o) => o.status === "AWAITING_PAYMENT")
                .length.toLocaleString("fa-IR")}
            </p>
          </div>
          <div className="rounded-xl bg-tasino-muted p-4">
            <p className="text-xs text-slate-500">تحویل شده</p>
            <p className="mt-1 text-2xl font-black text-emerald-600">
              {orders
                .filter((o) => o.status === "DELIVERED")
                .length.toLocaleString("fa-IR")}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bold">آخرین سفارش‌ها</h3>
          <Link href="/account/orders" className="text-sm text-tasino-blue">
            همه
          </Link>
        </div>
        {orders.length === 0 ? (
          <p className="text-sm text-slate-500">هنوز سفارشی ثبت نکرده‌اید</p>
        ) : (
          <div className="space-y-2">
            {orders.slice(0, 5).map((o) => (
              <Link
                key={o.id}
                href={`/account/orders/${o.id}`}
                className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3 hover:bg-tasino-muted"
              >
                <div>
                  <p className="text-sm font-bold" dir="ltr">
                    {o.orderNumber}
                  </p>
                  <p className="text-xs text-slate-400">
                    {new Date(o.createdAt).toLocaleDateString("fa-IR")}
                  </p>
                </div>
                <div className="text-left">
                  <span
                    className={`rounded-lg px-2 py-1 text-[11px] font-bold ${orderStatusColor(o.status)}`}
                  >
                    {orderStatusLabel(o.status)}
                  </span>
                  <p className="mt-1 text-sm font-bold">
                    {formatPrice(o.totalAmount)} ت
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
