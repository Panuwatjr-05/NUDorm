# NUDorm — ระบบหาหอพักมหาวิทยาลัยนเรศวร

แพลตฟอร์มค้นหาและเปรียบเทียบหอพักรอบมหาวิทยาลัยนเรศวร รองรับทั้งนักศึกษาและเจ้าของหอพัก

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router) + TypeScript + Tailwind CSS |
| Backend | Next.js API Routes |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth.js v5 (Credentials) |
| Map | Leaflet.js + React-Leaflet (OpenStreetMap) |
| Storage | Cloudinary |
| Deploy | Vercel + Railway/Supabase |

เปิด [http://localhost:3000](http://localhost:3000)

## บัญชีทดสอบ

| บทบาท | อีเมล | รหัสผ่าน |
|-------|-------|---------|
| นักศึกษา | student@test.com | password123 |
| เจ้าของหอ | owner@test.com | password123 |
| Admin | admin@test.com | password123 |

## โครงสร้างไฟล์

```
nudorm/
├── app/
│   ├── api/
│   │   ├── auth/          # NextAuth + Register
│   │   ├── dorms/         # CRUD หอพัก + เปรียบเทียบ
│   │   ├── rooms/         # จัดการห้อง
│   │   ├── reviews/       # รีวิว
│   │   ├── wishlist/      # รายการโปรด
│   │   ├── upload/        # อัปโหลดรูป Cloudinary
│   │   ├── users/me/      # ข้อมูลผู้ใช้
│   │   └── admin/         # จัดการระบบ
│   ├── (auth)/            # Login, Register
│   ├── (student)/         # หน้านักศึกษา
│   │   ├── dorms/         # รายการหอ + รายละเอียด
│   │   ├── compare/       # เปรียบเทียบหอ
│   │   └── wishlist/      # หอที่บันทึกไว้
│   ├── (owner)/           # หน้าเจ้าของหอ
│   │   ├── dashboard/     # ภาพรวม
│   │   ├── listings/      # ลงประกาศ + แก้ไขหอ
│   │   ├── inquiries/     # รับสอบถาม
│   │   └── feedback/      # รีวิวที่ได้รับ
│   ├── admin/             # Admin Dashboard
│   └── profile/           # โปรไฟล์ผู้ใช้
├── components/            # Shared Components
├── lib/                   # Prisma, Auth, Cloudinary
├── prisma/
│   └── schema.prisma      # Database Schema
└── types/                 # TypeScript Interfaces
```

## Features

### นักศึกษา (Student)
- ค้นหาและกรองหอพักตามราคา, ระยะทาง, ประเภท, สิ่งอำนวยความสะดวก
- ดูรายละเอียดหอพัก: รูปภาพ, ราคา, amenities, สถานะห้องว่าง
- แผนที่ Leaflet แสดง pin หอรอบมหาวิทยาลัย
- เปรียบเทียบหอพัก 2-3 แห่งแบบ Side-by-side
- Wishlist บันทึกหอที่สนใจ
- เขียนและอ่านรีวิว

### เจ้าของหอ (Owner)
- Dashboard สรุปข้อมูลหอพักของตัวเอง
- ลงประกาศหอใหม่พร้อมอัปโหลดรูปผ่าน Cloudinary
- แก้ไขข้อมูลหอและจัดการสถานะห้องว่าง/เต็ม
- รับและดูข้อความสอบถามจากนักศึกษา
- ดูรีวิวที่ได้รับ

### แอดมิน (Admin)
- ดูและจัดการหอพักทั้งหมดในระบบ

## พิกัดอ้างอิง

มหาวิทยาลัยนเรศวร พิษณุโลก: `lat: 16.7459, lng: 100.1963`

ใช้เป็น center ของแผนที่และจุดอ้างอิงคำนวณระยะทาง

## คำสั่งที่ใช้บ่อย

```bash
npm run dev                                    # เริ่ม dev server
npm run build                                  # build production
npx prisma migrate dev --name <ชื่อ migration> # อัพเดท schema
npx prisma studio                              # เปิด DB GUI
```

---

Built with Next.js 16 + PostgreSQL + Leaflet สำหรับนักศึกษา ม.นเรศวร
