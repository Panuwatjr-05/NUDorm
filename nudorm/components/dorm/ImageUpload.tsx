"use client";

import { useState, useRef } from "react";

interface Props {
  dormId: string;
  currentImages: string[];
  onUpload: (url: string) => void;
}

export default function ImageUpload({ dormId, currentImages, onUpload }: Props) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string[]>(currentImages);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("dormId", dormId);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    setUploading(false);

    if (data.url) {
      setPreview((prev) => [...prev, data.url]);
      onUpload(data.url);
    }
  }

  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-2">รูปภาพหอพัก</p>

      {/* Preview grid */}
      {preview.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {preview.map((url, i) => (
            <img key={i} src={url} alt={`รูป ${i + 1}`} className="h-24 w-full object-cover rounded-lg" />
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2 border-2 border-dashed border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors disabled:opacity-50"
      >
        {uploading ? "กำลังอัพโหลด..." : "+ เพิ่มรูปภาพ"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
      <p className="text-xs text-gray-400 mt-1">รองรับ JPG, PNG ขนาดไม่เกิน 10MB</p>
    </div>
  );
}
