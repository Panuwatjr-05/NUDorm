import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

async function verifyOwner(roomId: string, userId: string) {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: { dorm: { select: { ownerId: true } } },
  });
  return room && room.dorm.ownerId === userId ? room : null;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params;
  const session = await auth();
  if (!session || session.user.role !== "OWNER")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!await verifyOwner(roomId, session.user.id))
    return NextResponse.json({ error: "ไม่มีสิทธิ์" }, { status: 403 });

  const { name, price, isAvailable } = await req.json();
  const room = await prisma.room.update({
    where: { id: roomId },
    data: {
      ...(name && { name }),
      ...(price !== undefined && { price: parseInt(price) }),
      ...(isAvailable !== undefined && { isAvailable }),
    },
  });
  return NextResponse.json(room);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params;
  const session = await auth();
  if (!session || session.user.role !== "OWNER")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!await verifyOwner(roomId, session.user.id))
    return NextResponse.json({ error: "ไม่มีสิทธิ์" }, { status: 403 });

  await prisma.room.delete({ where: { id: roomId } });
  return NextResponse.json({ success: true });
}
