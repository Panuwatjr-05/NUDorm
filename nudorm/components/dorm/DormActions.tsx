"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  dormId: string;
  isAvailable: boolean;
}

export default function DormActions({ dormId, isAvailable }: Props) {
  const router = useRouter();
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function toggleStatus() {
    setToggling(true);
    await fetch(`/api/dorms/${dormId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: !isAvailable }),
    });
    setToggling(false);
    router.refresh();
  }

  async function deleteDorm() {
    setDeleting(true);
    await fetch(`/api/dorms/${dormId}`, { method: "DELETE" });
    setDeleting(false);
    setShowConfirm(false);
    router.refresh();
  }

  return (
    <div className="flex gap-2 shrink-0 items-center">
      {/* Toggle status */}
      <button
        onClick={toggleStatus}
        disabled={toggling}
        className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors disabled:opacity-50 ${
          isAvailable
            ? "bg-green-100 text-green-700 hover:bg-green-200"
            : "bg-red-100 text-red-600 hover:bg-red-200"
        }`}
      >
        {toggling ? "..." : isAvailable ? "ว่าง" : "เต็ม"}
      </button>

      {/* Delete */}
      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          className="text-sm px-3 py-2 rounded-xl border-2 border-gray-200 text-gray-400 font-semibold hover:border-red-300 hover:text-red-500 transition-colors"
        >
          ลบ
        </button>
      ) : (
        <div className="flex gap-1.5 items-center bg-red-50 border border-red-200 rounded-xl px-3 py-1.5">
          <span className="text-xs text-red-600 font-medium">ยืนยันลบ?</span>
          <button
            onClick={deleteDorm}
            disabled={deleting}
            className="text-xs bg-red-500 text-white px-2 py-1 rounded-lg font-semibold hover:bg-red-600 disabled:opacity-50"
          >
            {deleting ? "..." : "ใช่"}
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            className="text-xs text-gray-500 px-2 py-1 rounded-lg hover:bg-gray-100"
          >
            ยกเลิก
          </button>
        </div>
      )}
    </div>
  );
}
