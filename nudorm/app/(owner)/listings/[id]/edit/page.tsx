"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AMENITIES_LIST } from "@/types";
import { use } from "react";
import ImageUpload from "@/components/dorm/ImageUpload";

const inputClass = "w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors bg-white";
const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

export default function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    address: "",
    lat: "",
    lng: "",
    lineId: "",
    facebookUrl: "",
    isAvailable: true,
    amenities: [] as string[],
    images: [] as string[],
  });
  const [mapsUrl, setMapsUrl] = useState("");
  const [mapsStatus, setMapsStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [rooms, setRooms] = useState<{ id: string; name: string; price: number; isAvailable: boolean }[]>([]);
  const [newRoom, setNewRoom] = useState({ name: "", price: "" });
  const [addingRoom, setAddingRoom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetch(`/api/dorms/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setForm({
          name: data.name ?? "",
          description: data.description ?? "",
          price: data.price?.toString() ?? "",
          address: data.address ?? "",
          lat: data.lat?.toString() ?? "",
          lng: data.lng?.toString() ?? "",
          lineId: data.lineId ?? "",
          facebookUrl: data.facebookUrl ?? "",
          isAvailable: data.isAvailable ?? true,
          amenities: data.amenities ?? [],
          images: data.images ?? [],
        });
        setRooms(data.rooms ?? []);
        setFetching(false);
      });
  }, [id]);

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

  async function addRoom() {
    if (!newRoom.name || !newRoom.price) return;
    setAddingRoom(true);
    const res = await fetch(`/api/dorms/${id}/rooms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRoom),
    });
    const room = await res.json();
    setRooms((prev) => [...prev, room]);
    setNewRoom({ name: "", price: "" });
    setAddingRoom(false);
  }

  async function deleteRoom(roomId: string) {
    await fetch(`/api/rooms/${roomId}`, { method: "DELETE" });
    setRooms((prev) => prev.filter((r) => r.id !== roomId));
  }

  async function toggleRoomAvailability(roomId: string, current: boolean) {
    await fetch(`/api/rooms/${roomId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: !current }),
    });
    setRooms((prev) => prev.map((r) => r.id === roomId ? { ...r, isAvailable: !current } : r));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    await fetch(`/api/dorms/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    router.push("/dashboard");
  }

  if (fetching) return <div className="text-center py-20 text-gray-400">กำลังโหลด...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">แก้ไขหอพัก</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">

        <div>
          <label className={labelClass}>ชื่อหอพัก</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>รายละเอียด</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:border-blue-500 transition-colors bg-white"
          />
        </div>

        <div>
          <label className={labelClass}>ราคา (บาท/เดือน)</label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>ที่อยู่</label>
          <input
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="99 ถ.พิษณุโลก-นครสวรรค์ ต.ท่าโพธิ์..."
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>ลิ้งค์ Google Maps</label>
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
          {mapsStatus === "idle" && form.lat && form.lng && (
            <p className="text-xs text-gray-400 mt-1.5">พิกัดปัจจุบัน {parseFloat(form.lat).toFixed(5)}, {parseFloat(form.lng).toFixed(5)}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>LINE ID</label>
            <input
              value={form.lineId}
              onChange={(e) => setForm({ ...form, lineId: e.target.value })}
              placeholder="@nudorm"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Facebook URL</label>
            <input
              value={form.facebookUrl}
              onChange={(e) => setForm({ ...form, facebookUrl: e.target.value })}
              placeholder="facebook.com/yourpage"
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="available"
            checked={form.isAvailable}
            onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
            className="w-5 h-5 accent-blue-700"
          />
          <label htmlFor="available" className="text-base font-medium text-gray-700">มีห้องว่างอยู่</label>
        </div>

        <div>
          <p className={labelClass}>สิ่งอำนวยความสะดวก</p>
          <div className="flex flex-wrap gap-2">
            {AMENITIES_LIST.map((a) => (
              <button key={a} type="button" onClick={() => toggleAmenity(a)}
                className={`text-sm px-3 py-1.5 rounded-full border-2 font-medium transition-colors ${
                  form.amenities.includes(a)
                    ? "border-blue-700 bg-blue-50 text-blue-700"
                    : "border-gray-200 text-gray-700 hover:border-blue-400"
                }`}>
                {a}
              </button>
            ))}
          </div>
        </div>

        <ImageUpload
          dormId={id}
          currentImages={form.images}
          onUpload={(url) => setForm((prev) => ({ ...prev, images: [...prev.images, url] }))}
        />

        {/* Rooms */}
        <div>
          <p className={labelClass}>ห้องพัก ({rooms.length} ห้อง)</p>

          {/* Room list */}
          {rooms.length > 0 && (
            <div className="mb-3 divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
              {rooms.map((room) => (
                <div key={room.id} className="flex items-center justify-between px-4 py-3 bg-white">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{room.name}</p>
                    <p className="text-xs text-gray-400">฿{room.price.toLocaleString()}/เดือน</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleRoomAvailability(room.id, room.isAvailable)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                        room.isAvailable
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {room.isAvailable ? "ว่าง" : "เต็ม"}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteRoom(room.id)}
                      className="text-xs px-3 py-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors font-medium"
                    >
                      ลบ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add room */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newRoom.name}
              onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
              placeholder="ชื่อห้อง เช่น ห้อง 101"
              className="flex-1 border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <input
              type="number"
              value={newRoom.price}
              onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })}
              placeholder="ราคา"
              className="w-28 border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button
              type="button"
              onClick={addRoom}
              disabled={addingRoom || !newRoom.name || !newRoom.price}
              className="shrink-0 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              + เพิ่ม
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-blue-700 text-white py-3 rounded-xl text-base font-semibold hover:bg-blue-800 transition-colors disabled:opacity-50">
          {loading ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
        </button>
      </form>
    </div>
  );
}
