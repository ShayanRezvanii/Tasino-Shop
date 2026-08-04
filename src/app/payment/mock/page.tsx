"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function MockPaymentInner() {
  const search = useSearchParams();
  const authority = search.get("Authority") || "";
  const amount = search.get("Amount") || "0";
  const [loading, setLoading] = useState(false);

  // Extract orderId from referrer callback pattern stored in authority flow
  // We redirect to verify with Status
  const pay = async (ok: boolean) => {
    setLoading(true);
    // Find order by authority
    const res = await fetch(`/api/payment/mock-resolve?Authority=${authority}`);
    const data = await res.json();
    if (!data.orderId) {
      alert("سفارش یافت نشد");
      setLoading(false);
      return;
    }
    window.location.href = `/api/payment/verify?orderId=${data.orderId}&Authority=${authority}&Status=${ok ? "OK" : "NOK"}`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-2xl font-black text-amber-700">
          ZP
        </div>
        <h1 className="text-xl font-bold">درگاه پرداخت آزمایشی زرین‌پال</h1>
        <p className="mt-2 text-sm text-slate-500">
          مبلغ قابل پرداخت:{" "}
          <strong className="text-tasino-blue">
            {Number(amount).toLocaleString("fa-IR")} تومان
          </strong>
        </p>
        <p className="mt-1 text-xs text-slate-400" dir="ltr">
          Authority: {authority}
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={() => pay(true)}
            className="rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            پرداخت موفق (شبیه‌سازی)
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => pay(false)}
            className="rounded-xl bg-red-500 py-3 text-sm font-bold text-white hover:bg-red-600 disabled:opacity-60"
          >
            انصراف / پرداخت ناموفق
          </button>
          <Link href="/cart" className="text-sm text-slate-500 hover:underline">
            بازگشت به سبد
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function MockPaymentPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-white">...</div>}>
      <MockPaymentInner />
    </Suspense>
  );
}
