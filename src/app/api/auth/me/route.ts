import { NextResponse } from "next/server";
import { getUserOrNull } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getUserOrNull();
    return NextResponse.json({ user });
  } catch (e) {
    console.error("[auth/me]", e);
    return NextResponse.json({ user: null });
  }
}
