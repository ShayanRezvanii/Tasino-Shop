"use client";

import { FormEvent, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon: string;
  parentId?: string | null;
  sortOrder: number;
  isActive: boolean;
  children?: Category[];
  _count?: { products: number };
  parent?: { name: string } | null;
};

const ICONS = ["Pump", "Faucet", "Zap", "Thermometer", "Flame", "Wrench", "Pipe", "Paint"];

export default function AdminCategories() {
  const [tree, setTree] = useState<Category[]>([]);
  const [flat, setFlat] = useState<Category[]>([]);
  const [form, setForm] = useState({
    id: "",
    name: "",
    description: "",
    icon: "Wrench",
    parentId: "",
    sortOrder: "0",
    isActive: true,
  });
  const [msg, setMsg] = useState("");

  const load = () => {
    Promise.all([
      fetch("/api/categories?tree=1&all=1").then((r) => r.json()),
      fetch("/api/categories?all=1").then((r) => r.json()),
    ]).then(([t, f]) => {
      setTree(t.categories || []);
      setFlat(f.categories || []);
    });
  };

  useEffect(() => {
    load();
  }, []);

  const reset = () =>
    setForm({
      id: "",
      name: "",
      description: "",
      icon: "Wrench",
      parentId: "",
      sortOrder: "0",
      isActive: true,
    });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMsg("");
    const payload = {
      ...(form.id ? { id: form.id } : {}),
      name: form.name,
      description: form.description,
      icon: form.icon,
      parentId: form.parentId || null,
      sortOrder: Number(form.sortOrder) || 0,
      isActive: form.isActive,
    };
    const res = await fetch("/api/categories", {
      method: form.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.error || "خطا");
      return;
    }
    setMsg(form.id ? "دسته‌بندی به‌روز شد" : "دسته‌بندی اضافه شد");
    reset();
    load();
  };

  const edit = (c: Category) => {
    setForm({
      id: c.id,
      name: c.name,
      description: c.description || "",
      icon: c.icon,
      parentId: c.parentId || "",
      sortOrder: String(c.sortOrder),
      isActive: c.isActive,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id: string) => {
    if (!confirm("حذف این دسته‌بندی؟ زیردسته‌ها هم حذف می‌شوند.")) return;
    await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">مدیریت دسته‌بندی‌ها</h1>
        <p className="mt-1 text-sm text-slate-500">
          دسته‌بندی‌ها کاملاً داینامیک هستند — هر زمان می‌توانید دسته و زیردسته اضافه کنید
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="grid gap-3 rounded-2xl bg-white p-5 shadow-card sm:grid-cols-2"
      >
        <h2 className="sm:col-span-2 font-bold">
          {form.id ? "ویرایش دسته‌بندی" : "افزودن دسته‌بندی جدید"}
        </h2>
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="نام دسته‌بندی"
          className="rounded-xl border px-4 py-3 text-sm"
        />
        <select
          value={form.parentId}
          onChange={(e) => setForm({ ...form, parentId: e.target.value })}
          className="rounded-xl border px-4 py-3 text-sm"
        >
          <option value="">دسته اصلی (بدون والد)</option>
          {flat
            .filter((c) => !c.parentId && c.id !== form.id)
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
        </select>
        <input
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="توضیح کوتاه"
          className="rounded-xl border px-4 py-3 text-sm sm:col-span-2"
        />
        <select
          value={form.icon}
          onChange={(e) => setForm({ ...form, icon: e.target.value })}
          className="rounded-xl border px-4 py-3 text-sm"
        >
          {ICONS.map((i) => (
            <option key={i} value={i}>
              آیکون: {i}
            </option>
          ))}
        </select>
        <input
          value={form.sortOrder}
          onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
          placeholder="ترتیب نمایش"
          className="rounded-xl border px-4 py-3 text-sm"
        />
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          />
          فعال در سایت
        </label>
        <div className="flex gap-2 sm:col-span-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-tasino-blue px-5 py-2.5 text-sm font-bold text-white"
          >
            <Plus className="h-4 w-4" />
            {form.id ? "ذخیره تغییرات" : "افزودن"}
          </button>
          {form.id ? (
            <button
              type="button"
              onClick={reset}
              className="rounded-xl border px-4 py-2.5 text-sm"
            >
              انصراف
            </button>
          ) : null}
        </div>
        {msg ? <p className="text-sm text-emerald-600 sm:col-span-2">{msg}</p> : null}
      </form>

      <div className="space-y-3">
        {tree.map((cat) => (
          <div key={cat.id} className="rounded-2xl bg-white p-4 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold">
                  {cat.name}{" "}
                  {!cat.isActive ? (
                    <span className="text-xs text-red-500">(غیرفعال)</span>
                  ) : null}
                </p>
                <p className="text-xs text-slate-400">
                  {cat.description} — {cat._count?.products ?? 0} محصول
                </p>
              </div>
              <div className="flex gap-1">
                <button type="button" onClick={() => edit(cat)} className="rounded-lg p-2 hover:bg-slate-100">
                  <Pencil className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => remove(cat.id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            {cat.children?.length ? (
              <div className="mt-3 space-y-1 border-r-2 border-tasino-muted pr-3">
                {cat.children.map((child) => (
                  <div
                    key={child.id}
                    className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-tasino-muted"
                  >
                    <span className="text-sm">
                      {child.name}
                      <span className="mr-2 text-xs text-slate-400">
                        ({child._count?.products ?? 0})
                      </span>
                    </span>
                    <div className="flex gap-1">
                      <button type="button" onClick={() => edit(child)} className="p-1">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(child.id)}
                        className="p-1 text-red-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
