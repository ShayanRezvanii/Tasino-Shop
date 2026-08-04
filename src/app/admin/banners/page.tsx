"use client";

import { FormEvent, useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

type Banner = {
  id: string;
  title: string;
  subtitle?: string | null;
  image?: string | null;
  link?: string | null;
  buttonText?: string | null;
  type: string;
  sortOrder: number;
  isActive: boolean;
};

const empty = {
  id: "",
  title: "",
  subtitle: "",
  image: "",
  link: "/products",
  buttonText: "مشاهده",
  type: "HERO",
  sortOrder: "0",
  isActive: true,
};

export default function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [form, setForm] = useState(empty);
  const [msg, setMsg] = useState("");

  const load = () =>
    fetch("/api/banners?all=1")
      .then((r) => r.json())
      .then((d) => setBanners(d.banners || []));

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      ...(form.id ? { id: form.id } : {}),
      title: form.title,
      subtitle: form.subtitle,
      image: form.image,
      link: form.link,
      buttonText: form.buttonText,
      type: form.type,
      sortOrder: Number(form.sortOrder),
      isActive: form.isActive,
    };
    const res = await fetch("/api/banners", {
      method: form.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const d = await res.json();
      setMsg(d.error || "خطا");
      return;
    }
    setMsg("ذخیره شد");
    setForm(empty);
    load();
  };

  const edit = (b: Banner) =>
    setForm({
      id: b.id,
      title: b.title,
      subtitle: b.subtitle || "",
      image: b.image || "",
      link: b.link || "",
      buttonText: b.buttonText || "",
      type: b.type,
      sortOrder: String(b.sortOrder),
      isActive: b.isActive,
    });

  const remove = async (id: string) => {
    if (!confirm("حذف بنر؟")) return;
    await fetch(`/api/banners?id=${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">مدیریت بنرها</h1>
        <p className="mt-1 text-sm text-slate-500">
          کنترل بنر اصلی، بنر کناری و بنر فروش ویژه از داشبورد
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="grid gap-3 rounded-2xl bg-white p-5 shadow-card sm:grid-cols-2"
      >
        <input
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="عنوان"
          className="rounded-xl border px-4 py-3 text-sm sm:col-span-2"
        />
        <input
          value={form.subtitle}
          onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
          placeholder="زیرعنوان"
          className="rounded-xl border px-4 py-3 text-sm sm:col-span-2"
        />
        <input
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          placeholder="آدرس تصویر"
          className="rounded-xl border px-4 py-3 text-sm"
        />
        <input
          value={form.link}
          onChange={(e) => setForm({ ...form, link: e.target.value })}
          placeholder="لینک"
          className="rounded-xl border px-4 py-3 text-sm"
        />
        <input
          value={form.buttonText}
          onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
          placeholder="متن دکمه"
          className="rounded-xl border px-4 py-3 text-sm"
        />
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="rounded-xl border px-4 py-3 text-sm"
        >
          <option value="HERO">بنر اصلی (HERO)</option>
          <option value="SIDE">بنر کناری (SIDE)</option>
          <option value="FLASH">بنر فروش ویژه (FLASH)</option>
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          />
          فعال
        </label>
        <div className="flex gap-2 sm:col-span-2">
          <button type="submit" className="rounded-xl bg-tasino-blue px-5 py-2.5 text-sm font-bold text-white">
            ذخیره
          </button>
          {form.id ? (
            <button type="button" onClick={() => setForm(empty)} className="rounded-xl border px-4 py-2.5 text-sm">
              انصراف
            </button>
          ) : null}
        </div>
        {msg ? <p className="text-sm text-emerald-600 sm:col-span-2">{msg}</p> : null}
      </form>

      <div className="space-y-3">
        {banners.map((b) => (
          <div key={b.id} className="flex items-start justify-between gap-3 rounded-2xl bg-white p-4 shadow-card">
            <div>
              <span className="rounded-md bg-tasino-muted px-2 py-0.5 text-[10px] font-bold text-tasino-blue">
                {b.type}
              </span>
              <p className="mt-1 font-bold">{b.title}</p>
              <p className="text-sm text-slate-500">{b.subtitle}</p>
              {!b.isActive ? (
                <span className="text-xs text-red-500">غیرفعال</span>
              ) : null}
            </div>
            <div className="flex gap-1">
              <button type="button" onClick={() => edit(b)} className="rounded-lg p-2 hover:bg-slate-100">
                <Pencil className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => remove(b.id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
