import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { hashPassword, requireAdmin, requireUser } from "@/lib/auth";
import { apiError } from "@/lib/api";
import { requestZarinpalPayment } from "@/lib/payment";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
  shippingName: z.string().min(2),
  shippingPhone: z.string().min(8),
  shippingAddress: z.string().min(5),
  shippingCity: z.string().min(2),
  shippingProvince: z.string().min(2),
  note: z.string().optional(),
});

function appBaseUrl(req: NextRequest) {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (envUrl && !envUrl.includes("localhost")) return envUrl.replace(/\/$/, "");
  const host =
    req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  const proto = req.headers.get("x-forwarded-proto") || "https";
  if (host) return `${proto}://${host}`;
  return envUrl || "http://localhost:3000";
}

/** Ensure JWT user exists in this serverless DB instance (SQLite /tmp is ephemeral). */
async function ensureDbUser(session: {
  id: string;
  email: string;
  name: string;
  role: string;
}) {
  const byId = await prisma.user.findUnique({ where: { id: session.id } });
  if (byId) return byId;

  const byEmail = await prisma.user.findUnique({
    where: { email: session.email },
  });
  if (byEmail) return byEmail;

  return prisma.user.create({
    data: {
      id: session.id,
      email: session.email,
      name: session.name || "کاربر",
      role: session.role === "ADMIN" ? "ADMIN" : "CUSTOMER",
      password: await hashPassword(`tmp-${session.id}`),
    },
  });
}

export async function GET(req: NextRequest) {
  try {
    const session = await requireUser();
    const dbUser = await ensureDbUser(session);
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "1";

    if (all) {
      if (session.role !== "ADMIN") {
        return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
      }
      const orders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          items: true,
          user: { select: { id: true, name: true, email: true, phone: true } },
        },
      });
      return NextResponse.json({ orders });
    }

    const orders = await prisma.order.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });
    return NextResponse.json({ orders });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "UNAUTHORIZED") {
      return NextResponse.json({ error: "ورود لازم است" }, { status: 401 });
    }
    return apiError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireUser();
    const dbUser = await ensureDbUser(session);
    const body = checkoutSchema.parse(await req.json());

    const productIds = body.items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });
    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: "برخی محصولات یافت نشدند یا موجود نیستند" },
        { status: 400 }
      );
    }

    let subtotal = 0;
    const orderItems = body.items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      if (product.stock < item.quantity) {
        throw new Error(`STOCK:${product.title}`);
      }
      subtotal += product.price * item.quantity;
      return {
        productId: product.id,
        title: product.title,
        price: product.price,
        quantity: item.quantity,
        image: product.image,
      };
    });

    const shippingSetting = await prisma.setting.findUnique({
      where: { key: "shipping_cost" },
    });
    const freeMin = await prisma.setting.findUnique({
      where: { key: "free_shipping_min" },
    });
    const shippingCostDefault = Number(shippingSetting?.value || 85000);
    const freeShippingMin = Number(freeMin?.value || 5000000);
    const shippingCost = subtotal >= freeShippingMin ? 0 : shippingCostDefault;
    const totalAmount = subtotal + shippingCost;
    const base = appBaseUrl(req);

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: dbUser.id,
        status: "AWAITING_PAYMENT",
        totalAmount,
        shippingCost,
        shippingName: body.shippingName,
        shippingPhone: body.shippingPhone,
        shippingAddress: body.shippingAddress,
        shippingCity: body.shippingCity,
        shippingProvince: body.shippingProvince,
        note: body.note || null,
        items: { create: orderItems },
      },
      include: { items: true },
    });

    const payment = await requestZarinpalPayment({
      amount: totalAmount,
      description: `سفارش ${order.orderNumber}`,
      callbackUrl: `${base}/api/payment/verify?orderId=${order.id}`,
      email: session.email,
      mobile: body.shippingPhone,
      appBaseUrl: base,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentAuthority: payment.authority },
    });

    return NextResponse.json({
      order,
      paymentUrl: payment.paymentUrl,
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { error: "اطلاعات ارسال ناقص است", issues: e.issues },
        { status: 400 }
      );
    }
    const msg = e instanceof Error ? e.message : "";
    if (msg === "UNAUTHORIZED") {
      return NextResponse.json({ error: "ورود لازم است" }, { status: 401 });
    }
    if (msg.startsWith("STOCK:")) {
      return NextResponse.json(
        { error: `موجودی کافی نیست: ${msg.replace("STOCK:", "")}` },
        { status: 400 }
      );
    }
    return apiError(e, "خطا در ثبت سفارش");
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    if (!body.id || !body.status) {
      return NextResponse.json({ error: "شناسه و وضعیت لازم است" }, { status: 400 });
    }
    const order = await prisma.order.update({
      where: { id: body.id },
      data: { status: body.status },
      include: { items: true, user: { select: { name: true, email: true } } },
    });
    return NextResponse.json({ order });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "UNAUTHORIZED") {
      return NextResponse.json({ error: "ورود لازم است" }, { status: 401 });
    }
    if (msg === "FORBIDDEN") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }
    return apiError(e);
  }
}
