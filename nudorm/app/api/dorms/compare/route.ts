import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ids = searchParams.get("ids")?.split(",").filter(Boolean) ?? [];

  if (ids.length < 2 || ids.length > 3) {
    return NextResponse.json({ error: "เลือก 2-3 หอเพื่อเปรียบเทียบ" }, { status: 400 });
  }

  const dorms = await prisma.dorm.findMany({
    where: { id: { in: ids } },
    include: {
      owner: { select: { name: true, phone: true } },
      rooms: true,
      reviews: { select: { rating: true } },
      _count: { select: { reviews: true, wishlists: true } },
    },
  });

  const result = dorms.map((dorm) => {
    const avgRating =
      dorm.reviews.length > 0
        ? dorm.reviews.reduce((sum, r) => sum + r.rating, 0) / dorm.reviews.length
        : null;
    const { reviews, ...rest } = dorm;
    return { ...rest, avgRating };
  });

  return NextResponse.json(result);
}
