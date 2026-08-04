import { NextRequest, NextResponse } from "next/server";
import { getSession, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const q = searchParams.get("q");
  const featured = searchParams.get("featured");
  const flash = searchParams.get("flash");
  const all = searchParams.get("all") === "1";
  const session = await getSession();
  const isAdmin = session?.role === "ADMIN";

  const where: Record<string, unknown> = {};
  if (!(all && isAdmin)) where.isActive = true;
  if (featured === "1") where.isFeatured = true;
  if (flash === "1") where.isFlashSale = true;
  if (category) {
    const cat = await prisma.category.findFirst({
      where: { OR: [{ slug: category }, { id: category }] },
      include: { children: true },
    });
    if (cat) {
      const ids = [cat.id, ...cat.children.map((c) => c.id)];
      where.categoryId = { in: ids };
    }
  }
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
      { specs: { contains: q } },
    ];
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { category: true },
    take: Number(searchParams.get("limit")) || 100,
  });

  return NextResponse.json({
    products: products.map((p) => ({
      ...p,
      discount:
        p.oldPrice && p.oldPrice > p.price
          ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
          : undefined,
      categoryName: p.category.name,
    })),
  });
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const title = String(body.title || "").trim();
    if (!title || !body.categoryId || body.price == null) {
      return NextResponse.json({ error: "عنوان، دسته و قیمت الزامی است" }, { status: 400 });
    }
    let slug = body.slug ? slugify(body.slug) : slugify(title);
    const exists = await prisma.product.findUnique({ where: { slug } });
    if (exists) slug = `${slug}-${Date.now().toString(36)}`;

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description: body.description || null,
        image: body.image || "/products/valve.svg",
        price: Number(body.price),
        oldPrice: body.oldPrice ? Number(body.oldPrice) : null,
        stock: Number(body.stock) || 0,
        rating: Number(body.rating) || 4.5,
        specs: body.specs || null,
        badge: body.badge || null,
        isActive: body.isActive !== false,
        isFeatured: Boolean(body.isFeatured),
        isFlashSale: Boolean(body.isFlashSale),
        flashEndsAt: body.flashEndsAt ? new Date(body.flashEndsAt) : null,
        categoryId: body.categoryId,
      },
      include: { category: true },
    });
    return NextResponse.json({ product });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "ورود لازم است" }, { status: 401 });
    if (msg === "FORBIDDEN") return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    console.error(e);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    if (!body.id) return NextResponse.json({ error: "شناسه لازم است" }, { status: 400 });

    const product = await prisma.product.update({
      where: { id: body.id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.slug !== undefined && { slug: slugify(body.slug) }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.image !== undefined && { image: body.image }),
        ...(body.price !== undefined && { price: Number(body.price) }),
        ...(body.oldPrice !== undefined && {
          oldPrice: body.oldPrice ? Number(body.oldPrice) : null,
        }),
        ...(body.stock !== undefined && { stock: Number(body.stock) }),
        ...(body.rating !== undefined && { rating: Number(body.rating) }),
        ...(body.specs !== undefined && { specs: body.specs }),
        ...(body.badge !== undefined && { badge: body.badge }),
        ...(body.isActive !== undefined && { isActive: Boolean(body.isActive) }),
        ...(body.isFeatured !== undefined && { isFeatured: Boolean(body.isFeatured) }),
        ...(body.isFlashSale !== undefined && { isFlashSale: Boolean(body.isFlashSale) }),
        ...(body.flashEndsAt !== undefined && {
          flashEndsAt: body.flashEndsAt ? new Date(body.flashEndsAt) : null,
        }),
        ...(body.categoryId !== undefined && { categoryId: body.categoryId }),
      },
      include: { category: true },
    });
    return NextResponse.json({ product });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "ورود لازم است" }, { status: 401 });
    if (msg === "FORBIDDEN") return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    console.error(e);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "شناسه لازم است" }, { status: 400 });
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "ورود لازم است" }, { status: 401 });
    if (msg === "FORBIDDEN") return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    console.error(e);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
