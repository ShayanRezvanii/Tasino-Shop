"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Countdown from "@/components/Countdown";
import { formatPrice } from "@/lib/utils";

type FlashProduct = {
  id: string;
  title: string;
  slug: string;
  image: string;
  price: number;
  oldPrice?: number | null;
  discount?: number;
  categoryName?: string;
  flashEndsAt?: string | null;
};

type Banner = {
  title: string;
  subtitle?: string | null;
  image?: string | null;
  link?: string | null;
};

export default function FlashSaleBanner() {
  const [product, setProduct] = useState<FlashProduct | null>(null);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [hours, setHours] = useState(6);

  useEffect(() => {
    Promise.all([
      fetch("/api/products?flash=1&limit=1").then((r) => r.json()),
      fetch("/api/banners?type=FLASH").then((r) => r.json()),
    ]).then(([pRes, bRes]) => {
      const p = pRes.products?.[0] || null;
      setProduct(p);
      setBanner(bRes.banners?.[0] || null);
      if (p?.flashEndsAt) {
        const diff = new Date(p.flashEndsAt).getTime() - Date.now();
        setHours(Math.max(1, Math.floor(diff / 3600000)));
      }
    });
  }, []);

  if (!product && !banner) return null;

  const discount =
    product?.discount ||
    (product?.oldPrice
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0);

  return (
    <section className="container-tasino pb-6">
      <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-card sm:flex-row">
        <div className="flex flex-col items-center justify-center gap-3 bg-tasino-blue px-6 py-6 text-white sm:min-w-[200px]">
          <h3 className="text-lg font-bold">{banner?.title || "فروش ویژه امروز"}</h3>
          <Countdown variant="red" size="sm" hours={hours} minutes={22} seconds={41} />
        </div>

        <Link
          href={banner?.link || (product ? `/products/${product.slug}` : "/products")}
          className="relative flex flex-1 items-center gap-4 px-4 py-5 sm:px-8"
        >
          <div className="relative h-24 w-28 shrink-0 sm:h-28 sm:w-36">
            <Image
              src={banner?.image || product?.image || "/products/cooler-pump.png"}
              alt={product?.title || "فروش ویژه"}
              fill
              className="object-contain"
              sizes="144px"
            />
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-500">
              {product?.categoryName || "فروش ویژه"}
            </p>
            <h3 className="mt-1 text-base font-bold text-tasino-text sm:text-lg">
              {banner?.subtitle || product?.title}
            </h3>
            {product ? (
              <p className="mt-1 text-sm font-bold text-tasino-blue">
                {formatPrice(product.price)} تومان
                {product.oldPrice ? (
                  <span className="mr-2 text-xs font-normal text-slate-400 line-through">
                    {formatPrice(product.oldPrice)}
                  </span>
                ) : null}
              </p>
            ) : null}
          </div>
          {discount ? (
            <div className="absolute left-4 top-4 flex h-14 w-14 animate-pulse-soft items-center justify-center rounded-full bg-tasino-yellow text-sm font-black text-tasino-blue-deep shadow-md sm:static sm:h-16 sm:w-16 sm:shrink-0">
              {discount.toLocaleString("fa-IR")}٪
            </div>
          ) : null}
        </Link>
      </div>
    </section>
  );
}
