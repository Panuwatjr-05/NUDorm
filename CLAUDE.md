# NUDorm — ระบบหาหอพักมหาวิทยาลัยนเรศวร

## ภาพรวมโปรเจค

เว็บแอปสำหรับนักศึกษา ม.นเรศวร ค้นหาและเปรียบเทียบหอพักรอบมหาวิทยาลัย และสำหรับเจ้าของหอพักลงประกาศและจัดการห้อง

**Tech Stack:**
- Frontend: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Backend: Next.js API Routes (หรือ Express ถ้าแยก server)
- Database: PostgreSQL + Prisma ORM
- Auth: NextAuth.js (JWT + session)
- Map: Leaflet.js (ฟรี, ไม่ต้องใช้ Google Maps API key)
- Storage: Cloudinary (รูปภาพหอพัก)
- Realtime: Pusher หรือ Socket.io (สถานะห้องว่าง/เต็ม, chat)
- Notification: Nodemailer (Email)
- Deployment: Vercel (frontend) + Railway หรือ Supabase (database)

---

## โครงสร้างโปรเจค

```
nudorm/
├── app/                        # Next.js App Router
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (student)/              # หน้าสำหรับนักศึกษา
│   │   ├── page.tsx            # หน้าค้นหาหอ (home)
│   │   ├── dorms/
│   │   │   ├── page.tsx        # รายการหอพัก + filter
│   │   │   └── [id]/page.tsx   # รายละเอียดหอ
│   │   ├── map/page.tsx        # แผนที่หอพัก
│   │   ├── compare/page.tsx    # เปรียบเทียบหอ
│   │   └── wishlist/page.tsx   # หอที่บันทึกไว้
│   ├── (owner)/                # หน้าสำหรับเจ้าของหอ
│   │   ├── dashboard/page.tsx
│   │   ├── listings/
│   │   │   ├── page.tsx        # รายการหอของตัวเอง
│   │   │   ├── new/page.tsx    # ลงประกาศหอใหม่
│   │   │   └── [id]/edit/page.tsx
│   │   └── inquiries/page.tsx  # รับสอบถาม
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── dorms/route.ts
│       ├── dorms/[id]/route.ts
│       ├── reviews/route.ts
│       ├── wishlist/route.ts
│       └── inquiries/route.ts
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── dorm/
│   │   ├── DormCard.tsx
│   │   ├── DormFilter.tsx
│   │   ├── DormMap.tsx
│   │   └── DormCompare.tsx
│   ├── review/
│   │   └── ReviewForm.tsx
│   └── layout/
│       ├── Navbar.tsx
│       └── Footer.tsx
├── lib/
│   ├── prisma.ts               # Prisma client singleton
│   ├── auth.ts                 # NextAuth config
│   └── cloudinary.ts
├── prisma/
│   └── schema.prisma
└── types/
    └── index.ts
```

---

## Database Schema (Prisma)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  role      Role     @default(STUDENT)
  phone     String?
  createdAt DateTime @default(now())

  dorms      Dorm[]
  reviews    Review[]
  wishlists  Wishlist[]
  inquiries  Inquiry[]  @relation("InquiryFrom")
}

enum Role {
  STUDENT
  OWNER
}

model Dorm {
  id          String   @id @default(cuid())
  name        String
  description String?
  price       Int
  priceMax    Int?
  type        DormType
  lat         Float
  lng         Float
  address     String
  phone       String?
  images      String[]
  amenities   String[]
  isAvailable Boolean  @default(true)
  ownerId     String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  owner     User       @relation(fields: [ownerId], references: [id])
  rooms     Room[]
  reviews   Review[]
  wishlists Wishlist[]
  inquiries Inquiry[]
}

enum DormType {
  FEMALE
  MALE
  MIXED
}

model Room {
  id          String  @id @default(cuid())
  dormId      String
  name        String
  price       Int
  isAvailable Boolean @default(true)

  dorm Dorm @relation(fields: [dormId], references: [id])
}

model Review {
  id        String   @id @default(cuid())
  dormId    String
  userId    String
  rating    Int
  comment   String
  createdAt DateTime @default(now())

  dorm Dorm @relation(fields: [dormId], references: [id])
  user User @relation(fields: [userId], references: [id])
}

