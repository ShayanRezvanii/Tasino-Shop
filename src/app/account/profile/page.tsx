"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/lib/auth-context";

export default function ProfilePage() {
  const { user, refresh } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const saveProfile = async (e: FormEvent) => {
    e.preventDefault();
    setMsg("");
    setErr("");
    const res = await fetch("/api/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "updateProfile", name, phone }),
    });
    const data = await res.json();
    if (!res.ok) {
      setErr(data.error || "خطا");
      return;
    }
    await refresh();
    setMsg("پروفایل ذخیره شد");
  };

  const changePassword = async (e: FormEvent) => {
    e.preventDefault();
    setMsg("");
    setErr("");
    const res = await fetch("/api/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "changePassword",
        currentPassword,
        newPassword,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setErr(data.error || "خطا");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setMsg("رمز عبور تغییر کرد");
  };

  return (
    <div className="space-y-4">
      {msg ? (
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {msg}
        </div>
      ) : null}
      {err ? (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {err}
        </div>
      ) : null}

      <form
        onSubmit={saveProfile}
        className="space-y-3 rounded-2xl bg-white p-5 shadow-card"
      >
        <h2 className="font-bold">اطلاعات پروفایل</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border px-4 py-3 text-sm"
          placeholder="نام"
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-xl border px-4 py-3 text-sm"
          placeholder="موبایل"
        />
        <input
          value={user?.email || ""}
          disabled
          className="w-full rounded-xl border bg-slate-50 px-4 py-3 text-sm text-slate-400"
          dir="ltr"
        />
        <button
          type="submit"
          className="rounded-xl bg-tasino-blue px-5 py-2.5 text-sm font-bold text-white"
        >
          ذخیره
        </button>
      </form>

      <form
        onSubmit={changePassword}
        className="space-y-3 rounded-2xl bg-white p-5 shadow-card"
      >
        <h2 className="font-bold">تغییر رمز عبور</h2>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full rounded-xl border px-4 py-3 text-sm"
          placeholder="رمز فعلی"
          dir="ltr"
          required
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full rounded-xl border px-4 py-3 text-sm"
          placeholder="رمز جدید"
          dir="ltr"
          required
        />
        <button
          type="submit"
          className="rounded-xl bg-tasino-yellow px-5 py-2.5 text-sm font-bold text-tasino-blue-deep"
        >
          تغییر رمز
        </button>
      </form>
    </div>
  );
}
