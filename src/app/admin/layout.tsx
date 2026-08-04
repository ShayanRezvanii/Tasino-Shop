"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import {
  FolderTree,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingBag,
  Users,
  Zap,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const links = [
  { href: "/admin", label: "داشبورد", icon: LayoutDashboard },
  { href: "/admin/categories", label: "دسته‌بندی‌ها", icon: FolderTree },
  { href: "/admin/products", label: "محصولات", icon: Package },
  { href: "/admin/banners", label: "بنرها", icon: ImageIcon },
  { href: "/admin/flash-sales", label: "فروش ویژه", icon: Zap },
  { href: "/admin/orders", label: "سفارش‌ها", icon: ShoppingBag },
  { href: "/admin/users", label: "کاربران", icon: Users },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) router.replace("/auth?next=/admin");
      else if (user.role !== "ADMIN") router.replace("/account");
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== "ADMIN") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        در حال بارگذاری پنل مدیریت...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <aside className="w-full border-b border-slate-200 bg-tasino-blue-deep text-white lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:border-b-0 lg:border-l">
        <div className="flex items-center justify-between px-5 py-5 lg:block">
          <div>
            <Link href="/" className="text-lg font-black text-tasino-yellow">
              تاسینو
            </Link>
            <p className="mt-0.5 text-xs text-white/60">پنل مدیریت سایت</p>
          </div>
          <button
            type="button"
            onClick={async () => {
              await logout();
              router.push("/");
            }}
            className="rounded-lg p-2 hover:bg-white/10 lg:mt-4 lg:flex lg:w-full lg:items-center lg:gap-2 lg:px-3"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden text-sm lg:inline">خروج</span>
          </button>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible">
          {links.map((l) => {
            const Icon = l.icon;
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition ${
                  active
                    ? "bg-tasino-yellow font-bold text-tasino-blue-deep"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                <Icon className="h-4 w-4" />
                {l.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
