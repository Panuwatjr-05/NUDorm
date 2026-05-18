import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== "OWNER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const dormId = formData.get("dormId") as string | null;

  if (!file) return NextResponse.json({ error: "ไม่พบไฟล์" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const folder = dormId ? `nudorm/${dormId}` : `nudorm/new`;
  const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder, resource_type: "image" },
        (err, res) => {
          if (err || !res) reject(err);
          else resolve(res as { secure_url: string });
        }
      )
      .end(buffer);
  });

  // อัปเดต DB เฉพาะเมื่อมี dormId
  if (dormId) {
    const { prisma } = await import("@/lib/prisma");
    const dorm = await prisma.dorm.findUnique({ where: { id: dormId } });
    if (dorm && dorm.ownerId === session.user.id) {
      await prisma.dorm.update({
        where: { id: dormId },
        data: { images: [...dorm.images, result.secure_url] },
      });
    }
  }

  return NextResponse.json({ url: result.secure_url });
}
