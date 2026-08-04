import { CartItem } from "./utils";

const isSandbox = () => process.env.ZARINPAL_SANDBOX !== "false";

export async function requestZarinpalPayment(params: {
  amount: number;
  description: string;
  callbackUrl: string;
  email?: string;
  mobile?: string;
  appBaseUrl?: string;
}): Promise<{ authority: string; paymentUrl: string }> {
  const merchant = process.env.ZARINPAL_MERCHANT_ID || "sandbox";

  // Sandbox / mock gateway for local development & Netlify demo
  if (isSandbox() || merchant.includes("xxxx")) {
    const authority = `SAND-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const base =
      params.appBaseUrl ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";
    return {
      authority,
      paymentUrl: `${base.replace(/\/$/, "")}/payment/mock?Authority=${authority}&Amount=${params.amount}`,
    };
  }

  const res = await fetch("https://api.zarinpal.com/pg/v4/payment/request.json", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      merchant_id: merchant,
      amount: params.amount,
      description: params.description,
      callback_url: params.callbackUrl,
      metadata: {
        email: params.email,
        mobile: params.mobile,
      },
    }),
  });

  const data = await res.json();
  if (data?.data?.authority) {
    return {
      authority: data.data.authority,
      paymentUrl: `https://www.zarinpal.com/pg/StartPay/${data.data.authority}`,
    };
  }
  throw new Error(data?.errors?.message || "خطا در اتصال به درگاه پرداخت");
}

export async function verifyZarinpalPayment(params: {
  authority: string;
  amount: number;
}): Promise<{ success: boolean; refId?: string }> {
  const merchant = process.env.ZARINPAL_MERCHANT_ID || "sandbox";

  if (isSandbox() || merchant.includes("xxxx") || params.authority.startsWith("SAND-")) {
    return { success: true, refId: `REF-${Date.now()}` };
  }

  const res = await fetch("https://api.zarinpal.com/pg/v4/payment/verify.json", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      merchant_id: merchant,
      amount: params.amount,
      authority: params.authority,
    }),
  });

  const data = await res.json();
  const code = data?.data?.code;
  if (code === 100 || code === 101) {
    return { success: true, refId: String(data.data.ref_id) };
  }
  return { success: false };
}

export function calcCartTotal(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}
