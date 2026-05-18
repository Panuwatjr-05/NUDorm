"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface UserData {
  name: string;
  email: string;
  phone: string | null;
  role: string;
  createdAt: string;
}

interface Props {
  user: UserData;
}

export default function ProfileForm({ user }: Props) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    const res = await fetch("/api/users/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone }),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "เกิดข้อผิดพลาด");
      return;
    }

    setSaved(true);
    router.refresh();
  }

  const roleLabel = user.role === "OWNER" ? "เจ้าของหอพัก" : "นักศึกษา";
  const joinedYear = new Date(user.createdAt).toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Bangkok" });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white text-2xl font-bold shrink-0">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-white font-bold text-lg">{user.name}</p>
          <p className="text-blue-200 text-sm">{user.email}</p>
          <span className="inline-block mt-1 bg-white/20 text-white text-xs px-2 py-0.5 rounded-full font-medium">
            {roleLabel}
          </span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">ชื่อ-นามสกุล</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">อีเมล</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full border border-gray-100 rounded-xl px-4 py-2.5 text-gray-400 bg-gray-50 cursor-not-allowed"
          />
          <p className="text-xs text-gray-400 mt-1">ไม่สามารถเปลี่ยนอีเมลได้</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">เบอร์โทรศัพท์</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0812345678"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
          />
        </div>

        {error && <p className="text-sm text-red-500 bg-red-50 px-4 py-2.5 rounded-xl">{error}</p>}
        {saved && <p className="text-sm text-green-600 bg-green-50 px-4 py-2.5 rounded-xl">บันทึกเรียบร้อยแล้ว</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold transition-colors disabled:opacity-50"
        >
          {saving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
        </button>

        <p className="text-center text-xs text-gray-400">สมาชิกตั้งแต่ {joinedYear}</p>
      </form>
    </div>
  );
}
