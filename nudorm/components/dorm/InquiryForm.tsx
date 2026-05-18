"use client";

import { useState } from "react";

export default function InquiryForm({ dormId }: { dormId: string }) {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dormId, message }),
    });

    setLoading(false);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="text-center py-4">
        <p className="text-green-600 font-medium text-sm">✓ ส่งข้อความแล้ว!</p>
        <p className="text-gray-400 text-xs mt-1">เจ้าของหอจะติดต่อกลับมา</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        required
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        placeholder="สอบถามเรื่องห้องว่าง ราคา หรืออื่นๆ..."
        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:border-blue-500 transition-colors bg-white"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-700 text-white py-3 rounded-xl text-base font-semibold hover:bg-blue-800 transition-colors disabled:opacity-50"
      >
        {loading ? "กำลังส่ง..." : "ส่งข้อความ"}
      </button>
    </form>
  );
}
