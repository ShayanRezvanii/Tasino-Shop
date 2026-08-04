import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin, requireUser } from "@/lib/auth";
import { requestZarinpalPayment } from "@/lib/payment";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";

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

export async function GET(req: NextRequest) {
  try {
    const session = await requireUser();
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
      where: { userId: session.id },
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });
    return NextResponse.json({ orders });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "ورود لازم است" }, { status: 401 });
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireUser();
    const body = checkoutSchema.parse(await req.json());

    const productIds = body.items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });
    if (products.length !== productIds.length) {
      return NextResponse.json({ error: "برخی محصولات یافت نشدند" }, { status: 400 });
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

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: session.id,
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

    const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const payment = await requestZarinpalPayment({
      amount: totalAmount,
      description: `سفارش ${order.orderNumber}`,
      callbackUrl: `${base}/api/payment/verify?orderId=${order.id}`,
      email: session.email,
      mobile: body.shippingPhone,
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
      return NextResponse.json({ error: "اطلاعات ارسال ناقص است" }, { status: 400 });
    }
    const msg = e instanceof Error ? e.message : "";
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "ورود لازم است" }, { status: 401 });
    if (msg.startsWith("STOCK:")) {
      return NextResponse.json(
        { error: `موجودی کافی نیست: ${msg.replace("STOCK:", "")}` },
        { status: 400 }
      );
    }
    console.error(e);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
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
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "ورود لازم است" }, { status: 401 });
    if (msg === "FORBIDDEN") return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
