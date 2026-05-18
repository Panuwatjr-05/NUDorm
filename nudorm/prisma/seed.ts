import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import bcrypt from "bcryptjs";
dotenv.config({ path: ".env.local" });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as never);

async function main() {
  // สร้าง owner สำหรับ seed
  const hashedPw = await bcrypt.hash("password123", 10);

  const owner = await prisma.user.upsert({
    where: { email: "seed-owner@nudorm.com" },
    update: {},
    create: {
      email: "seed-owner@nudorm.com",
      password: hashedPw,
      name: "ผู้ดูแลระบบ NUDorm",
      role: "OWNER",
      phone: "0812345678",
    },
  });

  const dorms = [
    {
      name: "หอพักลีลาวดี",
      description: "หอพักหญิงล้วน บรรยากาศร่มรื่น ปลอดภัย มีกล้องวงจรปิดทุกชั้น ใกล้ประตู 4 ม.นเรศวร เพียง 3 นาที",
      price: 3500,
      priceMax: 4500,
      type: "FEMALE" as const,
      lat: 16.7489,
      lng: 100.1923,
      address: "45/2 ถ.พิษณุโลก-นครสวรรค์ ต.ท่าโพธิ์ อ.เมือง พิษณุโลก",
      phone: "0812345001",
      lineId: "@leelavadee",
      facebookUrl: "facebook.com/leelavadeedorm",
      amenities: ["Wi-Fi", "แอร์", "เครื่องซักผ้า", "กล้องวงจรปิด", "ที่จอดรถ"],
      rooms: [
        { name: "ห้อง 101 (เตียงเดี่ยว)", price: 3500 },
        { name: "ห้อง 102 (เตียงคู่)", price: 4500 },
        { name: "ห้อง 201", price: 3500 },
        { name: "ห้อง 202", price: 4000 },
      ],
    },
    {
      name: "หอพักชบา",
      description: "หอพักหญิง ราคาประหยัด ห้องกว้างขวาง มีระเบียง ใกล้ 7-Eleven และร้านอาหาร",
      price: 2800,
      priceMax: 3200,
      type: "FEMALE" as const,
      lat: 16.7512,
      lng: 100.1978,
      address: "12 ซ.นเรศวร 3 ต.ท่าโพธิ์ อ.เมือง พิษณุโลก",
      phone: "0823456002",
      lineId: "@chabadorm",
      facebookUrl: null,
      amenities: ["Wi-Fi", "ตู้เย็น", "ที่จอดรถ", "สระว่ายน้ำ"],
      rooms: [
        { name: "ห้อง A1", price: 2800 },
        { name: "ห้อง A2", price: 3000 },
        { name: "ห้อง B1", price: 3200 },
      ],
    },
    {
      name: "หอพักทิพย์วารี",
      description: "หอพักหญิง ปลอดภัย 24 ชั่วโมง มีแม่บ้านทำความสะอาดห้องน้ำส่วนกลาง ห้องกว้างสะอาด",
      price: 4000,
      priceMax: 5000,
      type: "FEMALE" as const,
      lat: 16.7467,
      lng: 100.1901,
      address: "88 ถ.ประชาสงเคราะห์ ต.ท่าโพธิ์ อ.เมือง พิษณุโลก",
      phone: "0834567003",
      lineId: "@tipvaree",
      facebookUrl: "facebook.com/tipvareedorm",
      amenities: ["Wi-Fi", "แอร์", "ตู้เย็น", "กล้องวงจรปิด", "ฟิตเนส", "รปภ."],
      rooms: [
        { name: "ห้อง Standard", price: 4000 },
        { name: "ห้อง Deluxe", price: 5000 },
      ],
    },
    {
      name: "หอพักณัฐพล",
      description: "หอพักชายล้วน ราคาย่อมเยา ใกล้ประตู 1 ม.นเรศวร เดิน 5 นาที มีที่จอดรถมอเตอร์ไซค์ฟรี",
      price: 2500,
      priceMax: 3000,
      type: "MALE" as const,
      lat: 16.7445,
      lng: 100.1955,
      address: "33 ซ.เทพนิมิต ต.ท่าโพธิ์ อ.เมือง พิษณุโลก",
      phone: "0845678004",
      lineId: "@nattapondorm",
      facebookUrl: null,
      amenities: ["Wi-Fi", "ที่จอดรถ", "เครื่องซักผ้า"],
      rooms: [
        { name: "ห้อง 101", price: 2500 },
        { name: "ห้อง 102", price: 2500 },
        { name: "ห้อง 201", price: 3000 },
        { name: "ห้อง 202", price: 3000 },
        { name: "ห้อง 301", price: 2800 },
      ],
    },
    {
      name: "หอพักสมาร์ทบอยส์",
      description: "หอพักชาย อินเตอร์เน็ตแรง เหมาะสำหรับนักศึกษา IT ห้องนั่งเล่นส่วนกลางพร้อม Smart TV",
      price: 3200,
      priceMax: 3800,
      type: "MALE" as const,
      lat: 16.7503,
      lng: 100.2010,
      address: "67/4 ถ.บรมไตรโลกนาถ ต.ในเมือง อ.เมือง พิษณุโลก",
      phone: "0856789005",
      lineId: "@smartboys",
      facebookUrl: "facebook.com/smartboysdorm",
      amenities: ["Wi-Fi", "แอร์", "ตู้เย็น", "ที่จอดรถ", "กล้องวงจรปิด"],
      rooms: [
        { name: "ห้อง Standard ชั้น 2", price: 3200 },
        { name: "ห้อง Standard ชั้น 3", price: 3200 },
        { name: "ห้อง Premium", price: 3800 },
      ],
    },
    {
      name: "หอพักแกรนด์ วิว",
      description: "หอพักชาย วิวดี ห้องกว้าง มีระเบียงทุกห้อง บรรยากาศเงียบสงบ เหมาะสำหรับนักศึกษาที่ต้องการสมาธิ",
      price: 3500,
      priceMax: null,
      type: "MALE" as const,
      lat: 16.7430,
      lng: 100.1940,
      address: "120 ถ.พิษณุโลก-หล่มสัก ต.ท่าโพธิ์ อ.เมือง พิษณุโลก",
      phone: "0867890006",
      lineId: null,
      facebookUrl: "facebook.com/grandviewdorm",
      amenities: ["Wi-Fi", "แอร์", "ที่จอดรถ", "รปภ.", "สระว่ายน้ำ"],
      rooms: [
        { name: "ห้อง 201 วิวสวน", price: 3500 },
        { name: "ห้อง 301 วิวสวน", price: 3500 },
        { name: "ห้อง 401 วิว Top", price: 3500 },
      ],
    },
    {
      name: "หอพักนเรศวรเรสซิเดนซ์",
      description: "หอพักรวม ทั้งชายและหญิง แยกชั้น บริหารจัดการโดยมืออาชีพ สิ่งอำนวยความสะดวกครบครัน ใกล้ ม.นเรศวร 2 นาที",
      price: 4500,
      priceMax: 6000,
      type: "MIXED" as const,
      lat: 16.7471,
      lng: 100.1969,
      address: "1/9 ถ.มหาวิทยาลัย ต.ท่าโพธิ์ อ.เมือง พิษณุโลก",
      phone: "0878901007",
      lineId: "@nuresidence",
      facebookUrl: "facebook.com/nuresidence",
      amenities: ["Wi-Fi", "แอร์", "ตู้เย็น", "เครื่องซักผ้า", "ฟิตเนส", "กล้องวงจรปิด", "รปภ.", "ที่จอดรถ", "สระว่ายน้ำ"],
      rooms: [
        { name: "ห้อง Studio ชั้น 2", price: 4500 },
        { name: "ห้อง Studio ชั้น 3", price: 4500 },
        { name: "ห้อง Deluxe", price: 5500 },
        { name: "ห้อง Suite", price: 6000 },
      ],
    },
    {
      name: "หอพักซันไรส์",
      description: "หอพักรวม ราคาเริ่มต้นไม่แพง มีห้องหลายขนาดให้เลือก ทำเลดีใกล้ร้านอาหารและตลาด",
      price: 2600,
      priceMax: 3500,
      type: "MIXED" as const,
      lat: 16.7525,
      lng: 100.1948,
      address: "55 ซ.สุขสบาย ต.ท่าโพธิ์ อ.เมือง พิษณุโลก",
      phone: "0889012008",
      lineId: "@sunrisedorm",
      facebookUrl: null,
      amenities: ["Wi-Fi", "ที่จอดรถ", "ตู้เย็น", "กล้องวงจรปิด"],
      rooms: [
        { name: "ห้องเล็ก (A)", price: 2600 },
        { name: "ห้องกลาง (B)", price: 3000 },
        { name: "ห้องใหญ่ (C)", price: 3500 },
      ],
    },
    {
      name: "หอพักมณีนพรัตน์",
      description: "หอพักรวม สไตล์โมเดิร์น ตกแต่งสวยงาม มีร้านกาแฟในหอ เหมาะกับนักศึกษาที่ชอบบรรยากาศดีๆ",
      price: 5000,
      priceMax: 7000,
      type: "MIXED" as const,
      lat: 16.7458,
      lng: 100.1985,
      address: "200 ถ.พิษณุโลก-นครสวรรค์ ต.ท่าโพธิ์ อ.เมือง พิษณุโลก",
      phone: "0890123009",
      lineId: "@maneenop",
      facebookUrl: "facebook.com/maneenop",
      amenities: ["Wi-Fi", "แอร์", "ตู้เย็น", "เครื่องซักผ้า", "ฟิตเนส", "สระว่ายน้ำ", "รปภ.", "กล้องวงจรปิด", "ที่จอดรถ"],
      rooms: [
        { name: "ห้อง Deluxe Single", price: 5000 },
        { name: "ห้อง Deluxe Double", price: 6000 },
        { name: "ห้อง Premium Suite", price: 7000 },
      ],
    },
    {
      name: "หอพักเขียวขจี",
      description: "หอพักรวม ร่มรื่นด้วยต้นไม้ใหญ่ อากาศดี บรรยากาศเป็นธรรมชาติ ค่าเช่าไม่แพง เดินถึงประตูมหา'ลัย 7 นาที",
      price: 2200,
      priceMax: 2800,
      type: "MIXED" as const,
      lat: 16.7496,
      lng: 100.1930,
      address: "78/3 ซ.ร่มเย็น ต.ท่าโพธิ์ อ.เมือง พิษณุโลก",
      phone: "0801234010",
      lineId: "@kheaokajee",
      facebookUrl: null,
      amenities: ["Wi-Fi", "ที่จอดรถ", "เครื่องซักผ้า"],
      rooms: [
        { name: "ห้อง 101", price: 2200 },
        { name: "ห้อง 102", price: 2200 },
        { name: "ห้อง 201 (แอร์)", price: 2800 },
        { name: "ห้อง 202 (แอร์)", price: 2800 },
        { name: "ห้อง 301 (แอร์)", price: 2800 },
      ],
    },
  ];

  for (const d of dorms) {
    const { rooms, ...dormData } = d;
    const created = await prisma.dorm.create({
      data: {
        ...dormData,
        images: [],
        isAvailable: true,
        ownerId: owner.id,
      },
    });
    await prisma.room.createMany({
      data: rooms.map((r) => ({ ...r, dormId: created.id, isAvailable: true })),
    });
    console.log(`✓ สร้าง: ${created.name}`);
  }

  console.log("\n✅ Seed สำเร็จ! สร้างหอพักทั้งหมด", dorms.length, "แห่ง");
}

main().catch(console.error).finally(() => (prisma as PrismaClient).$disconnect());
