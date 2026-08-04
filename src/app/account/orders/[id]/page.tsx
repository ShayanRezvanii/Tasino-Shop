"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import { formatPrice, orderStatusColor, orderStatusLabel } from "@/lib/utils";

type OrderDetail = {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  shippingCost: number;
  paymentRef?: string | null;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingProvince: string;
  createdAt: string;
  items: {
    id: string;
    title: string;
    price: number;
    quantity: number;
    image?: string | null;
  }[];
};

function OrderDetailInner() {
  const params = useParams();
  const search = useSearchParams();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const payment = search.get("payment");

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((d) => {
        const found = (d.orders || []).find(
          (o: OrderDetail) => o.id === params.id
        );
        setOrder(found || null);
      });
  }, [params.id]);

  if (!order) {
    return (
      <div className="rounded-2xl bg-white p-5 shadow-card">
        در حال بارگذاری...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {payment === "success" ? (
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
          پرداخت با موفقیت انجام شد
        </div>
      ) : null}
      {payment === "failed" ? (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          پرداخت ناموفق بود
        </div>
      ) : null}

      <div className="rounded-2xl bg-white p-5 shadow-card">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold" dir="ltr">
              {order.orderNumber}
            </h2>
            <p className="text-xs text-slate-400">
              {new Date(order.createdAt).toLocaleString("fa-IR")}
            </p>
          </div>
          <span
            className={`rounded-lg px-3 py-1.5 text-xs font-bold ${orderStatusColor(order.status)}`}
          >
            {orderStatusLabel(order.status)}
          </span>
        </div>

        <div className="mb-4 space-y-2">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-xl border border-slate-100 p-3"
            >
              <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-tasino-muted">
                {item.image ? (
                  <ProductImage
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-contain p-1"
                  />
                ) : null}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">{item.title}</p>
                <p className="text-xs text-slate-500">
                  {item.quantity.toLocaleString("fa-IR")} ×{" "}
                  {formatPrice(item.price)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-tasino-muted p-4 text-sm">
          <p>
            <strong>گیرنده:</strong> {order.shippingName} — {order.shippingPhone}
          </p>
          <p className="mt-1">
            <strong>آدرس:</strong> {order.shippingProvince}، {order.shippingCity}
            ، {order.shippingAddress}
          </p>
          {order.paymentRef ? (
            <p className="mt-1" dir="ltr">
              <strong>کد پیگیری پرداخت:</strong> {order.paymentRef}
            </p>
          ) : null}
          <p className="mt-2 font-bold text-tasino-blue">
            مبلغ کل: {formatPrice(order.totalAmount)} تومان
            {order.shippingCost
              ? ` (ارسال ${formatPrice(order.shippingCost)})`
              : " (ارسال رایگان)"}
          </p>
        </div>

        <Link
          href="/account/orders"
          className="mt-4 inline-block text-sm text-tasino-blue hover:underline"
        >
          بازگشت به لیست سفارش‌ها
        </Link>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <Suspense fallback={<div className="rounded-2xl bg-white p-5">...</div>}>
      <OrderDetailInner />
    </Suspense>
  );
}
