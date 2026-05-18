"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AMENITIES_LIST } from "@/types";

interface CompareDorm {
  id: string;
  name: string;
  price: number;
  priceMax: number | null;
  type: string;
  address: string;
  amenities: string[];
  isAvailable: boolean;
  avgRating: number | null;
  images: string[];
  _count: { reviews: number; wishlists: number };
}

const TYPE_LABEL: Record<string, string> = {
  FEMALE: "หญิงล้วน",
  MALE: "ชายล้วน",
  MIXED: "ทั้งสองเพศ",
};

function Cell({ children, highlight }: { children: React.ReactNode; highlight?: boolean }) {
  return (
    <td className={`px-4 py-3 text-sm text-center border-b border-gray-100 ${highlight ? "bg-blue-50 font-medium text-blue-700" : "text-gray-700"}`}>
      {children}
    </td>
  );
}

export default function DormCompare({ initialIds }: { initialIds: string[] }) {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialIds);
  const [dorms, setDorms] = useState<CompareDorm[]>([]);
  const [allDorms, setAllDorms] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/dorms")
      .then((r) => r.json())
      .then((data) => setAllDorms(data.map((d: CompareDorm) => ({ id: d.id, name: d.name }))));
  }, []);

  useEffect(() => {
    if (selectedIds.length < 2) { setDorms([]); return; }
    setLoading(true);
    fetch(`/api/dorms/compare?ids=${selectedIds.join(",")}`)
      .then((r) => r.json())
      .then((data) => { setDorms(data); setLoading(false); });
  }, [selectedIds]);

  function toggleDorm(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length < 3
        ? [...prev, id]
        : prev
    );
  }

  const lowestPrice = dorms.length > 0 ? Math.min(...dorms.map((d) => d.price)) : null;
  const highestRating = dorms.length > 0 ? Math.max(...dorms.map((d) => d.avgRating ?? 0)) : null;

  return (
    <div className="space-y-6">
      {/* Selector */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="text-sm font-medium text-gray-700 mb-3">
          เลือกหอที่ต้องการเปรียบเทียบ (2-3 แห่ง) — เลือกแล้ว {selectedIds.length}/3
        </p>
        <div className="flex flex-wrap gap-2">
          {allDorms.map((d) => (
            <button
              key={d.id}
              onClick={() => toggleDorm(d.id)}
              className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                selectedIds.includes(d.id)
                  ? "border-blue-700 bg-blue-700 text-white"
                  : selectedIds.length >= 3
                  ? "border-gray-200 text-gray-400 cursor-not-allowed"
                  : "border-gray-300 text-gray-600 hover:border-blue-400"
              }`}
              disabled={!selectedIds.includes(d.id) && selectedIds.length >= 3}
            >
              {d.name}
            </button>
          ))}
        </div>
        {allDorms.length === 0 && (
          <p className="text-gray-400 text-sm">
            ยังไม่มีหอพัก —{" "}
            <Link href="/listings/new" className="text-blue-700">ลงประกาศก่อน</Link>
          </p>
        )}
      </div>

      {/* Compare table */}
      {selectedIds.length < 2 && (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-3">⚖️</div>
          <p>เลือกอย่างน้อย 2 หอเพื่อเปรียบเทียบ</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-12 text-gray-400">กำลังโหลด...</div>
      )}

      {!loading && dorms.length >= 2 && (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 w-36">รายการ</th>
                {dorms.map((d) => (
                  <th key={d.id} className="px-4 py-3 text-center">
                    <Link href={`/dorms/${d.id}`} className="font-semibold text-gray-900 hover:text-blue-700 text-sm block">
                      {d.name}
                    </Link>
                    {d.images[0] && (
                      <img src={d.images[0]} alt={d.name} className="w-20 h-14 object-cover rounded-lg mx-auto mt-2" />
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-500 font-medium border-b border-gray-100">ราคา/เดือน</td>
                {dorms.map((d) => (
                  <Cell key={d.id} highlight={d.price === lowestPrice}>
                    ฿{d.price.toLocaleString()}
                    {d.priceMax && `–${d.priceMax.toLocaleString()}`}
                    {d.price === lowestPrice && <span className="ml-1 text-xs">💰 ถูกสุด</span>}
                  </Cell>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-500 font-medium border-b border-gray-100">ประเภท</td>
                {dorms.map((d) => <Cell key={d.id}>{TYPE_LABEL[d.type]}</Cell>)}
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-500 font-medium border-b border-gray-100">สถานะ</td>
                {dorms.map((d) => (
                  <Cell key={d.id}>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${d.isAvailable ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {d.isAvailable ? "มีห้องว่าง" : "เต็ม"}
                    </span>
                  </Cell>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-500 font-medium border-b border-gray-100">คะแนนเฉลี่ย</td>
                {dorms.map((d) => (
                  <Cell key={d.id} highlight={d.avgRating === highestRating && d.avgRating !== null}>
                    {d.avgRating
                      ? <>★ {d.avgRating.toFixed(1)} <span className="text-xs text-gray-400">({d._count.reviews} รีวิว)</span></>
                      : "–"}
                  </Cell>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-500 font-medium border-b border-gray-100">ที่อยู่</td>
                {dorms.map((d) => <Cell key={d.id}><span className="text-xs">{d.address}</span></Cell>)}
              </tr>
              {/* Amenities rows */}
              {AMENITIES_LIST.map((a) => (
                <tr key={a}>
                  <td className="px-4 py-3 text-sm text-gray-500 border-b border-gray-100">{a}</td>
                  {dorms.map((d) => (
                    <Cell key={d.id}>
                      {d.amenities.includes(a) ? (
                        <span className="text-green-500 text-lg">✓</span>
                      ) : (
                        <span className="text-gray-300 text-lg">–</span>
                      )}
                    </Cell>
                  ))}
                </tr>
              ))}
              {/* CTA row */}
              <tr>
                <td className="px-4 py-3" />
                {dorms.map((d) => (
                  <td key={d.id} className="px-4 py-3 text-center">
                    <Link
                      href={`/dorms/${d.id}`}
                      className="inline-block bg-blue-700 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
                    >
                      ดูรายละเอียด
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
