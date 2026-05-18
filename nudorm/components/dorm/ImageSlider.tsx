"use client";

import { useState } from "react";
import Image from "next/image";

export default function ImageSlider({ images, name }: { images: string[]; name: string }) {
  const [current, setCurrent] = useState(0);

  if (images.length === 0) {
    return (
      <div className="h-64 md:h-96 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center text-7xl mb-6">
        🏠
      </div>
    );
  }

  const prev = () => setCurrent((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setCurrent((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="relative mb-8 rounded-2xl overflow-hidden group" style={{ height: "440px" }}>
      {/* Images */}
      <div className="w-full h-full relative">
        <Image
          src={images[current]}
          alt={`${name} รูปที่ ${current + 1}`}
          fill
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 1280px) 100vw, 1024px"
          priority
        />
      </div>

      {/* ปุ่มซ้าย-ขวา (ซ่อนถ้ามีรูปเดียว) */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl transition-all opacity-0 group-hover:opacity-100"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl transition-all opacity-0 group-hover:opacity-100"
          >
            ›
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all ${
                  i === current ? "w-5 h-2 bg-white" : "w-2 h-2 bg-white/50"
                }`}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="absolute top-3 right-3 bg-black/40 text-white text-xs px-2.5 py-1 rounded-full">
            {current + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}
