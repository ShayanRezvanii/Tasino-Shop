import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await requireAdmin();
    const [products, orders, users, categories, revenue] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.category.count({ where: { parentId: null } }),
      prisma.order.aggregate({
        where: { status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] } },
        _sum: { totalAmount: true },
      }),
    ]);

    const recentOrders = await prisma.order.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    return NextResponse.json({
      stats: {
        products,
        orders,
        users,
        categories,
        revenue: revenue._sum.totalAmount || 0,
      },
      recentOrders,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "ورود لازم است" }, { status: 401 });
    if (msg === "FORBIDDEN") return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
