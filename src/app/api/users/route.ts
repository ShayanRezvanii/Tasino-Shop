import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, requireUser, hashPassword, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await requireAdmin();
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
    });
    return NextResponse.json({ users });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "ورود لازم است" }, { status: 401 });
    if (msg === "FORBIDDEN") return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await requireUser();
    const body = await req.json();

    // Change own password
    if (body.action === "changePassword") {
      const user = await prisma.user.findUnique({ where: { id: session.id } });
      if (!user) return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
      const ok = await verifyPassword(body.currentPassword || "", user.password);
      if (!ok) {
        return NextResponse.json({ error: "رمز فعلی اشتباه است" }, { status: 400 });
      }
      if (!body.newPassword || body.newPassword.length < 6) {
        return NextResponse.json({ error: "رمز جدید باید حداقل ۶ کاراکتر باشد" }, { status: 400 });
      }
      const password = await hashPassword(body.newPassword);
      await prisma.user.update({ where: { id: user.id }, data: { password } });
      return NextResponse.json({ ok: true });
    }

    // Update own profile
    if (body.action === "updateProfile") {
      const user = await prisma.user.update({
        where: { id: session.id },
        data: {
          ...(body.name && { name: body.name }),
          ...(body.phone !== undefined && { phone: body.phone }),
        },
        select: { id: true, name: true, email: true, phone: true, role: true },
      });
      return NextResponse.json({ user });
    }

    // Admin reset user password
    if (body.action === "adminResetPassword") {
      await requireAdmin();
      if (!body.userId || !body.newPassword) {
        return NextResponse.json({ error: "اطلاعات ناقص است" }, { status: 400 });
      }
      const password = await hashPassword(body.newPassword);
      await prisma.user.update({
        where: { id: body.userId },
        data: { password },
      });
      return NextResponse.json({ ok: true });
    }

    // Admin update role
    if (body.action === "setRole") {
      await requireAdmin();
      await prisma.user.update({
        where: { id: body.userId },
        data: { role: body.role },
      });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "عملیات نامعتبر" }, { status: 400 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "UNAUTHORIZED") return NextResponse.json({ error: "ورود لازم است" }, { status: 401 });
    if (msg === "FORBIDDEN") return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
