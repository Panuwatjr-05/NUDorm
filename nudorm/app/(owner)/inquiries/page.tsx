import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function InquiriesPage() {
  const session = await auth();
  if (!session || session.user.role !== "OWNER") redirect("/login");

  const dorms = await prisma.dorm.findMany({
    where: { ownerId: session.user.id },
    select: { id: true },
  });

  const dormIds = dorms.map((d) => d.id);

  const inquiries = await prisma.inquiry.findMany({
    where: { dormId: { in: dormIds } },
    include: {
      dorm: { select: { name: true } },
      from: { select: { name: true, email: true, phone: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  await prisma.inquiry.updateMany({
    where: { dormId: { in: dormIds }, isRead: false },
    data: { isRead: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        ข้อความสอบถาม <span className="text-gray-500 font-normal text-lg">({inquiries.length})</span>
      </h1>

      {inquiries.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-4">💬</div>
          <p>ยังไม่มีข้อความ</p>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq) => (
            <div key={inq.id} className={`bg-white rounded-2xl border shadow-sm p-5 ${!inq.isRead ? "border-blue-200" : "border-gray-100"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 text-sm">{inq.from.name}</span>
                    {!inq.isRead && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">ใหม่</span>}
                  </div>
                  <p className="text-xs text-gray-400 mb-2">
                    หอ: {inq.dorm.name} · {new Date(inq.createdAt).toLocaleDateString("th-TH")}
                  </p>
                  <p className="text-sm text-gray-700">{inq.message}</p>
                </div>
                <div className="text-right shrink-0 space-y-1">
                  {inq.from.phone && (
                    <a href={`tel:${inq.from.phone}`} className="block text-sm text-blue-700 font-medium">
                      📞 {inq.from.phone}
                    </a>
                  )}
                  <a href={`mailto:${inq.from.email}`} className="block text-xs text-gray-400 hover:text-blue-700">
                    {inq.from.email}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
