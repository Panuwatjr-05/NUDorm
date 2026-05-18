export const revalidate = 60;

import { prisma } from "@/lib/prisma";
import DormCard from "@/components/dorm/DormCard";
import DormFilter from "@/components/dorm/DormFilter";
import SortSelect from "@/components/dorm/SortSelect";
import Pagination from "@/components/dorm/Pagination";
import { DormType } from "@prisma/client";
import { DormWithOwner } from "@/types";
import { Suspense } from "react";

const PAGE_SIZE = 12;

interface SearchParams {
  search?: string;
  type?: string;
  minPrice?: string;
  maxPrice?: string;
  amenities?: string;
  sort?: string;
  page?: string;
}

export default async function DormsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const amenities = params.amenities?.split(",").filter(Boolean) ?? [];
  const sort = params.sort ?? "newest";
  const page = Math.max(1, parseInt(params.page ?? "1") || 1);

  const orderBy = sort === "price_asc" ? { price: "asc" as const }
    : sort === "price_desc" ? { price: "desc" as const }
    : { createdAt: "desc" as const };

  const where = {
    ...(params.search && {
      OR: [
        { name: { contains: params.search, mode: "insensitive" as const } },
        { address: { contains: params.search, mode: "insensitive" as const } },
      ],
    }),
    ...(params.type && { type: params.type as DormType }),
    ...(params.minPrice && { price: { gte: parseInt(params.minPrice) } }),
    ...(params.maxPrice && { price: { lte: parseInt(params.maxPrice) } }),
    ...(amenities.length > 0 && { amenities: { hasEvery: amenities } }),
  };

  const needsClientSort = sort === "rating";

  const [totalCount, dorms] = await Promise.all([
    prisma.dorm.count({ where }),
    prisma.dorm.findMany({
      where,
      include: {
        owner: { select: { name: true, phone: true } },
        _count: { select: { reviews: true, wishlists: true } },
        reviews: { select: { rating: true } },
      },
      orderBy: needsClientSort ? { createdAt: "desc" } : orderBy,
      ...(needsClientSort ? {} : { skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    }),
  ]);

  let dormsWithRating: DormWithOwner[] = dorms.map((dorm) => {
    const avgRating =
      dorm.reviews.length > 0
        ? dorm.reviews.reduce((sum, r) => sum + r.rating, 0) / dorm.reviews.length
        : undefined;
    const { reviews, ...rest } = dorm;
    return { ...rest, avgRating };
  });

  if (needsClientSort) {
    dormsWithRating = dormsWithRating.sort((a, b) => (b.avgRating ?? 0) - (a.avgRating ?? 0));
    const start = (page - 1) * PAGE_SIZE;
    dormsWithRating = dormsWithRating.slice(start, start + PAGE_SIZE);
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const hasFilter = !!(params.search || params.type || params.minPrice || params.maxPrice || params.amenities);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Sidebar filter */}
      <aside className="md:w-72 shrink-0">
        <Suspense fallback={<div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 h-96 animate-pulse" />}>
          <DormFilter />
        </Suspense>
      </aside>

      {/* Results */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">
            {hasFilter ? "ผลการค้นหา" : "หอพักทั้งหมด"}{" "}
            <span className="text-gray-500 font-semibold text-base">({totalCount} แห่ง)</span>
          </h1>
          <Suspense fallback={null}>
            <SortSelect value={sort} />
          </Suspense>
        </div>

        {dormsWithRating.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">🏠</div>
            <p>ไม่พบหอพักที่ตรงกับเงื่อนไข</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dormsWithRating.map((dorm) => (
                <DormCard key={dorm.id} dorm={dorm} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-8">
                <Suspense fallback={null}>
                  <Pagination currentPage={page} totalPages={totalPages} />
                </Suspense>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
