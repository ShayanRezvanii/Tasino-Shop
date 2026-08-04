"use client";

import { FormEvent, useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";

type Category = { id: string; name: string; parentId?: string | null };
type Product = {
  id: string;
  title: string;
  slug: string;
  image: string;
  price: number;
  oldPrice?: number | null;
  stock: number;
  specs?: string | null;
  badge?: string | null;
  isActive: boolean;
  isFeatured: boolean;
  isFlashSale: boolean;
  categoryId: string;
  categoryName?: string;
};

const empty = {
  id: "",
  title: "",
  image: "/products/valve.svg",
  price: "",
  oldPrice: "",
  stock: "10",
  specs: "",
  badge: "",
  categoryId: "",
  isActive: true,
  isFeatured: false,
  isFlashSale: false,
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState(empty);
  const [msg, setMsg] = useState("");

  const load = () => {
    Promise.all([
      fetch("/api/products?all=1").then((r) => r.json()),
      fetch("/api/categories?all=1").then((r) => r.json()),
    ]).then(([p, c]) => {
      setProducts(p.products || []);
      setCategories(c.categories || []);
    });
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMsg("");
    const payload = {
      ...(form.id ? { id: form.id } : {}),
      title: form.title,
      image: form.image,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      stock: Number(form.stock),
      specs: form.specs,
      badge: form.badge,
      categoryId: form.categoryId,
      isActive: form.isActive,
      isFeatured: form.isFeatured,
      isFlashSale: form.isFlashSale,
      flashEndsAt: form.isFlashSale
        ? new Date(Date.now() + 6 * 3600000).toISOString()
        : null,
    };
    const res = await fetch("/api/products", {
      method: form.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.error || "خطا");
      return;
    }
    setMsg("ذخیره شد");
    setForm(empty);
    load();
  };

  const edit = (p: Product) => {
    setForm({
      id: p.id,
      title: p.title,
      image: p.image,
      price: String(p.price),
      oldPrice: p.oldPrice ? String(p.oldPrice) : "",
      stock: String(p.stock),
      specs: p.specs || "",
      badge: p.badge || "",
      categoryId: p.categoryId,
      isActive: p.isActive,
      isFeatured: p.isFeatured,
      isFlashSale: p.isFlashSale,
    });
  };

  const remove = async (id: string) => {
    if (!confirm("حذف محصول؟")) return;
    await fetch(`/api/products?id=${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black">مدیریت محصولات</h1>

      <form
        onSubmit={onSubmit}
        className="grid gap-3 rounded-2xl bg-white p-5 shadow-card sm:grid-cols-2"
      >
        <h2 className="font-bold sm:col-span-2">
          {form.id ? "ویرایش محصول" : "افزودن محصول"}
        </h2>
        <input
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="عنوان"
          className="rounded-xl border px-4 py-3 text-sm sm:col-span-2"
        />
        <select
          required
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          className="rounded-xl border px-4 py-3 text-sm sm:col-span-2"
        >
          <option value="">انتخاب دسته‌بندی</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.parentId ? "— " : ""}
              {c.name}
            </option>
          ))}
        </select>
        <input
          required
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          placeholder="قیمت (تومان)"
          className="rounded-xl border px-4 py-3 text-sm"
        />
        <input
          value={form.oldPrice}
          onChange={(e) => setForm({ ...form, oldPrice: e.target.value })}
          placeholder="قیمت قبل (اختیاری)"
          className="rounded-xl border px-4 py-3 text-sm"
        />
        <input
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          placeholder="موجودی"
          className="rounded-xl border px-4 py-3 text-sm"
        />
        <input
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          placeholder="مسیر تصویر"
          className="rounded-xl border px-4 py-3 text-sm"
        />
        <input
          value={form.specs}
          onChange={(e) => setForm({ ...form, specs: e.target.value })}
          placeholder="مشخصات"
          className="rounded-xl border px-4 py-3 text-sm"
        />
        <input
          value={form.badge}
          onChange={(e) => setForm({ ...form, badge: e.target.value })}
          placeholder="برچسب (مثل پرفروش)"
          className="rounded-xl border px-4 py-3 text-sm"
        />
        <div className="flex flex-wrap gap-4 text-sm sm:col-span-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />
            فعال
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
            />
            محصول ویژه
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isFlashSale}
              onChange={(e) => setForm({ ...form, isFlashSale: e.target.checked })}
            />
            فروش ویژه
          </label>
        </div>
        <div className="flex gap-2 sm:col-span-2">
          <button
            type="submit"
            className="rounded-xl bg-tasino-blue px-5 py-2.5 text-sm font-bold text-white"
          >
            ذخیره
          </button>
          {form.id ? (
            <button
              type="button"
              onClick={() => setForm(empty)}
              className="rounded-xl border px-4 py-2.5 text-sm"
            >
              انصراف
            </button>
          ) : null}
        </div>
        {msg ? <p className="text-sm text-emerald-600 sm:col-span-2">{msg}</p> : null}
      </form>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-card">
        <table className="w-full min-w-[700px] text-sm">
          <thead>
            <tr className="border-b bg-slate-50 text-slate-500">
              <th className="p-3 text-right">عنوان</th>
              <th className="p-3 text-right">دسته</th>
              <th className="p-3 text-right">قیمت</th>
              <th className="p-3 text-right">موجودی</th>
              <th className="p-3 text-right">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-slate-50">
                <td className="p-3 font-medium">
                  {p.title}
                  {p.isFlashSale ? (
                    <span className="mr-2 text-[10px] text-amber-600">ویژه</span>
                  ) : null}
                </td>
                <td className="p-3">{p.categoryName}</td>
                <td className="p-3">{formatPrice(p.price)}</td>
                <td className="p-3">{p.stock.toLocaleString("fa-IR")}</td>
                <td className="p-3">
                  <div className="flex gap-1">
                    <button type="button" onClick={() => edit(p)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => remove(p.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
