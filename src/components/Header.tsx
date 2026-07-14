"use client";

import Image from "next/image";
import {
  ChevronDown,
  Menu,
  Phone,
  Search,
  ShoppingCart,
  Truck,
  User,
} from "lucide-react";
import { useState } from "react";

const navLinks = [
  { href: "#", label: "صفحه اصلی" },
  { href: "#categories", label: "دسته‌بندی" },
  { href: "#products", label: "محصولات" },
  { href: "#guides", label: "راهنمای خرید" },
  { href: "#about", label: "درباره ما" },
  { href: "#contact", label: "تماس با ما" },
];

export default function Header() {
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-tasino-muted/80">
        <div className="container-tasino flex items-center justify-between gap-3 py-2 text-xs text-slate-600 sm:text-sm">
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg bg-tasino-blue px-3 py-1.5 font-medium text-white transition hover:bg-tasino-blue-dark"
          >
            <Truck className="h-3.5 w-3.5" />
            <span>پیگیری سفارش</span>
          </button>
          <a
            href="tel:02112345678"
            className="flex items-center gap-1.5 hover:text-tasino-blue"
          >
            <Phone className="h-3.5 w-3.5 text-tasino-yellow-dark" />
            <span dir="ltr">۰۲۱-۱۲۳۴ ۵۶۷۸</span>
            <span className="hidden sm:inline">| مشاوره فنی رایگان</span>
          </a>
        </div>
      </div>

      <div className="container-tasino flex flex-wrap items-center gap-3 py-3 lg:gap-6">
        <a href="/" className="flex shrink-0 items-center gap-2">
          <Image
            src="/brand/logo.png"
            alt="Tasino"
            width={160}
            height={56}
            className="h-12 w-auto object-contain sm:h-14"
            priority
          />
        </a>

        <div className="order-3 flex w-full flex-1 lg:order-none lg:max-w-xl">
          <div className="relative flex w-full items-center overflow-hidden rounded-xl border border-slate-200 bg-tasino-muted transition focus-within:border-tasino-blue focus-within:ring-2 focus-within:ring-tasino-blue/20">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجوی لوله، شیرآلات، پمپ، ابزار..."
              className="w-full bg-transparent px-4 py-3 text-sm outline-none placeholder:text-slate-400"
            />
            <button
              type="button"
              className="m-1 flex h-10 w-10 items-center justify-center rounded-lg bg-tasino-blue text-white transition hover:bg-tasino-blue-dark"
              aria-label="جستجو"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mr-auto flex items-center gap-2">
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-tasino-blue transition hover:bg-tasino-muted"
            aria-label="سبد خرید"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -left-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-tasino-yellow text-[10px] font-bold text-tasino-blue-deep">
              ۳
            </span>
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl bg-tasino-yellow px-4 py-2.5 text-sm font-bold text-tasino-blue-deep transition hover:bg-tasino-yellow-dark"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">ورود / ثبت نام</span>
          </button>
          <button
            type="button"
            className="rounded-lg p-2 text-tasino-blue lg:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="منو"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      <nav className="bg-tasino-blue-deep">
        <div className="container-tasino relative flex items-center justify-between gap-4">
          <button
            type="button"
            className="flex items-center gap-2 py-3.5 text-sm font-medium text-white transition hover:text-tasino-yellow"
          >
            <Menu className="h-4 w-4" />
            <span>دسته‌بندی کالاها</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>

          <ul
            className={`${
              menuOpen ? "flex" : "hidden"
            } absolute left-0 right-0 top-full z-40 flex-col gap-1 bg-tasino-blue-deep p-4 shadow-lg lg:static lg:flex lg:flex-row lg:items-center lg:gap-6 lg:bg-transparent lg:p-0 lg:shadow-none`}
          >
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="block rounded-lg px-3 py-2 text-sm text-white/90 transition hover:bg-white/10 hover:text-white lg:px-0 lg:py-3.5 lg:hover:bg-transparent lg:hover:text-tasino-yellow"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <span className="hidden text-xs text-white/70 xl:inline">
            تجهیزات تأسیسات ساختمان
          </span>
        </div>
      </nav>
    </header>
  );
}
