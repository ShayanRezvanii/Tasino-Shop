"use client";

import { FormEvent, useEffect, useState } from "react";

type UserRow = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  createdAt: string;
  _count: { orders: number };
};

export default function AdminUsers() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [resetId, setResetId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [ownCurrent, setOwnCurrent] = useState("");
  const [ownNew, setOwnNew] = useState("");

  const load = () =>
    fetch("/api/users")
      .then((r) => r.json())
      .then((d) => setUsers(d.users || []));

  useEffect(() => {
    load();
  }, []);

  const resetPassword = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "adminResetPassword",
        userId: resetId,
        newPassword,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.error || "خطا");
      return;
    }
    setMsg("رمز کاربر تغییر کرد");
    setResetId("");
    setNewPassword("");
  };

  const changeOwn = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "changePassword",
        currentPassword: ownCurrent,
        newPassword: ownNew,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.error || "خطا");
      return;
    }
    setMsg("رمز ادمین تغییر کرد");
    setOwnCurrent("");
    setOwnNew("");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black">مدیریت کاربران و رمز عبور</h1>
      {msg ? (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {msg}
        </p>
      ) : null}

      <form
        onSubmit={changeOwn}
        className="grid gap-3 rounded-2xl bg-white p-5 shadow-card sm:grid-cols-2"
      >
        <h2 className="font-bold sm:col-span-2">تغییر رمز ادمین فعلی</h2>
        <input
          type="password"
          required
          value={ownCurrent}
          onChange={(e) => setOwnCurrent(e.target.value)}
          placeholder="رمز فعلی"
          className="rounded-xl border px-4 py-3 text-sm"
          dir="ltr"
        />
        <input
          type="password"
          required
          value={ownNew}
          onChange={(e) => setOwnNew(e.target.value)}
          placeholder="رمز جدید"
          className="rounded-xl border px-4 py-3 text-sm"
          dir="ltr"
        />
        <button
          type="submit"
          className="rounded-xl bg-tasino-blue px-5 py-2.5 text-sm font-bold text-white sm:col-span-2 sm:w-fit"
        >
          ذخیره رمز ادمین
        </button>
      </form>

      <form
        onSubmit={resetPassword}
        className="grid gap-3 rounded-2xl bg-white p-5 shadow-card sm:grid-cols-2"
      >
        <h2 className="font-bold sm:col-span-2">بازنشانی رمز کاربر</h2>
        <select
          required
          value={resetId}
          onChange={(e) => setResetId(e.target.value)}
          className="rounded-xl border px-4 py-3 text-sm"
        >
          <option value="">انتخاب کاربر</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>
        <input
          type="password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="رمز جدید"
          className="rounded-xl border px-4 py-3 text-sm"
          dir="ltr"
        />
        <button
          type="submit"
          className="rounded-xl bg-tasino-yellow px-5 py-2.5 text-sm font-bold text-tasino-blue-deep sm:col-span-2 sm:w-fit"
        >
          تنظیم رمز جدید
        </button>
      </form>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-card">
        <table className="w-full min-w-[600px] text-sm">
          <thead>
            <tr className="border-b bg-slate-50 text-slate-500">
              <th className="p-3 text-right">نام</th>
              <th className="p-3 text-right">ایمیل</th>
              <th className="p-3 text-right">نقش</th>
              <th className="p-3 text-right">سفارش‌ها</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-slate-50">
                <td className="p-3">{u.name}</td>
                <td className="p-3" dir="ltr">
                  {u.email}
                </td>
                <td className="p-3">
                  {u.role === "ADMIN" ? "مدیر" : "مشتری"}
                </td>
                <td className="p-3">
                  {u._count.orders.toLocaleString("fa-IR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
