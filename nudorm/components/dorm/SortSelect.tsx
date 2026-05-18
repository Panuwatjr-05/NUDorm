"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  value: string;
}

export default function SortSelect({ value }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    router.push(`?${params.toString()}`);
  }

  return (
    <select
      value={value}
      onChange={handleChange}
      className="text-sm bg-white border border-gray-200 rounded-xl px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-500"
    >
      <option value="newest">ใหม่สุด</option>
      <option value="price_asc">ราคาต่ำ → สูง</option>
      <option value="price_desc">ราคาสูง → ต่ำ</option>
      <option value="rating">คะแนนสูงสุด</option>
    </select>
  );
}
