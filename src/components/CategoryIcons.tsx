"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCategoryIcon } from "@/lib/category-icons";

type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon: string;
};

export default function CategoryIcons() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/categories?tree=1")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []))
      .catch(() => {});
  }, []);

  return (
    <section id="categories" className="container-tasino py-8">
      <div className="mb-6 text-center sm:text-right">
        <h2 className="text-xl font-bold text-tasino-text sm:text-2xl">
          خرید بر اساس دسته‌بندی
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          کارشناسی سریع و رایگان — خانگی و صنعتی
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5">
        {categories.map((cat) => {
          const Icon = getCategoryIcon(cat.icon);
          return (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:border-tasino-blue/30 hover:shadow-card-hover"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-tasino-muted text-tasino-blue transition group-hover:bg-tasino-blue group-hover:text-white">
                <Icon className="h-7 w-7" strokeWidth={1.6} />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-tasino-text">{cat.name}</p>
                <p className="mt-0.5 line-clamp-1 text-[11px] text-slate-400">
                  {cat.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
