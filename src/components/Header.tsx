"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Phone,
  Search,
  ShoppingCart,
  Truck,
  User,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";

const navLinks = [
  { href: "/", label: "صفحه اصلی" },
  { href: "/#categories", label: "دسته‌بندی" },
  { href: "/products", label: "محصولات" },
  { href: "/#guides", label: "راهنمای خرید" },
  { href: "/#about", label: "درباره ما" },
  { href: "/#contact", label: "تماس با ما" },
];

type CatNode = {
  id: string;
  name: string;
  slug: string;
  children?: { id: string; name: string; slug: string }[];
};

export default function Header() {
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [categories, setCategories] = useState<CatNode[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, loading } = useAuth();
  const { count } = useCart();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/categories?tree=1")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
    setMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white ${
        scrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="border-b border-slate-100 bg-tasino-muted/80">
        <div className="container-tasino flex items-center justify-between gap-3 py-2 text-xs text-slate-600 sm:text-sm">
          <Link
            href={user ? "/account/orders" : "/auth"}
            className="flex items-center gap-1.5 rounded-lg bg-tasino-blue px-3 py-1.5 font-medium text-white transition hover:bg-tasino-blue-dark"
          >
            <Truck className="h-3.5 w-3.5" />
            <span>پیگیری سفارش</span>
          </Link>
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
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image
            src="/brand/logo.png"
            alt="Tasino"
            width={160}
            height={56}
            className="h-12 w-auto object-contain sm:h-14"
            priority
          />
        </Link>

        <form
          onSubmit={onSearch}
          className="order-3 flex w-full flex-1 lg:order-none lg:max-w-xl"
        >
          <div className="relative flex w-full items-center overflow-hidden rounded-xl border border-slate-200 bg-tasino-muted transition focus-within:border-tasino-blue focus-within:ring-2 focus-within:ring-tasino-blue/20">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجوی لوله، شیرآلات، پمپ، ابزار..."
              className="w-full bg-transparent px-4 py-3 text-sm outline-none placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="m-1 flex h-10 w-10 items-center justify-center rounded-lg bg-tasino-blue text-white transition hover:bg-tasino-blue-dark"
              aria-label="جستجو"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </form>

        <div className="mr-auto flex items-center gap-2">
          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-tasino-blue transition hover:bg-tasino-muted"
            aria-label="سبد خرید"
          >
            <ShoppingCart className="h-5 w-5" />
            {count > 0 ? (
              <span className="absolute -left-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-tasino-yellow text-[10px] font-bold text-tasino-blue-deep">
                {count.toLocaleString("fa-IR")}
              </span>
            ) : null}
          </Link>

          {!loading && user ? (
            <div className="flex items-center gap-1">
              {user.role === "ADMIN" ? (
                <Link
                  href="/admin"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-tasino-blue transition hover:bg-tasino-muted"
                  title="پنل مدیریت"
                >
                  <LayoutDashboard className="h-5 w-5" />
                </Link>
              ) : null}
              <Link
                href="/account"
                className="flex items-center gap-2 rounded-xl bg-tasino-yellow px-3 py-2.5 text-sm font-bold text-tasino-blue-deep transition hover:bg-tasino-yellow-dark sm:px-4"
              >
                <User className="h-4 w-4" />
                <span className="hidden max-w-[100px] truncate sm:inline">
                  {user.name}
                </span>
              </Link>
              <button
                type="button"
                onClick={() => logout()}
                className="hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-red-50 hover:text-red-600 sm:flex"
                title="خروج"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="flex items-center gap-2 rounded-xl bg-tasino-yellow px-4 py-2.5 text-sm font-bold text-tasino-blue-deep transition hover:bg-tasino-yellow-dark"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">ورود / ثبت نام</span>
            </Link>
          )}

          <button
            type="button"
            className="rounded-lg p-2 text-tasino-blue lg:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="منو"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <nav className="bg-tasino-blue-deep">
        <div className="container-tasino relative flex items-center justify-between gap-4">
          <div className="relative">
            <button
              type="button"
              onClick={() => setCatOpen((o) => !o)}
              className="flex items-center gap-2 py-3.5 text-sm font-medium text-white transition hover:text-tasino-yellow"
            >
              <Menu className="h-4 w-4" />
              <span>دسته‌بندی کالاها</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {catOpen ? (
              <div className="absolute right-0 top-full z-50 mt-0 max-h-[70vh] w-72 overflow-y-auto rounded-b-xl bg-white p-3 shadow-xl sm:w-80">
                {categories.map((cat) => (
                  <div key={cat.id} className="mb-2">
                    <Link
                      href={`/products?category=${cat.slug}`}
                      onClick={() => setCatOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm font-bold text-tasino-blue-deep hover:bg-tasino-muted"
                    >
                      {cat.name}
                    </Link>
                    {cat.children?.length ? (
                      <div className="mr-3 border-r border-slate-100 pr-2">
                        {cat.children.map((child) => (
                          <Link
                            key={child.id}
                            href={`/products?category=${child.slug}`}
                            onClick={() => setCatOpen(false)}
                            className="block rounded-lg px-3 py-1.5 text-xs text-slate-600 hover:bg-tasino-muted hover:text-tasino-blue"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <ul
            className={`${
              menuOpen ? "flex" : "hidden"
            } absolute left-0 right-0 top-full z-40 max-h-[70vh] flex-col gap-1 overflow-y-auto bg-tasino-blue-deep p-4 shadow-lg lg:static lg:flex lg:max-h-none lg:flex-row lg:items-center lg:gap-6 lg:overflow-visible lg:bg-transparent lg:p-0 lg:shadow-none`}
          >
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm text-white/90 transition hover:bg-white/10 hover:text-white lg:px-0 lg:py-3.5 lg:hover:bg-transparent lg:hover:text-tasino-yellow"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {user ? (
              <li className="lg:hidden">
                <Link
                  href="/account"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm text-tasino-yellow"
                >
                  پنل کاربری
                </Link>
              </li>
            ) : null}
          </ul>

          <span className="hidden text-xs text-white/70 xl:inline">
            تجهیزات تأسیسات ساختمان
          </span>
        </div>
      </nav>
    </header>
  );
}

/** Kept for pages that still import it — sticky header needs no spacer */
export function HeaderSpacer() {
  return null;
}
