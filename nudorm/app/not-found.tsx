import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="text-8xl font-black text-gray-100 select-none leading-none mb-2">404</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">ไม่พบหน้านี้</h1>
      <p className="text-gray-500 text-sm mb-8">หน้าที่คุณกำลังหาอาจถูกย้าย ลบ หรือไม่เคยมีอยู่</p>
      <Link
        href="/"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-blue-900/20"
      >
        กลับหน้าหลัก
      </Link>
    </div>
  );
}
