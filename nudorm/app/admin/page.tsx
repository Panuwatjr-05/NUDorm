import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminDormList from "@/components/admin/AdminDormList";

export default async function AdminPage() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/");

  const [dorms, users] = await Promise.all([
    prisma.dorm.findMany({
      include: {
        owner: { select: { name: true, email: true } },
        _count: { select: { reviews: true, wishlists: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-500 text-sm mt-1">จัดการหอพักและผู้ใช้ทั้งหมดในระบบ</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "หอพักทั้งหมด", value: dorms.length },
          { label: "ผู้ใช้ทั้งหมด", value: users.length },
          { label: "นักศึกษา", value: users.filter(u => u.role === "STUDENT").length },
          { label: "เจ้าของหอ", value: users.filter(u => u.role === "OWNER").length },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Dorm list */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">หอพักทั้งหมด</h2>
        <AdminDormList dorms={dorms} />
      </div>

      {/* User list */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">ผู้ใช้ทั้งหมด</h2>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs">
              <tr>
                <th className="text-left px-5 py-3 font-semibold">ชื่อ</th>
                <th className="text-left px-5 py-3 font-semibold">อีเมล</th>
                <th className="text-left px-5 py-3 font-semibold">Role</th>
                <th className="text-left px-5 py-3 font-semibold">สมัครเมื่อ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-900">{user.name}</td>
                  <td className="px-5 py-3 text-gray-500">{user.email}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      user.role === "ADMIN" ? "bg-red-100 text-red-700" :
                      user.role === "OWNER" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString("th-TH")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
