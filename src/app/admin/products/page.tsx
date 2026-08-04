"use client";

import Image from "next/image";
import { FormEvent, useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, Pencil, Trash2 } from "lucide-react";
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
  image: "",
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

/** Resize/compress image in browser before upload to avoid size/errors */
async function prepareImageFile(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) {
    throw new Error("فایل انتخاب‌شده تصویر نیست");
  }

  const bitmap = await createImageBitmap(file);
  const maxSide = 1200;
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("خطا در پردازش تصویر");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("فشرده‌سازی تصویر ناموفق بود"))),
      "image/jpeg",
      0.82
    );
  });

  return new File([blob], file.name.replace(/\.\w+$/, ".jpg"), {
    type: "image/jpeg",
  });
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState(empty);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

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

  const onUpload = async (file: File) => {
    setErr("");
    setMsg("");
    setUploading(true);
    try {
      const prepared = await prepareImageFile(file);
      const body = new FormData();
      body.append("file", prepared);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) {
        setErr(data.error || data.detail || "آپلود ناموفق بود");
        return;
      }
      setForm((f) => ({ ...f, image: data.url }));
      setMsg("تصویر با موفقیت آپلود شد");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "خطا در آپلود تصویر");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMsg("");
    setErr("");
    if (!form.image) {
      setErr("لطفاً تصویر محصول را آپلود کنید");
      return;
    }
    if (!form.categoryId) {
      setErr("دسته‌بندی را انتخاب کنید");
      return;
    }
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
      setErr(data.error || data.detail || "خطا در ذخیره محصول");
      return;
    }
    setMsg("محصول ذخیره شد");
    setForm(empty);
    load();
  };

  const edit = (p: Product) => {
    setErr("");
    setMsg("");
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
    window.scrollTo({ top: 0, behavior: "smooth" });
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

        <div className="sm:col-span-2">
          <p className="mb-2 text-sm font-medium text-slate-600">تصویر محصول</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <div className="relative flex h-36 w-36 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-tasino-muted">
              {form.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.image}
                  alt="پیش‌نمایش"
                  className="h-full w-full object-contain p-2"
                />
              ) : (
                <ImagePlus className="h-8 w-8 text-slate-400" />
              )}
            </div>
            <div className="flex-1 space-y-2">
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-tasino-blue file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-tasino-blue-dark"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onUpload(file);
                }}
              />
              <p className="text-xs text-slate-400">
                JPG / PNG / WEBP — حداکثر ۲٫۵ مگابایت (قبل از ارسال خودکار فشرده می‌شود)
              </p>
              {uploading ? (
                <p className="inline-flex items-center gap-2 text-sm text-tasino-blue">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  در حال آپلود...
                </p>
              ) : null}
              {form.image ? (
                <button
                  type="button"
                  onClick={() => setForm({ ...form, image: "" })}
                  className="text-xs text-red-500 hover:underline"
                >
                  حذف تصویر
                </button>
              ) : null}
            </div>
          </div>
        </div>

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
          value={form.badge}
          onChange={(e) => setForm({ ...form, badge: e.target.value })}
          placeholder="برچسب (مثل پرفروش)"
          className="rounded-xl border px-4 py-3 text-sm"
        />
        <input
          value={form.specs}
          onChange={(e) => setForm({ ...form, specs: e.target.value })}
          placeholder="مشخصات"
          className="rounded-xl border px-4 py-3 text-sm sm:col-span-2"
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
            disabled={uploading}
            className="rounded-xl bg-tasino-blue px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60"
          >
            ذخیره
          </button>
          {form.id ? (
            <button
              type="button"
              onClick={() => {
                setForm(empty);
                setErr("");
                setMsg("");
              }}
              className="rounded-xl border px-4 py-2.5 text-sm"
            >
              انصراف
            </button>
          ) : null}
        </div>
        {msg ? (
          <p className="text-sm text-emerald-600 sm:col-span-2">{msg}</p>
        ) : null}
        {err ? <p className="text-sm text-red-600 sm:col-span-2">{err}</p> : null}
      </form>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-card">
        <table className="w-full min-w-[700px] text-sm">
          <thead>
            <tr className="border-b bg-slate-50 text-slate-500">
              <th className="p-3 text-right">تصویر</th>
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
                <td className="p-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-tasino-muted">
                    {p.image?.startsWith("data:") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.image}
                        alt=""
                        className="h-full w-full object-contain p-1"
                      />
                    ) : (
                      <Image
                        src={p.image || "/products/valve.svg"}
                        alt=""
                        fill
                        className="object-contain p-1"
                      />
                    )}
                  </div>
                </td>
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
                    <button
                      type="button"
                      onClick={() => edit(p)}
                      className="rounded-lg p-1.5 hover:bg-slate-100"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(p.id)}
                      className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"
                    >
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
