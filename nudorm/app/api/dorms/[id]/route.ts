import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const dorm = await prisma.dorm.findUnique({
    where: { id },
    include: {
      owner: { select: { name: true, phone: true, email: true } },
      rooms: true,
      reviews: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { wishlists: true } },
    },
  });

  if (!dorm) return NextResponse.json({ error: "ไม่พบหอพัก" }, { status: 404 });

  const avgRating =
    dorm.reviews.length > 0
      ? dorm.reviews.reduce((sum, r) => sum + r.rating, 0) / dorm.reviews.length
      : null;

  return NextResponse.json({ ...dorm, avgRating });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session || session.user.role !== "OWNER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dorm = await prisma.dorm.findUnique({ where: { id } });
  if (!dorm || dorm.ownerId !== session.user.id) {
    return NextResponse.json({ error: "ไม่มีสิทธิ์แก้ไข" }, { status: 403 });
  }

  const body = await req.json();
  const updated = await prisma.dorm.update({
    where: { id },
    data: {
      ...(body.name && { name: body.name }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.price && { price: parseInt(body.price) }),
      ...(body.isAvailable !== undefined && { isAvailable: body.isAvailable }),
      ...(body.amenities && { amenities: body.amenities }),
      ...(body.address && { address: body.address }),
      ...(body.lat && { lat: parseFloat(body.lat) }),
      ...(body.lng && { lng: parseFloat(body.lng) }),
      lineId: body.lineId || null,
      facebookUrl: body.facebookUrl || null,
      electricityRate: body.electricityRate ? parseInt(body.electricityRate) : null,
      waterRate: body.waterRate ? parseInt(body.waterRate) : null,
      waterRateType: body.waterRateType === "METERED" ? "METERED" : "FLAT",
      deposit: body.deposit ? parseInt(body.deposit) : null,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session || session.user.role !== "OWNER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dorm = await prisma.dorm.findUnique({ where: { id } });
  if (!dorm || dorm.ownerId !== session.user.id) {
    return NextResponse.json({ error: "ไม่มีสิทธิ์ลบ" }, { status: 403 });
  }

  await prisma.dorm.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
