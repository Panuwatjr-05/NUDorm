"use client";

import { useState } from "react";
import Link from "next/link";

interface Dorm {
  id: string;
  name: string;
  address: string;
  isAvailable: boolean;
  createdAt: Date;
  owner: { name: string; email: string };
  _count: { reviews: number; wishlists: number };
}

export default function AdminDormList({ dorms }: { dorms: Dorm[] }) {
  const [list, setList] = useState(dorms);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`ลบหอพัก "${name}" ออกจากระบบ?`)) return;
    setDeleting(id);
    const res = await fetch(`/api/admin/dorms/${id}`, { method: "DELETE" });
    if (res.ok) {
      setList((prev) => prev.filter((d) => d.id !== id));
    } else {
      alert("ลบไม่สำเร็จ");
    }
    setDeleting(null);
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500 text-xs">
          <tr>
            <th className="text-left px-5 py-3 font-semibold">ชื่อหอพัก</th>
            <th className="text-left px-5 py-3 font-semibold">เจ้าของ</th>
            <th className="text-left px-5 py-3 font-semibold">สถิติ</th>
            <th className="text-left px-5 py-3 font-semibold">สถานะ</th>
            <th className="text-left px-5 py-3 font-semibold">จัดการ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {list.map((dorm) => (
            <tr key={dorm.id} className="hover:bg-gray-50">
              <td className="px-5 py-3">
                <div className="font-medium text-gray-900">{dorm.name}</div>
                <div className="text-gray-400 text-xs truncate max-w-[200px]">{dorm.address}</div>
              </td>
              <td className="px-5 py-3">
                <div className="text-gray-700">{dorm.owner.name}</div>
                <div className="text-gray-400 text-xs">{dorm.owner.email}</div>
              </td>
              <td className="px-5 py-3 text-gray-500">
                <div>{dorm._count.reviews} รีวิว</div>
                <div>{dorm._count.wishlists} บันทึก</div>
              </td>
              <td className="px-5 py-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  dorm.isAvailable ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                }`}>
                  {dorm.isAvailable ? "ว่าง" : "เต็ม"}
                </span>
              </td>
              <td className="px-5 py-3">
                <div className="flex gap-2">
                  <Link
                    href={`/dorms/${dorm.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    ดู
                  </Link>
                  <button
                    onClick={() => handleDelete(dorm.id, dorm.name)}
                    disabled={deleting === dorm.id}
                    className="text-red-500 hover:text-red-700 font-medium disabled:opacity-50"
                  >
                    {deleting === dorm.id ? "กำลังลบ..." : "ลบ"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
