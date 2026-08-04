import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  createToken,
  hashPassword,
  setSessionCookie,
  verifyPassword,
} from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action as string;

    if (action === "register") {
      const data = registerSchema.parse(body);
      const exists = await prisma.user.findUnique({ where: { email: data.email } });
      if (exists) {
        return NextResponse.json(
          { error: "این ایمیل قبلاً ثبت شده است" },
          { status: 400 }
        );
      }
      const password = await hashPassword(data.password);
      const user = await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          password,
          role: "CUSTOMER",
        },
      });
      const token = await createToken({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });
      await setSessionCookie(token);
      return NextResponse.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      });
    }

    if (action === "login") {
      const data = loginSchema.parse(body);
      const user = await prisma.user.findUnique({ where: { email: data.email } });
      if (!user || !(await verifyPassword(data.password, user.password))) {
        return NextResponse.json(
          { error: "ایمیل یا رمز عبور اشتباه است" },
          { status: 401 }
        );
      }
      const token = await createToken({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      });
      await setSessionCookie(token);
      return NextResponse.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      });
    }

    return NextResponse.json({ error: "عملیات نامعتبر" }, { status: 400 });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "اطلاعات وارد شده معتبر نیست" }, { status: 400 });
    }
    console.error(e);
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 });
  }
}
