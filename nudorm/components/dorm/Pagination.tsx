"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function goTo(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  }

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-1.5">
      <button
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        ← ก่อนหน้า
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dot-${i}`} className="px-2 text-gray-400 text-sm">...</span>
        ) : (
          <button
            key={p}
            onClick={() => goTo(p as number)}
            className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors ${
              p === currentPage
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        ถัดไป →
      </button>
    </div>
  );
}
