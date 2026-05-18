import Link from "next/link";
import { auth } from "@/lib/auth";
export default async function HomePage() {
  await auth();

  return (
    <div className="space-y-8">

      {/* Hero */}
      <section className="text-center flex flex-col items-center justify-center min-h-[75vh] px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          หาหอพักรอบ{" "}
          <span className="text-blue-600">ม.นเรศวร</span>
        </h1>
        <p className="text-gray-500 text-lg mb-8 max-w-xl mx-auto">
          ค้นหา เปรียบเทียบ และติดต่อหอพักรอบมหาวิทยาลัยนเรศวร พิษณุโลก ได้ในที่เดียว
        </p>
        <Link
          href="/dorms"
          className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-semibold hover:bg-blue-700 transition-colors shadow-md"
        >
          ค้นหาหอพัก
        </Link>
      </section>

    </div>
  );
}
