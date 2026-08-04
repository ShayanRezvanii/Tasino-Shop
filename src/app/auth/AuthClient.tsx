"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function AuthClient() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { refresh } = useAuth();
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/account";

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "login"
            ? { action: "login", email, password }
            : { action: "register", name, email, phone, password }
        ),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "خطا رخ داد");
        return;
      }
      await refresh();
      if (data.user?.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push(next);
      }
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-tasino-muted px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-card sm:p-8">
        <div className="mb-6 text-center">
          <Link href="/">
            <Image
              src="/brand/logo.png"
              alt="Tasino"
              width={140}
              height={48}
              className="mx-auto h-12 w-auto object-contain"
            />
          </Link>
          <h1 className="mt-4 text-xl font-bold text-tasino-text">
            {mode === "login" ? "ورود به حساب" : "ثبت‌نام"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            خرید آسان تجهیزات تأسیسات ساختمان
          </p>
        </div>

        <div className="mb-5 grid grid-cols-2 rounded-xl bg-tasino-muted p-1">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`rounded-lg py-2 text-sm font-bold transition ${
              mode === "login"
                ? "bg-white text-tasino-blue shadow-sm"
                : "text-slate-500"
            }`}
          >
            ورود
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`rounded-lg py-2 text-sm font-bold transition ${
              mode === "register"
                ? "bg-white text-tasino-blue shadow-sm"
                : "text-slate-500"
            }`}
          >
            ثبت‌نام
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {mode === "register" ? (
            <>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="نام و نام خانوادگی"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-tasino-blue"
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="شماره موبایل"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-tasino-blue"
              />
            </>
          ) : null}
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ایمیل"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-tasino-blue"
            dir="ltr"
          />
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="رمز عبور"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-tasino-blue"
            dir="ltr"
          />

          {error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-tasino-blue py-3 text-sm font-bold text-white transition hover:bg-tasino-blue-dark disabled:opacity-60"
          >
            {loading ? "لطفاً صبر کنید..." : mode === "login" ? "ورود" : "ثبت‌نام"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-400">
          ادمین: admin@tasino.ir / Admin@12345
        </p>
      </div>
    </div>
  );
}
