"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, useTransition } from "react";
import { AMENITIES_LIST } from "@/types";

export default function DormFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [type, setType] = useState(searchParams.get("type") ?? "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    searchParams.get("amenities")?.split(",").filter(Boolean) ?? []
  );

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function pushFilters(overrides?: {
    search?: string;
    type?: string;
    minPrice?: string;
    maxPrice?: string;
    amenities?: string[];
  }) {
    const s = overrides?.search ?? search;
    const t = overrides?.type ?? type;
    const mn = overrides?.minPrice ?? minPrice;
    const mx = overrides?.maxPrice ?? maxPrice;
    const am = overrides?.amenities ?? selectedAmenities;

    const params = new URLSearchParams();
    if (s) params.set("search", s);
    if (t) params.set("type", t);
    if (mn) params.set("minPrice", mn);
    if (mx) params.set("maxPrice", mx);
    if (am.length > 0) params.set("amenities", am.join(","));
    startTransition(() => router.push(`/dorms?${params.toString()}`));
  }

  // Auto-apply with debounce for text/number inputs
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => pushFilters(), 500);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, minPrice, maxPrice]);

  function selectType(value: string) {
    setType(value);
    pushFilters({ type: value });
  }

  function toggleAmenity(a: string) {
    const next = selectedAmenities.includes(a)
      ? selectedAmenities.filter((x) => x !== a)
      : [...selectedAmenities, a];
    setSelectedAmenities(next);
    pushFilters({ amenities: next });
  }

  const inputClass = "w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors bg-white";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="ชื่อหอหรือที่อยู่..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Type */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2">ประเภทหอ</p>
        <div className="flex flex-wrap gap-2">
          {[
            { value: "", label: "ทั้งหมด" },
            { value: "FEMALE", label: "หญิงล้วน" },
            { value: "MALE", label: "ชายล้วน" },
            { value: "MIXED", label: "ทั้งสองเพศ" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => selectType(opt.value)}
              className={`text-sm px-4 py-2 rounded-full border-2 font-medium transition-colors ${
                type === opt.value
                  ? "border-blue-700 bg-blue-700 text-white"
                  : "border-gray-200 text-gray-700 hover:border-blue-400"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2">ราคา (บาท/เดือน)</p>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="ต่ำสุด"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className={inputClass}
          />
          <input
            type="number"
            placeholder="สูงสุด"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* Amenities */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2">สิ่งอำนวยความสะดวก</p>
        <div className="flex flex-wrap gap-2">
          {AMENITIES_LIST.map((a) => (
            <button
              key={a}
              onClick={() => toggleAmenity(a)}
              className={`text-sm px-3 py-1.5 rounded-full border-2 font-medium transition-colors ${
                selectedAmenities.includes(a)
                  ? "border-blue-700 bg-blue-50 text-blue-700"
                  : "border-gray-200 text-gray-700 hover:border-blue-400"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Status indicator */}
      {isPending && (
        <p className="text-xs text-blue-500 text-center animate-pulse">กำลังกรอง...</p>
      )}

      {/* Reset */}
      {(search || type || minPrice || maxPrice || selectedAmenities.length > 0) && (
        <button
          onClick={() => {
            setSearch(""); setType(""); setMinPrice(""); setMaxPrice(""); setSelectedAmenities([]);
            startTransition(() => router.push("/dorms"));
          }}
          className="w-full border-2 border-gray-200 text-gray-500 py-2.5 rounded-xl text-sm font-semibold hover:border-red-300 hover:text-red-500 transition-colors"
        >
          ล้างตัวกรอง
        </button>
      )}
    </div>
  );
}
