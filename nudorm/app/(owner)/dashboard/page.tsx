import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import DormActions from "@/components/dorm/DormActions";

export default async function DashboardPage() {
  const session = await auth();
  if (!session || session.user.role !== "OWNER") redirect("/login");

  const dorms = await prisma.dorm.findMany({
    where: { ownerId: session.user.id },
    include: {
      _count: { select: { reviews: true, wishlists: true, inquiries: true } },
      reviews: { select: { rating: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalWishlists = dorms.reduce((sum, d) => sum + d._count.wishlists, 0);
  const totalReviews = dorms.reduce((sum, d) => sum + d._count.reviews, 0);
  const allRatings = dorms.flatMap((d) => d.reviews.map((r) => r.rating));
  const avgRatingAll = allRatings.length > 0
    ? allRatings.reduce((s, r) => s + r, 0) / allRatings.length
    : null;

  const stats = [
    { label: "หอพักของฉัน", value: dorms.length, color: "from-blue-500 to-blue-600" },
    { label: "คนบันทึก Wishlist", value: totalWishlists, color: "from-pink-500 to-pink-600" },
    { label: "Feedback", value: totalReviews, sub: avgRatingAll ? `★ ${avgRatingAll.toFixed(1)} เฉลี่ย` : "ยังไม่มีรีวิว", color: "from-amber-400 to-amber-500", href: "/feedback" },
  ];

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm mb-0.5">ยินดีต้อนรับกลับมา</p>
          <h1 className="text-2xl font-bold text-gray-900">{session.user.name}</h1>
        </div>
        <Link
          href="/listings/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-blue-900/30 flex items-center gap-2"
        >
          <span className="text-base">+</span> ลงประกาศหอใหม่
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const card = (
            <div className={`bg-gradient-to-br ${stat.color} rounded-2xl p-5 text-white shadow-lg ${"href" in stat ? "hover:opacity-90 transition-opacity cursor-pointer" : ""}`}>
              <div className="flex items-start justify-between mb-3">
                <span className="bg-white/20 rounded-lg px-2 py-0.5 text-xs font-medium">รวมทั้งหมด</span>
              </div>
              <div className="text-4xl font-bold mb-0.5">{stat.value}</div>
              <div className="text-sm text-white/80">{stat.label}</div>
              {"sub" in stat && stat.sub && (
                <div className="text-xs text-white/60 mt-1">{stat.sub}</div>
              )}
            </div>
          );
          return "href" in stat ? (
            <Link key={stat.label} href={stat.href!}>{card}</Link>
          ) : (
            <div key={stat.label}>{card}</div>
          );
        })}
      </div>

      {/* Dorm list */}
      <div>
        <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
          หอพักของฉัน
          <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full font-normal">{dorms.length} แห่ง</span>
        </h2>

        {dorms.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl text-center py-16 text-gray-400">
            <div className="text-5xl mb-4">🏠</div>
            <p className="mb-4">ยังไม่มีหอพัก</p>
            <Link href="/listings/new" className="text-blue-400 font-medium hover:text-blue-300">ลงประกาศเลย →</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {dorms.map((dorm) => {
              const avgRating =
                dorm.reviews.length > 0
                  ? dorm.reviews.reduce((sum, r) => sum + r.rating, 0) / dorm.reviews.length
                  : null;
              return (
                <div key={dorm.id} className="bg-white rounded-2xl p-5 flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 truncate">{dorm.name}</h3>
                    </div>
                    <p className="text-sm text-gray-400 mb-2 truncate">{dorm.address}</p>
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span><span className="font-semibold text-gray-700">{dorm._count.wishlists}</span> บันทึก</span>
                      <span><span className="font-semibold text-gray-700">{avgRating ? avgRating.toFixed(1) : "–"}</span> คะแนน ({dorm._count.reviews} รีวิว)</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0 items-center">
                    <Link
                      href={`/dorms/${dorm.id}`}
                      className="text-sm px-4 py-2 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:border-blue-300 hover:text-blue-700 transition-colors"
                    >
                      ดู
                    </Link>
                    <Link
                      href={`/listings/${dorm.id}/edit`}
                      className="text-sm px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
                    >
                      แก้ไข
                    </Link>
                    <DormActions dormId={dorm.id} isAvailable={dorm.isAvailable} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
