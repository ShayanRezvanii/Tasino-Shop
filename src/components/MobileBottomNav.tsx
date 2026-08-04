"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Grid3X3,
  Home,
  Package,
  ShoppingCart,
  User,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";

const tabs = [
  { href: "/", label: "خانه", icon: Home, match: (p: string) => p === "/" },
  {
    href: "/#categories",
    label: "دسته‌ها",
    icon: Grid3X3,
    match: (p: string) => p.startsWith("/products") && !p.includes("/products/"),
  },
  {
    href: "/cart",
    label: "سبد",
    icon: ShoppingCart,
    match: (p: string) => p.startsWith("/cart") || p.startsWith("/checkout"),
    badge: true,
  },
  {
    href: "/account/orders",
    label: "سفارش‌ها",
    icon: Package,
    match: (p: string) => p.startsWith("/account/orders"),
    auth: true,
  },
  {
    href: "/account",
    label: "حساب",
    icon: User,
    match: (p: string) =>
      p.startsWith("/account") && !p.startsWith("/account/orders"),
    auth: true,
  },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { count } = useCart();

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/payment")
  ) {
    return null;
  }

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-md lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        aria-label="منوی موبایل"
      >
        <ul className="mx-auto flex max-w-lg items-stretch justify-between px-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const href =
              tab.auth && !user
                ? `/auth?next=${encodeURIComponent(tab.href)}`
                : tab.href === "/#categories"
                  ? "/products"
                  : tab.href;
            const active = tab.match(pathname);

            return (
              <li key={tab.label} className="flex-1">
                <Link
                  href={href}
                  className={`relative flex flex-col items-center gap-0.5 px-1 py-2 text-[10px] font-medium transition ${
                    active
                      ? "text-tasino-blue"
                      : "text-slate-500 hover:text-tasino-blue"
                  }`}
                >
                  <span className="relative">
                    <Icon
                      className={`h-5 w-5 ${active ? "stroke-[2.25]" : ""}`}
                    />
                    {tab.badge && count > 0 ? (
                      <span className="absolute -left-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-tasino-yellow px-1 text-[9px] font-bold text-tasino-blue-deep">
                        {count > 9 ? "۹+" : count.toLocaleString("fa-IR")}
                      </span>
                    ) : null}
                  </span>
                  <span>{tab.label}</span>
                  {active ? (
                    <span className="absolute inset-x-4 top-0 h-0.5 rounded-full bg-tasino-blue" />
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      {/* Spacer so page content isn't hidden behind the bar */}
      <div
        className="h-16 lg:hidden"
        style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
        aria-hidden
      />
    </>
  );
}
