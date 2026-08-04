import { NextResponse } from "next/server";

export function apiError(error: unknown, fallback = "خطای سرور") {
  const message = error instanceof Error ? error.message : fallback;
  console.error("[api]", message, error);

  // Surface actionable DB/config errors in responses (helps Netlify debugging)
  const isConfig =
    /DATABASE|database|Prisma|Environment variable|not found|SQLITE/i.test(
      message
    );

  return NextResponse.json(
    {
      error: isConfig
        ? `پیکربندی دیتابیس: ${message}`
        : fallback,
      detail: process.env.NODE_ENV === "production" && !isConfig ? undefined : message,
    },
    { status: 500 }
  );
}
