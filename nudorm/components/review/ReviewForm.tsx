"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ReviewForm({ dormId }: { dormId: string }) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) { setError("กรุณาเลือกดาว"); return; }
    setLoading(true);
    setError("");

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dormId, rating, comment }),
    });

    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "เกิดข้อผิดพลาด");
      return;
    }

    setRating(0);
    setComment("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="border-2 border-gray-100 rounded-xl p-4 space-y-3 bg-white">
      <p className="text-sm font-semibold text-gray-800">เขียนรีวิว</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setRating(s)}
            onMouseEnter={() => setHover(s)}
            onMouseLeave={() => setHover(0)}
            className="text-3xl transition-transform hover:scale-110"
          >
            <span className={s <= (hover || rating) ? "text-yellow-400" : "text-gray-200"}>★</span>
          </button>
        ))}
      </div>
      <textarea
        required
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        placeholder="เล่าประสบการณ์ของคุณ..."
        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:border-blue-500 transition-colors bg-white"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-700 text-white px-5 py-2.5 rounded-xl text-base font-semibold hover:bg-blue-800 transition-colors disabled:opacity-50"
      >
        {loading ? "กำลังส่ง..." : "ส่งรีวิว"}
      </button>
    </form>
  );
}
