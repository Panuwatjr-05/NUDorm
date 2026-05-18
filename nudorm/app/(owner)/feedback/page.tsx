import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function FeedbackPage() {
  const session = await auth();
  if (!session || session.user.role !== "OWNER") redirect("/login");

  const dorms = await prisma.dorm.findMany({
    where: { ownerId: session.user.id },
    select: {
      id: true,
      name: true,
      reviews: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const allReviews = dorms.flatMap((d) =>
    d.reviews.map((r) => ({ ...r, dormName: d.name }))
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const avgOverall =
    allReviews.length > 0
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      : null;

  const ratingCount = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: allReviews.filter((r) => r.rating === star).length,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Feedback</h1>
        <p className="text-gray-500 text-sm mt-1">รีวิวทั้งหมดจากนักศึกษาที่ใช้หอพักของคุณ</p>
      </div>

      {allReviews.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">⭐</div>
          <p>ยังไม่มีรีวิว</p>
        </div>
      ) : (
        <>
          {/* Summary card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col sm:flex-row gap-6">
            {/* Average */}
            <div className="flex flex-col items-center justify-center sm:w-40 shrink-0">
              <span className="text-5xl font-bold text-gray-900">{avgOverall!.toFixed(1)}</span>
              <div className="flex gap-0.5 my-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className={`text-xl ${s <= Math.round(avgOverall!) ? "text-yellow-400" : "text-gray-200"}`}>★</span>
                ))}
              </div>
              <span className="text-sm text-gray-400">{allReviews.length} รีวิว</span>
            </div>

            {/* Bar chart */}
            <div className="flex-1 space-y-2">
              {ratingCount.map(({ star, count }) => (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 w-4 text-right">{star}</span>
                  <span className="text-yellow-400 text-sm">★</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                    <div
                      className="bg-yellow-400 h-2.5 rounded-full transition-all"
                      style={{ width: allReviews.length > 0 ? `${(count / allReviews.length) * 100}%` : "0%" }}
                    />
                  </div>
                  <span className="text-sm text-gray-400 w-6">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Review list */}
          <div className="space-y-3">
            {allReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3 flex-1 min-w-0">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-700 font-bold text-sm">
                      {review.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="font-semibold text-gray-900 text-sm">{review.user.name}</span>
                        <span className="text-xs text-gray-400">รีวิว</span>
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full truncate max-w-[160px]">
                          {review.dormName}
                        </span>
                      </div>
                      <div className="flex gap-0.5 mb-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span key={s} className={`text-sm ${s <= review.rating ? "text-yellow-400" : "text-gray-200"}`}>★</span>
                        ))}
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">
                    {new Date(review.createdAt).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
