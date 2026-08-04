"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import {
  KeyRound,
  LayoutDashboard,
  LogOut,
  Package,
  User,
} from "lucide-react";
import Header, { HeaderSpacer } from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/auth-context";

const links = [
  { href: "/account", label: "خلاصه", icon: LayoutDashboard },
  { href: "/account/orders", label: "سفارش‌ها", icon: Package },
  { href: "/account/profile", label: "پروفایل و رمز", icon: KeyRound },
];

export default function AccountLayout({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) router.replace("/auth?next=/account");
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-tasino-muted">
        در حال بارگذاری...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tasino-muted">
      <Header />
      <HeaderSpacer />
      <main className="container-tasino py-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-tasino-blue text-white">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{user.name}</h1>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          <aside className="h-fit rounded-2xl bg-white p-3 shadow-card">
            {links.map((l) => {
              const Icon = l.icon;
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`mb-1 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition ${
                    active
                      ? "bg-tasino-blue text-white"
                      : "text-slate-600 hover:bg-tasino-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {l.label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={async () => {
                await logout();
                router.push("/");
              }}
              className="mt-2 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              خروج
            </button>
          </aside>
          <div className="lg:col-span-3">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
