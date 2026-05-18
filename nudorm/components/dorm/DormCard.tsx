import Link from "next/link";
import Image from "next/image";
import { DormWithOwner } from "@/types";

const TYPE_LABEL: Record<string, string> = {
  FEMALE: "หญิงล้วน",
  MALE: "ชายล้วน",
  MIXED: "ทั้งสองเพศ",
};

const TYPE_COLOR: Record<string, string> = {
  FEMALE: "bg-pink-100 text-pink-700",
  MALE: "bg-blue-100 text-blue-700",
  MIXED: "bg-purple-100 text-purple-700",
};

export default function DormCard({ dorm }: { dorm: DormWithOwner }) {
  return (
    <Link href={`/dorms/${dorm.id}`} className="block group">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        {/* Image placeholder */}
        <div className="h-44 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-4xl relative overflow-hidden">
          {dorm.images[0] ? (
            <Image src={dorm.images[0]} alt={dorm.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
          ) : (
            "🏠"
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-1">
              {dorm.name}
            </h3>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${TYPE_COLOR[dorm.type]}`}>
              {TYPE_LABEL[dorm.type]}
            </span>
          </div>

          <p className="text-gray-400 text-xs mb-3 line-clamp-1">{dorm.address}</p>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-blue-700 font-bold text-lg">
                ฿{dorm.price.toLocaleString()}
              </span>
              {dorm.priceMax && (
                <span className="text-gray-400 text-sm">–{dorm.priceMax.toLocaleString()}</span>
              )}
              <span className="text-gray-400 text-xs">/เดือน</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              {dorm.avgRating ? (
                <>
                  <span className="text-yellow-400">★</span>
                  <span className="text-gray-700 font-medium">{dorm.avgRating.toFixed(1)}</span>
                  <span className="text-gray-400 text-xs">({dorm._count?.reviews})</span>
                </>
              ) : (
                <span className="text-gray-400 text-xs">ยังไม่มีรีวิว</span>
              )}
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${dorm.isAvailable ? "bg-green-500" : "bg-gray-300"}`}
            />
            <span className="text-xs text-gray-500">
              {dorm.isAvailable ? "มีห้องว่าง" : "เต็มแล้ว"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
