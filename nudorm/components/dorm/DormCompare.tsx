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

function LabelCell({ children }: { children: React.ReactNode }) {
  return (
    <td className="px-5 py-3.5 text-sm font-medium text-gray-500 border-b border-gray-100 bg-gray-50/60 whitespace-nowrap w-36">
      {children}
    </td>
  );
}

function Cell({ children, highlight }: { children: React.ReactNode; highlight?: boolean }) {
  return (
    <td className={`px-5 py-3.5 text-sm text-center border-b border-gray-100 transition-colors ${highlight ? "bg-blue-50 text-blue-700 font-semibold" : "text-gray-700"}`}>
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
    <div className="space-y-5">
      {/* Selector */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="text-sm font-medium text-gray-600 mb-3">
          เลือกหอที่ต้องการเปรียบเทียบ (2-3 แห่ง) — เลือกแล้ว {selectedIds.length}/3
        </p>
        <div className="flex flex-wrap gap-2">
          {allDorms.map((d) => (
            <button
              key={d.id}
              onClick={() => toggleDorm(d.id)}
              className={`text-sm px-3.5 py-1.5 rounded-full border-2 font-medium transition-colors ${
                selectedIds.includes(d.id)
                  ? "border-blue-600 bg-blue-600 text-white"
                  : selectedIds.length >= 3
                  ? "border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50"
                  : "border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600"
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
            <Link href="/listings/new" className="text-blue-600 font-medium">ลงประกาศก่อน</Link>
          </p>
        )}
      </div>

      {/* Empty state */}
      {selectedIds.length < 2 && (
        <div className="text-center py-16 text-gray-400">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="font-medium text-gray-500">เลือกอย่างน้อย 2 หอเพื่อเปรียบเทียบ</p>
          <p className="text-sm mt-1">กดเลือกหอพักด้านบนได้เลย</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-16 text-gray-400">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-sm">กำลังโหลด...</p>
        </div>
      )}

      {!loading && dorms.length >= 2 && (
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
          <table className="w-full bg-white">
            {/* Header */}
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/60 w-36">
                  รายการ
                </th>
                {dorms.map((d) => (
                  <th key={d.id} className="px-5 py-4 text-center">
                    {d.images[0] && (
                      <img
                        src={d.images[0]}
                        alt={d.name}
                        className="w-24 h-16 object-cover rounded-xl mx-auto mb-2"
                      />
                    )}
                    <Link
                      href={`/dorms/${d.id}`}
                      className="font-bold text-gray-900 hover:text-blue-600 text-sm block transition-colors"
                    >
                      {d.name}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* Price */}
              <tr>
                <LabelCell>ราคา/เดือน</LabelCell>
                {dorms.map((d) => (
                  <Cell key={d.id} highlight={d.price === lowestPrice}>
                    <span className="font-bold">฿{d.price.toLocaleString()}</span>
                    {d.priceMax && (
                      <span className="text-gray-400 font-normal">–{d.priceMax.toLocaleString()}</span>
                    )}
                    {d.price === lowestPrice && (
                      <span className="block text-xs text-blue-500 font-normal mt-0.5">ราคาถูกสุด</span>
                    )}
                  </Cell>
                ))}
              </tr>

              {/* Type */}
              <tr>
                <LabelCell>ประเภท</LabelCell>
                {dorms.map((d) => <Cell key={d.id}>{TYPE_LABEL[d.type]}</Cell>)}
              </tr>

              {/* Status */}
              <tr>
                <LabelCell>สถานะ</LabelCell>
                {dorms.map((d) => (
                  <Cell key={d.id}>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      d.isAvailable ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {d.isAvailable ? "มีห้องว่าง" : "เต็ม"}
                    </span>
                  </Cell>
                ))}
              </tr>

              {/* Rating */}
              <tr>
                <LabelCell>คะแนนเฉลี่ย</LabelCell>
                {dorms.map((d) => (
                  <Cell key={d.id} highlight={d.avgRating === highestRating && d.avgRating !== null}>
                    {d.avgRating ? (
                      <>
                        <span className="font-bold">★ {d.avgRating.toFixed(1)}</span>
                        <span className="text-xs text-gray-400 font-normal ml-1">({d._count.reviews} รีวิว)</span>
                        {d.avgRating === highestRating && (
                          <span className="block text-xs text-blue-500 font-normal mt-0.5">คะแนนสูงสุด</span>
                        )}
                      </>
                    ) : (
                      <span className="text-gray-300">–</span>
                    )}
                  </Cell>
                ))}
              </tr>

              {/* Address */}
              <tr>
                <LabelCell>ที่อยู่</LabelCell>
                {dorms.map((d) => (
                  <Cell key={d.id}>
                    <span className="text-xs text-gray-500 leading-relaxed">{d.address}</span>
                  </Cell>
                ))}
              </tr>

              {/* Section: Amenities */}
              <tr>
                <td colSpan={dorms.length + 1} className="px-5 py-2.5 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50 border-b border-gray-100">
                  สิ่งอำนวยความสะดวก
                </td>
              </tr>
              {AMENITIES_LIST.map((a) => (
                <tr key={a}>
                  <LabelCell>{a}</LabelCell>
                  {dorms.map((d) => (
                    <Cell key={d.id}>
                      {d.amenities.includes(a) ? (
                        <svg className="w-4 h-4 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="text-gray-200 text-lg leading-none">–</span>
                      )}
                    </Cell>
                  ))}
                </tr>
              ))}

              {/* CTA */}
              <tr>
                <td className="px-5 py-4 bg-gray-50/60" />
                {dorms.map((d) => (
                  <td key={d.id} className="px-5 py-4 text-center">
                    <Link
                      href={`/dorms/${d.id}`}
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors"
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
