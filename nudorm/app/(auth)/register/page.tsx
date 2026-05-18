"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

const inputClass = "w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors bg-white";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get("role") === "OWNER" ? "OWNER" : "STUDENT";

  const [form, setForm] = useState({ name: "", email: "", password: "", role: defaultRole });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "เกิดข้อผิดพลาด");
      setLoading(false);
      return;
    }

    await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    window.location.href = "/";
  }

  return (
    <div className="max-w-md mx-auto mt-16">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">สมัครสมาชิก</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">ชื่อ-นามสกุล</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
              placeholder="สมชาย ใจดี"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">อีเมล</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClass}
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">รหัสผ่าน</label>
            <input
              type="password"
              required
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={inputClass}
              placeholder="อย่างน้อย 8 ตัวอักษร"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">ฉันคือ</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "STUDENT", label: "นักศึกษา / ผู้หาหอ" },
                { value: "OWNER", label: "เจ้าของหอพัก" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm({ ...form, role: opt.value })}
                  className={`py-3 rounded-xl border-2 text-base font-medium transition-colors ${
                    form.role === opt.value
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-600 hover:border-blue-400"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 text-white py-3 rounded-xl text-base font-semibold hover:bg-blue-800 transition-colors disabled:opacity-50"
          >
            {loading ? "กำลังสมัคร..." : "สมัครสมาชิก"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          มีบัญชีแล้ว?{" "}
          <Link href="/login" className="text-blue-700 font-semibold">
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto mt-16 h-96 bg-white rounded-2xl border border-gray-100 animate-pulse" />}>
      <RegisterForm />
    </Suspense>
  );
}
