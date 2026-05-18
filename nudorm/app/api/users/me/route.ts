import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, phone } = body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "ชื่อไม่ถูกต้อง" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: name.trim(),
      ...(phone !== undefined && { phone: phone.trim() || null }),
    },
    select: { id: true, name: true, phone: true, email: true, role: true },
  });

  return NextResponse.json(updated);
}
