"use client";

import { useState } from "react";

interface Review {
  id: string;
  rating: number;
  comment: string;
  user: { name: string };
}

const SHOW_INITIAL = 3;

export default function ReviewList({ reviews }: { reviews: Review[] }) {
  const [expanded, setExpanded] = useState(false);

  const visible = expanded ? reviews : reviews.slice(0, SHOW_INITIAL);
  const hidden = reviews.length - SHOW_INITIAL;

  return (
    <div>
      <div className="space-y-4">
        {visible.map((review) => (
          <div key={review.id} className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-700 font-bold text-sm">
              {review.user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-800 text-sm">{review.user.name}</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span key={s} className={`text-sm ${s <= review.rating ? "text-yellow-400" : "text-gray-200"}`}>
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
            </div>
          </div>
        ))}
      </div>

      {reviews.length > SHOW_INITIAL && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-5 w-full py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-colors"
        >
          {expanded ? "ซ่อนรีวิว" : `ดูรีวิวทั้งหมด ${hidden} รายการ`}
        </button>
      )}
    </div>
  );
}
