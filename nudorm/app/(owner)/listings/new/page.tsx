"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { AMENITIES_LIST, NU_CENTER } from "@/types";

interface Room {
  name: string;
  price: string;
}

export default function NewListingPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    priceMax: "",
    type: "MIXED",
    lat: NU_CENTER.lat.toString(),
    lng: NU_CENTER.lng.toString(),
    address: "",
    phone: "",
    lineId: "",
    facebookUrl: "",
    amenities: [] as string[],
  });
  const [images, setImages] = useState<string[]>([]);
  const [rooms, setRooms] = useState<Room[]>([{ name: "", price: "" }]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mapsUrl, setMapsUrl] = useState("");
  const [mapsStatus, setMapsStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function resolveMaps() {
    if (!mapsUrl.trim()) return;
    setMapsStatus("loading");
    const res = await fetch("/api/resolve-maps", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: mapsUrl.trim() }),
    });
    const data = await res.json();
    if (res.ok) {
      setForm((prev) => ({ ...prev, lat: data.lat.toString(), lng: data.lng.toString() }));
      setMapsStatus("ok");
    } else {
      setMapsStatus("error");
    }
  }

  function toggleAmenity(a: string) {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(a)
        ? prev.amenities.filter((x) => x !== a)
        : [...prev.amenities, a],
    }));
  }

  async function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) setImages((prev) => [...prev, data.url]);
    }
    setUploading(false);
    e.target.value = "";
  }

  function removeImage(idx: number) {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  }

  function addRoom() {
    setRooms((prev) => [...prev, { name: "", price: "" }]);
  }

  function removeRoom(idx: number) {
    setRooms((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateRoom(idx: number, field: keyof Room, value: string) {
    setRooms((prev) => prev.map((r, i) => (i === idx ? { ...r, [field]: value } : r)));
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const validRooms = rooms.filter((r) => r.name.trim() && r.price);

    const res = await fetch("/api/dorms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, images, rooms: validRooms }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "เกิดข้อผิดพลาด");
      return;
    }

    router.push(`/dorms/${data.id}`);
  }

  const inputClass = "w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors bg-white";

  const field = (label: string, el: React.ReactNode) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      {el}
    </div>
  );

  const input = (key: keyof typeof form, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <input
      value={form[key] as string}
      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
      className={inputClass}
      {...props}
    />
  );

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">ลงประกาศหอพัก</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
        {field("ชื่อหอพัก *", input("name", { required: true, placeholder: "หอพักสมชาย" }))}

        {field("รายละเอียด", (
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            placeholder="อธิบายหอพักของคุณ..."
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:border-blue-500 transition-colors bg-white"
          />
        ))}

        {/* Image Upload */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">รูปภาพหอพัก</p>
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-3">
              {images.map((url, i) => (
                <div key={i} className="relative group">
                  <img src={url} alt={`รูป ${i + 1}`} className="h-28 w-full object-cover rounded-xl" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 border-2 border-dashed border-gray-300 rounded-xl px-5 py-4 text-base text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors disabled:opacity-50 w-full justify-center"
          >
            {uploading ? "กำลังอัพโหลด..." : "📷  เพิ่มรูปภาพ"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageFile}
          />
          <p className="text-xs text-gray-400 mt-1">เลือกได้หลายรูปพร้อมกัน • รองรับ JPG, PNG ไม่เกิน 10MB/รูป</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {field("ราคาเริ่มต้น (บาท/เดือน) *", input("price", { required: true, type: "number", min: "0", placeholder: "3000" }))}
          {field("ราคาสูงสุด (ถ้ามี)", input("priceMax", { type: "number", min: "0", placeholder: "5000" }))}
        </div>

        {field("ประเภทหอ *", (
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: "FEMALE", label: "หญิงล้วน" },
              { value: "MALE", label: "ชายล้วน" },
              { value: "MIXED", label: "ทั้งสองเพศ" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm({ ...form, type: opt.value })}
                className={`py-3 rounded-xl border-2 text-base font-medium transition-colors ${
                  form.type === opt.value
                    ? "border-blue-700 bg-blue-50 text-blue-700"
                    : "border-gray-200 text-gray-700 hover:border-blue-400"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        ))}

        {field("ที่อยู่ *", input("address", { required: true, placeholder: "99 ถ.พิษณุโลก-นครสวรรค์ ต.ท่าโพธิ์..." }))}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">ลิ้งค์ Google Maps *</label>
          <div className="flex gap-2">
            <input
              value={mapsUrl}
              onChange={(e) => { setMapsUrl(e.target.value); setMapsStatus("idle"); }}
              placeholder="https://maps.app.goo.gl/..."
              className={inputClass}
            />
            <button
              type="button"
              onClick={resolveMaps}
              disabled={mapsStatus === "loading"}
              className="shrink-0 px-4 py-3 bg-blue-700 text-white rounded-xl text-sm font-semibold hover:bg-blue-800 transition-colors disabled:opacity-50"
            >
              {mapsStatus === "loading" ? "..." : "ดึงพิกัด"}
            </button>
          </div>
          {mapsStatus === "ok" && (
            <p className="text-xs text-green-600 mt-1.5">✓ พิกัด {parseFloat(form.lat).toFixed(5)}, {parseFloat(form.lng).toFixed(5)}</p>
          )}
          {mapsStatus === "error" && (
            <p className="text-xs text-red-500 mt-1.5">ไม่พบพิกัด ลองคัดลอกลิ้งค์ Google Maps ใหม่อีกครั้ง</p>
          )}
        </div>

        {field("เบอร์โทรศัพท์", input("phone", { type: "tel", placeholder: "08x-xxx-xxxx" }))}

        <div className="grid grid-cols-2 gap-4">
          {field("LINE ID", input("lineId", { placeholder: "@nudorm หรือ nudorm66" }))}
          {field("Facebook URL", input("facebookUrl", { placeholder: "facebook.com/yourpage" }))}
        </div>

        {/* Rooms */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-700">จำนวนห้องพัก</p>
            <button
              type="button"
              onClick={addRoom}
              className="text-sm text-blue-700 font-semibold hover:text-blue-800"
            >
              + เพิ่มห้อง
            </button>
          </div>
          <div className="space-y-2">
            {rooms.map((room, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  placeholder={`ชื่อห้อง เช่น ห้อง ${i + 101}`}
                  value={room.name}
                  onChange={(e) => updateRoom(i, "name", e.target.value)}
                  className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors bg-white"
                />
                <input
                  placeholder="ราคา/เดือน"
                  type="number"
                  min="0"
                  value={room.price}
                  onChange={(e) => updateRoom(i, "price", e.target.value)}
                  className="w-36 border-2 border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors bg-white"
                />
                {rooms.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRoom(i)}
                    className="text-gray-400 hover:text-red-500 text-xl px-1 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-1">ข้ามได้ถ้ายังไม่มีข้อมูลห้อง</p>
        </div>

        {/* Amenities */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">สิ่งอำนวยความสะดวก</p>
          <div className="flex flex-wrap gap-2">
            {AMENITIES_LIST.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => toggleAmenity(a)}
                className={`text-sm px-3 py-1.5 rounded-full border-2 font-medium transition-colors ${
                  form.amenities.includes(a)
                    ? "border-blue-700 bg-blue-50 text-blue-700"
                    : "border-gray-200 text-gray-700 hover:border-blue-400"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading || uploading}
          className="w-full bg-blue-700 text-white py-3 rounded-xl text-base font-semibold hover:bg-blue-800 transition-colors disabled:opacity-50"
        >
          {loading ? "กำลังบันทึก..." : "ลงประกาศ"}
        </button>
      </form>
    </div>
  );
}