model Wishlist {
  id     String @id @default(cuid())
  userId String
  dormId String

  user User @relation(fields: [userId], references: [id])
  dorm Dorm @relation(fields: [dormId], references: [id])

  @@unique([userId, dormId])
}

model Inquiry {
  id        String   @id @default(cuid())
  dormId    String
  fromId    String
  message   String
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())

  dorm Dorm @relation(fields: [dormId], references: [id])
  from User @relation("InquiryFrom", fields: [fromId], references: [id])
}
```

---

## Feature Map

### ฝั่งนักศึกษา

| Feature | รายละเอียด | Priority |
|---|---|---|
| ค้นหาและกรองหอ | กรองราคา, ระยะทาง, ประเภท, สิ่งอำนวยความสะดวก | P0 |
| ดูรายละเอียดหอ | รูป, ราคา, amenities, สถานะห้องว่าง | P0 |
| แผนที่หอพัก | แสดง pin หอรอบ ม.นเรศวร, คำนวณระยะทาง | P0 |
| เปรียบเทียบหอ | เลือก 2-3 หอมาดูside-by-side | P1 |
| Wishlist | บันทึกหอที่สนใจ | P1 |
| เขียน/อ่านรีวิว | ให้คะแนนและความคิดเห็น | P1 |
| ติดต่อเจ้าของหอ | ส่งข้อความผ่านระบบ | P2 |

### ฝั่งเจ้าของหอ

| Feature | รายละเอียด | Priority |
|---|---|---|
| ลงประกาศหอ | ชื่อ, รูป, ราคา, ตำแหน่ง GPS, amenities | P0 |
| จัดการสถานะห้อง | อัพเดทว่าง/เต็ม realtime | P0 |
| รับสอบถาม | inbox ข้อความจากนักศึกษา | P1 |
| Dashboard สถิติ | ยอดเข้าชม, จำนวนสอบถาม, คะแนน | P2 |

### ระบบกลาง

| Feature | รายละเอียด |
|---|---|
| Authentication | สมัคร/เข้าสู่ระบบ แยก role student/owner |
| Map & Location | Leaflet + OpenStreetMap, ระยะทางจาก ม.นเรศวร |
| Notification | Email แจ้งเตือนเมื่อมีข้อความใหม่ |

---

## ลำดับการพัฒนา (Phases)

### Phase 1 — Core (MVP)
1. ตั้ง project: `npx create-next-app@latest nudorm --typescript --tailwind --app`
2. ติดตั้ง dependencies: Prisma, NextAuth, Leaflet, shadcn/ui
3. สร้าง Database schema + migrate
4. Authentication (register/login, แยก role)
5. หน้าลงประกาศหอ (Owner)
6. หน้าค้นหา + รายการหอ (Student)
7. หน้ารายละเอียดหอ
8. แผนที่ Leaflet แสดงหอพัก

### Phase 2 — Engagement
9. ระบบรีวิวและให้คะแนน
10. Wishlist
11. เปรียบเทียบหอ side-by-side
12. ระบบ Inquiry (ส่งข้อความ)

### Phase 3 — Polish
13. Dashboard สถิติสำหรับเจ้าของหอ
14. Notification (Email)
15. Realtime สถานะห้อง
16. Mobile responsive + UX improvements

---

## คำสั่งที่ใช้บ่อย

```bash
# dev
npm run dev

# database
npx prisma migrate dev --name <migration-name>
npx prisma studio
npx prisma db seed

# build
npm run build
npm run start
```

---

## Environment Variables (.env.local)

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

---

## ข้อตกลงการเขียนโค้ด

- ใช้ TypeScript เสมอ ไม่ใช้ `any`
- Component ใช้ชื่อ PascalCase
- API route ใช้ชื่อ RESTful (GET/POST/PUT/DELETE)
- ใช้ server component เป็น default, ใช้ `"use client"` เฉพาะเมื่อจำเป็น
- Error handling ทุก API endpoint ต้องคืน `{ error: string }` พร้อม HTTP status ที่ถูกต้อง
- ภาพทุกรูปต้องผ่าน Cloudinary ไม่ store ใน public/
- ไม่ commit `.env.local` เด็ดขาด

---

## พิกัดอ้างอิง

มหาวิทยาลัยนเรศวร พิษณุโลก: `lat: 16.7459, lng: 100.1963`

ใช้เป็น center ของ map และจุดอ้างอิงคำนวณระยะทาง
