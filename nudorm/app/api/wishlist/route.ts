import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });

  const wishlists = await prisma.wishlist.findMany({
    where: { userId: session.user.id },
    include: {
      dorm: {
        include: { owner: { select: { name: true } } },
      },
    },
  });

  return NextResponse.json(wishlists.map((w) => w.dorm));
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });

  const { dormId } = await req.json();

  const existing = await prisma.wishlist.findUnique({
    where: { userId_dormId: { userId: session.user.id, dormId } },
  });

  if (existing) {
    await prisma.wishlist.delete({
      where: { userId_dormId: { userId: session.user.id, dormId } },
    });
    return NextResponse.json({ saved: false });
  }

  await prisma.wishlist.create({ data: { userId: session.user.id, dormId } });
  return NextResponse.json({ saved: true });
}
