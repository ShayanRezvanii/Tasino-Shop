import { NextRequest, NextResponse } from "next/server";
import { getSession, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tree = searchParams.get("tree") === "1";
  const all = searchParams.get("all") === "1";
  const session = await getSession();
  const isAdmin = session?.role === "ADMIN";

  if (tree) {
    const parents = await prisma.category.findMany({
      where: {
        parentId: null,
        ...(all && isAdmin ? {} : { isActive: true }),
      },
      orderBy: { sortOrder: "asc" },
      include: {
        children: {
          where: all && isAdmin ? {} : { isActive: true },
          orderBy: { sortOrder: "asc" },
          include: { _count: { select: { products: true } } },
        },
        _count: { select: { products: true } },
      },
    });
    return NextResponse.json({ categories: parents });
  }

  const categories = await prisma.category.findMany({
    where: all && isAdmin ? {} : { isActive: true },
    orderBy: [{ parentId: "asc" }, { sortOrder: "asc" }],
    include: { _count: { select: { products: true } }, parent: true },
  });
  return NextResponse.json({ categories });
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const name = String(body.name || "").trim();
    if (!name) {
      return NextResponse.json({ error: "نام دسته‌بندی الزامی است" }, { status: 400 });
    }
    let slug = body.slug ? slugify(body.slug) : slugify(name);
    const exists = await prisma.category.findUnique({ where: { slug } });
    if (exists) slug = `${slug}-${Date.now().toString(36)}`;

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: body.description || null,
        icon: body.icon || "Wrench",
        image: body.image || null,
        parentId: body.parentId || null,
        sortOrder: Number(body.sortOrder) || 0,
        isActive: body.isActive !== false,
      },
    });
    return NextResponse.json({ category });
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
    const id = body.id as string;
    if (!id) return NextResponse.json({ error: "شناسه لازم است" }, { status: 400 });

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.slug !== undefined && { slug: slugify(body.slug) }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.icon !== undefined && { icon: body.icon }),
        ...(body.image !== undefined && { image: body.image }),
        ...(body.parentId !== undefined && { parentId: body.parentId || null }),
        ...(body.sortOrder !== undefined && { sortOrder: Number(body.sortOrder) }),
        ...(body.isActive !== undefined && { isActive: Boolean(body.isActive) }),
      },
    });
    return NextResponse.json({ category });
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
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "ورود لازم است" }, { status: 401 });
    if (msg === "FORBIDDEN") return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    console.error(e);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
