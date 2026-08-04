export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fa-IR").format(price);
}

export function slugify(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\u0600-\u06FFa-zA-Z0-9\-]/g, "")
    .toLowerCase();
}

export function orderStatusLabel(status: string): string {
  const map: Record<string, string> = {
    PENDING: "در انتظار",
    AWAITING_PAYMENT: "در انتظار پرداخت",
    PAID: "پرداخت شده",
    PROCESSING: "در حال آماده‌سازی",
    SHIPPED: "ارسال شده",
    DELIVERED: "تحویل شده",
    CANCELLED: "لغو شده",
    FAILED: "ناموفق",
  };
  return map[status] || status;
}

export function orderStatusColor(status: string): string {
  const map: Record<string, string> = {
    PENDING: "bg-slate-100 text-slate-700",
    AWAITING_PAYMENT: "bg-amber-100 text-amber-800",
    PAID: "bg-emerald-100 text-emerald-800",
    PROCESSING: "bg-blue-100 text-blue-800",
    SHIPPED: "bg-indigo-100 text-indigo-800",
    DELIVERED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-700",
    FAILED: "bg-red-100 text-red-700",
  };
  return map[status] || "bg-slate-100 text-slate-700";
}

export function generateOrderNumber() {
  const n = Date.now().toString().slice(-8);
  return `TS-${n}`;
}

export type CartItem = {
  productId: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
};
