import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/profile/ProfileForm";

export default async function ProfilePage() {
  const session = await auth();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, phone: true, role: true, createdAt: true },
  });

  if (!user) redirect("/login");

  return (
    <div className="max-w-lg mx-auto pt-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">โปรไฟล์ของฉัน</h1>
      <ProfileForm user={{ ...user, createdAt: user.createdAt.toISOString() }} />
    </div>
  );
}
