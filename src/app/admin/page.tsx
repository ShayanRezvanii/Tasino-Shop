"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice, orderStatusLabel } from "@/lib/utils";

type Stats = {
  products: number;
  orders: number;
  users: number;
  categories: number;
  revenue: number;
};

type RecentOrder = {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  user: { name: string };
};

export default function AdminHome() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<RecentOrder[]>([]);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => {
        setStats(d.stats);
        setRecent(d.recentOrders || []);
      });
  }, []);

  const cards = [
    { label: "محصولات", value: stats?.products, href: "/admin/products" },
    { label: "دسته‌بندی‌ها", value: stats?.categories, href: "/admin/categories" },
    { label: "سفارش‌ها", value: stats?.orders, href: "/admin/orders" },
    { label: "مشتریان", value: stats?.users, href: "/admin/users" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-tasino-text">داشبورد مدیریت</h1>
        <p className="mt-1 text-sm text-slate-500">
          مدیریت کامل محصولات، دسته‌بندی‌ها، بنرها، فروش ویژه و سفارش‌ها
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-2xl bg-white p-5 shadow-card transition hover:-translate-y-0.5"
          >
            <p className="text-sm text-slate-500">{c.label}</p>
            <p className="mt-2 text-3xl font-black text-tasino-blue">
              {(c.value ?? 0).toLocaleString("fa-IR")}
            </p>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-card">
        <p className="text-sm text-slate-500">درآمد سفارش‌های پرداخت‌شده</p>
        <p className="mt-2 text-3xl font-black text-emerald-600">
          {formatPrice(stats?.revenue || 0)}{" "}
          <span className="text-sm font-normal text-slate-400">تومان</span>
        </p>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold">آخرین سفارش‌ها</h2>
          <Link href="/admin/orders" className="text-sm text-tasino-blue">
            همه
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] text-sm">
            <thead>
              <tr className="border-b text-slate-500">
                <th className="py-2 text-right font-medium">شماره</th>
                <th className="py-2 text-right font-medium">مشتری</th>
                <th className="py-2 text-right font-medium">وضعیت</th>
                <th className="py-2 text-right font-medium">مبلغ</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((o) => (
                <tr key={o.id} className="border-b border-slate-50">
                  <td className="py-3" dir="ltr">
                    {o.orderNumber}
                  </td>
                  <td className="py-3">{o.user?.name}</td>
                  <td className="py-3">{orderStatusLabel(o.status)}</td>
                  <td className="py-3">{formatPrice(o.totalAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
