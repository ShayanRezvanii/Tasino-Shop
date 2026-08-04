import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const product = await prisma.product.findFirst({
    where: {
      OR: [{ slug }, { id: slug }],
      isActive: true,
    },
    include: { category: true },
  });
  if (!product) {
    return NextResponse.json({ error: "محصول یافت نشد" }, { status: 404 });
  }
  const discount =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : undefined;
  return NextResponse.json({
    product: { ...product, discount, categoryName: product.category.name },
  });
}
