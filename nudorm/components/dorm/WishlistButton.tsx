"use client";

import { useState } from "react";

export default function WishlistButton({ dormId, initialSaved }: { dormId: string; initialSaved: boolean }) {
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const res = await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dormId }),
    });
    if (res.ok) {
      const data = await res.json();
      setSaved(data.saved);
    }
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
        saved
          ? "border-red-400 bg-red-50 text-red-500"
          : "border-gray-300 text-gray-500 hover:border-red-400 hover:text-red-400"
      }`}
    >
      {saved ? "♥ บันทึกแล้ว" : "♡ บันทึก"}
    </button>
  );
}
