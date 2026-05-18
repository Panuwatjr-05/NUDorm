import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { url } = await req.json();
  if (!url) return NextResponse.json({ error: "ไม่มี URL" }, { status: 400 });

  try {
    const res = await fetch(url, { redirect: "follow", method: "HEAD" });
    const finalUrl = res.url;

    const coords = extractCoords(finalUrl);
    if (coords) return NextResponse.json(coords);

    // Some redirects need GET to resolve fully
    const res2 = await fetch(url, { redirect: "follow" });
    const finalUrl2 = res2.url;
    const coords2 = extractCoords(finalUrl2);
    if (coords2) return NextResponse.json(coords2);

    return NextResponse.json({ error: "ไม่พบพิกัดใน URL นี้" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "ไม่สามารถอ่าน URL ได้" }, { status: 400 });
  }
}

function extractCoords(url: string): { lat: number; lng: number } | null {
  // Format: /@lat,lng,zoom
  const atMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (atMatch) {
    return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
  }

  // Format: ?q=lat,lng or &q=lat,lng
  const qMatch = url.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (qMatch) {
    return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };
  }

  // Format: ?ll=lat,lng
  const llMatch = url.match(/[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (llMatch) {
    return { lat: parseFloat(llMatch[1]), lng: parseFloat(llMatch[2]) };
  }

  return null;
}
