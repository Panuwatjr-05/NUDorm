import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== "OWNER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dorms = await prisma.dorm.findMany({
    where: { ownerId: session.user.id },
    select: { id: true },
  });

  const inquiries = await prisma.inquiry.findMany({
    where: { dormId: { in: dorms.map((d) => d.id) } },
    include: {
      dorm: { select: { name: true } },
      from: { select: { name: true, email: true, phone: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(inquiries);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });

  const { dormId, message } = await req.json();

  if (!dormId || !message) {
    return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบ" }, { status: 400 });
  }

  const inquiry = await prisma.inquiry.create({
    data: { dormId, fromId: session.user.id, message },
  });

  return NextResponse.json(inquiry, { status: 201 });
}
