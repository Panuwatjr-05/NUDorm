import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { DormType } from "@prisma/client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "";
  const type = searchParams.get("type") as DormType | null;
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const amenities = searchParams.get("amenities")?.split(",").filter(Boolean) ?? [];

  const dorms = await prisma.dorm.findMany({
    where: {
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { address: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(type && { type }),
      ...(minPrice && { price: { gte: parseInt(minPrice) } }),
      ...(maxPrice && { price: { lte: parseInt(maxPrice) } }),
      ...(amenities.length > 0 && { amenities: { hasEvery: amenities } }),
    },
    include: {
      owner: { select: { name: true, phone: true } },
      _count: { select: { reviews: true, wishlists: true } },
      reviews: { select: { rating: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const dormsWithRating = dorms.map((dorm) => {
    const avgRating =
      dorm.reviews.length > 0
        ? dorm.reviews.reduce((sum, r) => sum + r.rating, 0) / dorm.reviews.length
        : null;
    const { reviews, ...rest } = dorm;
    return { ...rest, avgRating };
  });

  return NextResponse.json(dormsWithRating);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "OWNER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, description, price, priceMax, type, lat, lng, address, phone, lineId, facebookUrl, amenities, images, rooms } = body;

  if (!name || !price || !type || !lat || !lng || !address) {
    return NextResponse.json({ error: "กรุณากรอกข้อมูลที่จำเป็น" }, { status: 400 });
  }

  const dorm = await prisma.dorm.create({
    data: {
      name,
      description,
      price: parseInt(price),
      priceMax: priceMax ? parseInt(priceMax) : null,
      type,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      address,
      phone,
      lineId: lineId || null,
      facebookUrl: facebookUrl || null,
      amenities: amenities ?? [],
      images: images ?? [],
      ownerId: session.user.id,
    },
  });

  if (Array.isArray(rooms) && rooms.length > 0) {
    await prisma.room.createMany({
      data: rooms.map((r: { name: string; price: string }) => ({
        dormId: dorm.id,
        name: r.name,
        price: parseInt(r.price),
        isAvailable: true,
      })),
    });
  }

  return NextResponse.json(dorm, { status: 201 });
}
