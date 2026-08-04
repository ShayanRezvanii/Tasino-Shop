import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { apiError } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const MAX_BYTES = 2.5 * 1024 * 1024; // 2.5MB

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const form = await req.formData();
    const file = form.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "فایل تصویر ارسال نشده است" }, { status: 400 });
    }

    if (!ALLOWED.has(file.type)) {
      return NextResponse.json(
        { error: "فقط فرمت‌های JPG، PNG، WEBP و GIF مجاز است" },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "حجم تصویر باید کمتر از ۲٫۵ مگابایت باشد" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");
    const mime = file.type === "image/jpg" ? "image/jpeg" : file.type;
    const url = `data:${mime};base64,${base64}`;

    return NextResponse.json({
      url,
      name: file.name,
      size: file.size,
      type: mime,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "UNAUTHORIZED") {
      return NextResponse.json({ error: "ورود لازم است" }, { status: 401 });
    }
    if (msg === "FORBIDDEN") {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
    }
    return apiError(e, "خطا در آپلود تصویر");
  }
}
