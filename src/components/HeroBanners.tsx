"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";

type Banner = {
  id: string;
  title: string;
  subtitle?: string | null;
  image?: string | null;
  link?: string | null;
  buttonText?: string | null;
  type: string;
};

type Featured = {
  id: string;
  title: string;
  slug: string;
  image: string;
  price: number;
  oldPrice?: number | null;
  specs?: string | null;
};

export default function HeroBanners() {
  const [hero, setHero] = useState<Banner | null>(null);
  const [side, setSide] = useState<Banner | null>(null);
  const [featured, setFeatured] = useState<Featured | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    Promise.all([
      fetch("/api/banners").then((r) => r.json()),
      fetch("/api/products?featured=1&limit=1").then((r) => r.json()),
    ]).then(([bannersRes, productsRes]) => {
      const banners: Banner[] = bannersRes.banners || [];
      setHero(banners.find((b) => b.type === "HERO") || null);
      setSide(banners.find((b) => b.type === "SIDE") || null);
      setFeatured(productsRes.products?.[0] || null);
    });
  }, []);

  return (
    <section className="container-tasino animate-fade-up py-6">
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="relative min-h-[300px] overflow-hidden rounded-2xl bg-tasino-blue-deep p-6 sm:p-8 lg:col-span-3 lg:min-h-[360px]">
          <div className="pointer-events-none absolute -left-10 top-0 h-64 w-64 rounded-full bg-tasino-blue/30 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-48 w-48 rounded-full bg-tasino-yellow/10 blur-2xl" />

          <div className="relative z-10 flex h-full flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-md">
              <span className="mb-3 inline-flex items-center gap-1.5 rounded-lg bg-tasino-yellow px-3 py-1 text-xs font-bold text-tasino-blue-deep">
                <ShieldCheck className="h-3.5 w-3.5" />
                کارشناسی سریع و رایگان
              </span>
              <h1 className="text-2xl font-black leading-relaxed text-white sm:text-3xl lg:text-4xl">
                {hero?.title || "تجهیزات تأسیسات ساختمان"}
              </h1>
              <p className="mt-3 text-sm leading-7 text-white/75 sm:text-base">
                {hero?.subtitle ||
                  "لوله و اتصالات، شیرآلات، پمپ، ابزارآلات و سیستم‌های سرمایش و گرمایش"}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={hero?.link || "/products"}
                  className="inline-flex items-center gap-2 rounded-xl bg-tasino-yellow px-5 py-3 text-sm font-bold text-tasino-blue-deep transition hover:bg-tasino-yellow-dark"
                >
                  {hero?.buttonText || "مشاهده محصولات"}
                  <ArrowLeft className="h-4 w-4" />
                </Link>
                <Link
                  href="/#categories"
                  className="inline-flex rounded-xl border border-white/30 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  دسته‌بندی‌ها
                </Link>
              </div>
            </div>

            <div className="relative mx-auto h-44 w-44 shrink-0 sm:h-52 sm:w-52">
              <Image
                src={hero?.image || "/brand/logo.png"}
                alt="Tasino"
                fill
                className="object-contain drop-shadow-2xl"
                sizes="208px"
                priority
              />
            </div>
          </div>
        </div>

        <div className="relative flex min-h-[300px] flex-col justify-between overflow-hidden rounded-2xl bg-white p-5 shadow-card lg:col-span-2 lg:min-h-[360px]">
          <div>
            <span className="rounded-lg bg-tasino-blue/10 px-2.5 py-1 text-xs font-bold text-tasino-blue">
              محصول ویژه
            </span>
            <h2 className="mt-3 text-lg font-bold text-tasino-text sm:text-xl">
              {side?.title || featured?.title || "محصول ویژه"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {side?.subtitle || featured?.specs}
            </p>
          </div>

          <div className="relative mx-auto my-4 h-40 w-full max-w-[220px]">
            <Image
              src={side?.image || featured?.image || "/products/water-pump.png"}
              alt={side?.title || featured?.title || "محصول"}
              fill
              className="object-contain"
              sizes="220px"
              priority
            />
          </div>

          <div className="flex items-end justify-between gap-3">
            <div>
              {featured?.oldPrice ? (
                <p className="text-xs text-slate-400 line-through">
                  {formatPrice(featured.oldPrice)} تومان
                </p>
              ) : null}
              {featured ? (
                <p className="text-xl font-black text-tasino-blue">
                  {formatPrice(featured.price)}
                  <span className="mr-1 text-xs font-normal text-slate-500">
                    تومان
                  </span>
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => {
                if (!featured) return;
                addItem({
                  productId: featured.id,
                  title: featured.title,
                  price: featured.price,
                  image: featured.image,
                });
              }}
              className="rounded-xl bg-tasino-blue px-4 py-2.5 text-sm font-bold text-white transition hover:bg-tasino-blue-dark"
            >
              {side?.buttonText || "خرید سریع"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
