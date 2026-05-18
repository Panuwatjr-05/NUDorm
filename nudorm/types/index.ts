import { DormType, Role } from "@prisma/client";

export type { DormType, Role };

export interface DormWithOwner {
  id: string;
  name: string;
  description: string | null;
  price: number;
  priceMax: number | null;
  type: DormType;
  lat: number;
  lng: number;
  address: string;
  phone: string | null;
  images: string[];
  amenities: string[];
  isAvailable: boolean;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  owner: { name: string; phone: string | null };
  _count?: { reviews: number; wishlists: number };
  avgRating?: number;
}

export interface DormFilters {
  search?: string;
  type?: DormType;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
  isAvailable?: boolean;
}

export const NU_CENTER = { lat: 16.7459, lng: 100.1963 };

export const AMENITIES_LIST = [
  "Wi-Fi",
  "ที่จอดรถ",
  "เครื่องซักผ้า",
  "แอร์",
  "ตู้เย็น",
  "เฟอร์นิเจอร์",
  "รปภ.",
  "กล้องวงจรปิด",
  "สระว่ายน้ำ",
  "ฟิตเนส",
];
