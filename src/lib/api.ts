import { NextResponse } from "next/server";

export function apiError(error: unknown, fallback = "خطای سرور") {
  const message = error instanceof Error ? error.message : fallback;
  console.error("[api]", message, error);

  return NextResponse.json(
    {
      error: fallback,
      detail: message,
    },
    { status: 500 }
  );
}
