import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

async function verifyOwner(dormId: string, userId: string) {
  const dorm = await prisma.dorm.findUnique({ where: { id: dormId } });
  return dorm && dorm.ownerId === userId ? dorm : null;
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session || session.user.role !== "OWNER")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!await verifyOwner(id, session.user.id))
    return NextResponse.json({ error: "ไม่มีสิทธิ์" }, { status: 403 });

  const { name, price } = await req.json();
  if (!name || !price)
    return NextResponse.json({ error: "กรุณากรอกชื่อและราคา" }, { status: 400 });

  const room = await prisma.room.create({
    data: { dormId: id, name, price: parseInt(price), isAvailable: true },
  });
  return NextResponse.json(room, { status: 201 });
}
