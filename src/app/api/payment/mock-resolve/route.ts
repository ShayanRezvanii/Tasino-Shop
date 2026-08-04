import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const authority = new URL(req.url).searchParams.get("Authority");
  if (!authority) {
    return NextResponse.json({ error: "missing" }, { status: 400 });
  }
  const order = await prisma.order.findFirst({
    where: { paymentAuthority: authority },
  });
  if (!order) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json({ orderId: order.id });
}
