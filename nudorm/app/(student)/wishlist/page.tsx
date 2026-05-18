import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DormCard from "@/components/dorm/DormCard";
import { DormWithOwner } from "@/types";
import Link from "next/link";

export default async function WishlistPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const wishlists = await prisma.wishlist.findMany({
    where: { userId: session.user.id },
    include: {
      dorm: {
        include: {
          owner: { select: { name: true, phone: true } },
          _count: { select: { reviews: true, wishlists: true } },
          reviews: { select: { rating: true } },
        },
      },
    },
    orderBy: { id: "desc" },
  });

  const dorms: DormWithOwner[] = wishlists.map(({ dorm }) => {
    const avgRating =
      dorm.reviews.length > 0
        ? dorm.reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / dorm.reviews.length
        : undefined;
    const { reviews, ...rest } = dorm;
    return { ...rest, avgRating };
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        หอที่บันทึกไว้{" "}
        <span className="text-gray-500 font-normal text-base">({dorms.length} แห่ง)</span>
      </h1>

      {dorms.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">♡</div>
          <p className="mb-4">ยังไม่มีหอที่บันทึกไว้</p>
          <Link href="/dorms" className="text-blue-700 font-medium">ค้นหาหอพักเลย</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dorms.map((dorm) => (
            <DormCard key={dorm.id} dorm={dorm} />
          ))}
        </div>
      )}
    </div>
  );
}
