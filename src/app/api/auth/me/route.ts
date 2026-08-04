import { NextResponse } from "next/server";
import { getUserOrNull } from "@/lib/auth";

export async function GET() {
  const user = await getUserOrNull();
  return NextResponse.json({ user });
}
