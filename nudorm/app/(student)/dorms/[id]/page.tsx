import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import ReviewForm from "@/components/review/ReviewForm";
import WishlistButton from "@/components/dorm/WishlistButton";
import ImageSlider from "@/components/dorm/ImageSlider";
import ReviewList from "@/components/review/ReviewList";

const TYPE_LABEL: Record<string, string> = {
  FEMALE: "หญิงล้วน",
  MALE: "ชายล้วน",
  MIXED: "ทั้งสองเพศ",
};


export default async function DormDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [dorm, session] = await Promise.all([
    prisma.dorm.findUnique({
      where: { id },
      include: {
        owner: { select: { name: true, phone: true, email: true } },
        rooms: true,
        reviews: {
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { wishlists: true } },
      },
    }),
    auth(),
  ]);

  if (!dorm) notFound();

  const avgRating =
    dorm.reviews.length > 0
      ? dorm.reviews.reduce((sum, r) => sum + r.rating, 0) / dorm.reviews.length
      : null;

  const isWishlisted = session
    ? !!(await prisma.wishlist.findUnique({
        where: { userId_dormId: { userId: session.user.id, dormId: id } },
      }))
    : false;

  const dormFull = dorm as typeof dorm & { lineId?: string | null; facebookUrl?: string | null; electricityRate?: number | null; waterRate?: number | null; deposit?: number | null };

  return (
    <div className="max-w-5xl mx-auto pb-16">
      {/* Image Slider */}
      <ImageSlider images={dorm.images} name={dorm.name} />

      {/* Title bar */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-2">
            {dorm.name}
          </h1>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dorm.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
          >
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            {dorm.address}
          </a>
        </div>
        {session && <WishlistButton dormId={dorm.id} initialSaved={isWishlisted} />}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

        {/* Left — main content */}
        <div className="lg:col-span-3 space-y-0">

          {/* Badges */}
          <div className="flex flex-wrap gap-2 pb-6 border-b border-gray-200">
            <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-sm font-semibold px-3 py-1.5 rounded-full">
              {TYPE_LABEL[dorm.type]}
            </span>
            <span className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full ${
              dorm.isAvailable ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
            }`}>
              <span className={`w-2 h-2 rounded-full ${dorm.isAvailable ? "bg-green-500" : "bg-red-400"}`} />
              {dorm.isAvailable ? "มีห้องว่าง" : "เต็มแล้ว"}
            </span>
            {avgRating && (
              <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 text-sm font-semibold px-3 py-1.5 rounded-full">
                ★ {avgRating.toFixed(1)}
                <span className="text-yellow-500 font-normal">({dorm.reviews.length} รีวิว)</span>
              </span>
            )}
          </div>

          {/* Description */}
          {dorm.description && (
            <div className="py-6 border-b border-gray-200">
              <h2 className="text-base font-bold text-gray-900 mb-2">รายละเอียด</h2>
              <p className="text-gray-600 leading-relaxed">{dorm.description}</p>
            </div>
          )}

          {/* Amenities */}
          {dorm.amenities.length > 0 && (
            <div className="py-6 border-b border-gray-200">
              <h2 className="text-base font-bold text-gray-900 mb-4">สิ่งอำนวยความสะดวก</h2>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                {dorm.amenities.map((a) => (
                  <div key={a} className="flex items-center gap-2.5 text-gray-700">
                    <svg className="w-4 h-4 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm font-medium">{a}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rooms */}
          {dorm.rooms.length > 0 && (
            <div className="py-6 border-b border-gray-200">
              <h2 className="text-base font-bold text-gray-900 mb-3">
                ห้องพัก
                <span className="ml-2 text-gray-400 font-normal text-sm">{dorm.rooms.length} ห้อง</span>
              </h2>
              <div className="divide-y divide-gray-100">
                {dorm.rooms.map((room) => (
                  <div key={room.id} className="flex items-center justify-between py-3.5">
                    <span className="text-gray-800 font-medium text-sm">{room.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-blue-700 font-bold text-sm">฿{room.price.toLocaleString()}<span className="font-normal text-gray-400">/เดือน</span></span>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full min-w-[40px] text-center ${
                        room.isAvailable ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}>
                        {room.isAvailable ? "ว่าง" : "เต็ม"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="py-6">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-base font-bold text-gray-900">รีวิว</h2>
              {avgRating && (
                <div className="flex items-center gap-1.5">
                  <span className="text-yellow-400 text-lg">★</span>
                  <span className="font-bold text-gray-800">{avgRating.toFixed(1)}</span>
                  <span className="text-gray-400 text-sm">· {dorm.reviews.length} รีวิว</span>
                </div>
              )}
            </div>

            {session && session.user.role === "STUDENT" && (
              <div className="mb-6 bg-gray-50 rounded-2xl p-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">เขียนรีวิว</p>
                <ReviewForm dormId={dorm.id} />
              </div>
            )}

            {dorm.reviews.length === 0 ? (
              <p className="text-gray-400 text-sm">ยังไม่มีรีวิว — เป็นคนแรกที่รีวิวหอนี้</p>
            ) : (
              <ReviewList reviews={dorm.reviews} />
            )}
          </div>
        </div>

        {/* Right — sidebar */}
        <div className="lg:col-span-2">
          <div className="sticky top-20 space-y-4">

            {/* Price card */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4">
                <p className="text-blue-200 text-xs font-medium mb-0.5">ราคาเริ่มต้น</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-bold text-white">฿{dorm.price.toLocaleString()}</span>
                  {dorm.priceMax && (
                    <span className="text-white/70 font-medium">– ฿{dorm.priceMax.toLocaleString()}</span>
                  )}
                  <span className="text-blue-200 text-sm">/เดือน</span>
                </div>
              </div>

              {/* Additional costs */}
              {(dormFull.electricityRate || dormFull.waterRate || dormFull.deposit) && (
                <div className="px-5 py-4 border-t border-gray-100 space-y-2.5">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">ค่าใช้จ่ายเพิ่มเติม</p>
                  {dormFull.electricityRate && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">ค่าไฟ</span>
                      <span className="font-semibold text-gray-800">฿{dormFull.electricityRate}/หน่วย</span>
                    </div>
                  )}
                  {dormFull.waterRate && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">ค่าน้ำ</span>
                      <span className="font-semibold text-gray-800">฿{dormFull.waterRate}/เดือน</span>
                    </div>
                  )}
                  {dormFull.deposit && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">เงินประกัน</span>
                      <span className="font-semibold text-gray-800">฿{dormFull.deposit.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Contact info */}
              <div className="p-5 space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">ติดต่อหอพัก</p>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold shrink-0">
                    {dorm.owner.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">เจ้าของ</p>
                    <p className="text-sm font-semibold text-gray-800">{dorm.owner.name}</p>
                  </div>
                </div>

                {dorm.phone && (
                  <div className="flex items-center gap-3 bg-blue-600 text-white font-semibold px-4 py-3 rounded-xl text-sm select-text">
                    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.47 11.47 0 003.58.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.47 11.47 0 00.57 3.58 1 1 0 01-.24 1.01l-2.21 2.2z"/>
                    </svg>
                    {dorm.phone}
                  </div>
                )}

                {dormFull.lineId && (
                  <div className="flex items-center gap-3 bg-green-50 border border-green-100 px-4 py-3 rounded-xl">
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="#06C755">
                      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.141h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                    </svg>
                    <span className="text-sm text-green-700 font-semibold">{dormFull.lineId}</span>
                  </div>
                )}

                {dormFull.facebookUrl && (
                  <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 px-4 py-3 rounded-xl">
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="#1877F2">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span className="text-sm text-blue-700 font-semibold truncate">{dormFull.facebookUrl}</span>
                  </div>
                )}

                {!dorm.phone && !dormFull.lineId && !dormFull.facebookUrl && (
                  <p className="text-sm text-gray-400 text-center py-2">ยังไม่มีข้อมูลการติดต่อ</p>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
