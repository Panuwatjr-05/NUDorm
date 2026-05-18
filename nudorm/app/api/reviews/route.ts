import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  if (session.user.role !== "STUDENT") return NextResponse.json({ error: "เฉพาะนักศึกษาเท่านั้นที่รีวิวได้" }, { status: 403 });

  const { dormId, rating, comment } = await req.json();

  if (!dormId || !rating || !comment) {
    return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบ" }, { status: 400 });
  }

  const ratingInt = parseInt(rating);
  if (!Number.isInteger(ratingInt) || ratingInt < 1 || ratingInt > 5) {
    return NextResponse.json({ error: "คะแนนต้องอยู่ระหว่าง 1-5" }, { status: 400 });
  }

  const dorm = await prisma.dorm.findUnique({ where: { id: dormId }, select: { ownerId: true } });
  if (!dorm) return NextResponse.json({ error: "ไม่พบหอพัก" }, { status: 404 });
  if (dorm.ownerId === session.user.id) return NextResponse.json({ error: "ไม่สามารถรีวิวหอของตัวเองได้" }, { status: 403 });

  const existing = await prisma.review.findFirst({
    where: { dormId, userId: session.user.id },
  });

  if (existing) {
    return NextResponse.json({ error: "คุณเคยรีวิวหอนี้แล้ว" }, { status: 400 });
  }

  const review = await prisma.review.create({
    data: { dormId, userId: session.user.id, rating, comment },
    include: { user: { select: { name: true } } },
  });

  return NextResponse.json(review, { status: 201 });
}
