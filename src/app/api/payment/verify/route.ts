import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyZarinpalPayment } from "@/lib/payment";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");
  const authority = searchParams.get("Authority") || searchParams.get("authority");
  const status = searchParams.get("Status") || searchParams.get("status") || "OK";
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!orderId || !authority) {
    return NextResponse.redirect(`${base}/account/orders?error=invalid`);
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    return NextResponse.redirect(`${base}/account/orders?error=notfound`);
  }

  if (status !== "OK" && status !== "ok") {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "FAILED" },
    });
    return NextResponse.redirect(
      `${base}/account/orders/${order.id}?payment=failed`
    );
  }

  const result = await verifyZarinpalPayment({
    authority,
    amount: order.totalAmount,
  });

  if (!result.success) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "FAILED" },
    });
    return NextResponse.redirect(
      `${base}/account/orders/${order.id}?payment=failed`
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: order.id },
      data: {
        status: "PAID",
        paymentRef: result.refId,
        paymentAuthority: authority,
      },
    });
    const items = await tx.orderItem.findMany({ where: { orderId: order.id } });
    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }
  });

  return NextResponse.redirect(
    `${base}/account/orders/${order.id}?payment=success`
  );
}
