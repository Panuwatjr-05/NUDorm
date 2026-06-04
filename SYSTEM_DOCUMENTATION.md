# เอกสารอธิบายระบบ NUDorm

## 1. ชื่อและวัตถุประสงค์โปรเจค

**ชื่อโปรเจค:** NUDorm — ระบบหาหอพักมหาวิทยาลัยนเรศวร

**วัตถุประสงค์:**
เว็บแอปลิเคชันเพื่อช่วยนักศึกษามหาวิทยาลัยนเรศวร ในการค้นหา เปรียบเทียบ และติดต่อหอพักรอบมหาวิทยาลัย และช่วยเจ้าของหอพักในการลงประกาศ จัดการห้อง และรับการสอบถามจากผู้ที่สนใจ

---

## 2. Technology Stack (สแต็กเทคโนโลยี)

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Map Library:** Leaflet.js + OpenStreetMap (ไม่ต้องใช้ API key)

### Backend
- **Framework:** Next.js API Routes
- **ORM:** Prisma
- **Database:** PostgreSQL

### Authentication & Security
- **Auth Framework:** NextAuth.js
- **Token Type:** JWT + Session-based
- **Password Handling:** bcryptjs (ซ่อนรหัสผ่าน)

### External Services
- **Image Storage:** Cloudinary (เก็บรูปภาพหอพัก)
- **Email:** Nodemailer (ส่งอีเมลแจ้งเตือน)
- **Real-time (Optional):** Pusher หรือ Socket.io
- **Deployment:** Vercel (Frontend) + Railway/Supabase (Database)

### Development Tools
- **Version Control:** Git
- **Package Manager:** npm
- **Build Tool:** Next.js (Built-in)
- **Database Migration:** Prisma Migrate

---

## 3. ประเภทผู้ใช้และบทบาท

ระบบนี้มี **3 ประเภทผู้ใช้:**

### 3.1 นักศึกษา (Student Role)

**คำนิยาม:** ผู้ใช้ที่เป็นนักศึกษาของมหาวิทยาลัยนเรศวร และต้องการค้นหาหอพัก

**สิทธิ์และหน้าที่:**
- ค้นหาและกรองหอพัก (ราคา ระยะทาง ประเภท amenities)
- ดูรายละเอียดหอพัก (รูปภาพ ราคา สิ่งอำนวยความสะดวก สถานะห้อง)
- ดูตำแหน่งหอพักบนแผนที่
- เปรียบเทียบหอพัก 2-3 แห่ง side-by-side
- บันทึกหอพักที่สนใจไว้ (Wishlist)
- เขียนรีวิวและให้คะแนนหอพัก
- ติดต่อเจ้าของหอ (ส่งข้อความผ่านระบบ)
- ดูประวัติการสอบถามของตัวเอง

---

### 3.2 เจ้าของหอพัก (Owner Role)

**คำนิยาม:** เจ้าของหรือผู้จัดการหอพักที่ต้องการลงประกาศและจัดการห้องพักของตัวเอง

**สิทธิ์และหน้าที่:**
- ลงประกาศหอพัก (ชื่อ รูปภาพ ราคา ตำแหน่ง GPS สิ่งอำนวยความสะดวก)
- จัดการรายชื่อหอพักของตัวเอง (เพิ่ม/แก้ไข/ลบ)
- อัพเดทสถานะห้องว่าง/เต็ม แบบ Real-time
- ดูและจัดการห้องแต่ละห้องในหอของตัวเอง
- รับสอบถามจากนักศึกษา (Inquiry Inbox)
- ตอบสอบถามและติดต่อนักศึกษา
- ดูสถิติและ Dashboard (ยอดเข้าชม จำนวนสอบถาม คะแนนรีวิว)
- ดูคำรีวิวและคะแนนที่ได้รับจากนักศึกษา

---

### 3.3 ผู้ดูแลระบบ (Admin Role)

**คำนิยาม:** ผู้ดูแลระบบที่มีสิทธิ์จัดการระบบทั้งหมด (ไม่มีการ self-register มี supervisor สร้าง)

**สิทธิ์และหน้าที่:**
- ดูรายชื่อหอพักทั้งหมดในระบบ
- ดูหน่วยลบหอพัก (ลบหอที่ฝ่ายฝ่ายเนื้อหา, โปรแกรม, หรือ ฝ่ายข้อบ่นร้องขาวออก)
- ดูรายชื่อผู้ใช้ทั้งหมด (นักศึกษา, เจ้าของหอ, Admin)
- ดูสถิติระบบ:
  - จำนวนหอพักทั้งหมด
  - จำนวนผู้ใช้ทั้งหมด
  - จำนวนนักศึกษา
  - จำนวนเจ้าของหอ
  - จำนวนรีวิว และจำนวนบันทึกต่อหอ
- ดูข้อมูลผู้ใช้ (ชื่อ, อีเมล, Role, วันที่สมัคร)
- ดูและจัดการข้อมูลเมตาของหอพัก (ที่อยู่, เจ้าของ, สถานะ)
- เข้าถึง Admin Panel พิเศษ (/admin)

---

## 4. ความสามารถของระบบ (Features)

### ฝั่งนักศึกษา

#### 4.1 ค้นหาและกรองหอพัก (Search & Filter)
- **ที่ตั้ง:** ค้นหาหอรอบมหาวิทยาลัย
- **ราคา:** กรองตามช่วงราคา (min-max)
- **ประเภท:** กรองตามประเภท (หญิง ชาย ผสม)
- **ระยะทาง:** คำนวณระยะทางจากมหาวิทยาลัย
- **Amenities:** กรองตามสิ่งอำนวยความสะดวก (Wi-Fi, เอแอร์, น้ำอุ่น ฯลฯ)
- **สถานะห้อง:** แสดงว่าห้องว่างหรือเต็ม

#### 4.2 ดูรายละเอียดหอ (Dorm Detail)
- **ข้อมูลหลัก:** ชื่อ ราคา ประเภท ที่อยู่
- **รูปภาพ:** สไลด์แสดงรูปภาพหอพัก (จากกรรมการขึ้นโดย Owner)
- **สิ่งอำนวยความสะดวก:** รายการ amenities ที่มี
- **สถานะห้อง:** แสดงจำนวนห้องว่าง/เต็ม
- **ติดต่อ:** เบอร์โทรศัพท์เจ้าของหอ
- **รีวิว:** แสดงรีวิวและคะแนนจากนักศึกษาอื่น

#### 4.3 แผนที่หอพัก (Map View)
- **การแสดงผล:** Pin ของหอพักทั้งหมดบนแผนที่
- **Center:** จุดกึ่งกลางที่มหาวิทยาลัยนเรศวร (lat: 16.7459, lng: 100.1963)
- **ระยะทาง:** คำนวณระยะทางจากมหาวิทยาลัยถึงแต่ละหอ
- **Interactive:** คลิก pin เพื่อดูรายละเอียด

#### 4.4 เปรียบเทียบหอ (Compare)
- เลือกหอพัก 2-3 แห่งมาเปรียบเทียบ Side-by-Side
- เมื่อเทียบจะแสดง: ราคา, amenities, ระยะทาง, คะแนนรีวิว

#### 4.5 Wishlist (บันทึกหอ)
- บันทึกหอพักที่สนใจ
- ดูรายการหอที่บันทึกไว้ทั้งหมด
- ลบหอออกจาก Wishlist

#### 4.6 รีวิวและให้คะแนน (Review & Rating)
- ให้คะแนนหอพัก 1-5 ดาว
- เขียนความเห็นเพิ่มเติม
- ดูรีวิวจากนักศึกษาคนอื่น
- ลบรีวิวของตัวเอง

#### 4.7 ติดต่อเจ้าของหอ (Inquiry)
- ส่งข้อความสอบถามไปยังเจ้าของหอ
- ดูประวัติการสอบถาม
- ได้รับการตอบกลับจากเจ้าของหอ

---

### ฝั่งเจ้าของหอพัก

#### 4.8 ลงประกาศหอพัก (Create Listing)
- **ข้อมูลหลัก:** ชื่อหอ, ประเภท (หญิง/ชาย/ผสม), รายละเอียด
- **ราคา:** ราคาต่ำสุด, ราคาสูงสุด (หากมีห้องหลายประเภท)
- **ตำแหน่ง:** ใส่พิกัด GPS (latitude, longitude)
- **ที่อยู่:** ที่อยู่เต็มเพื่อแสดงผล
- **รูปภาพ:** อัพโหลดหลายรูปผ่าน Cloudinary
- **Amenities:** เลือกสิ่งอำนวยความสะดวก (Wi-Fi, เอแอร์, ห้องน้ำร่วม, ห้องอาหาร ฯลฯ)
- **เบอร์ติดต่อ:** เบอร์โทรศัพท์สำหรับติดต่อ

#### 4.9 จัดการห้องพัก (Room Management)
- **เพิ่มห้อง:** สร้างห้องใหม่พร้อมชื่อ ราคา
- **อัพเดทสถานะ:** เปลี่ยนสถานะห้องจาก "ว่าง" เป็น "เต็ม" แบบ Real-time
- **แก้ไข:** แก้ไขข้อมูลห้อง (ชื่อ, ราคา)
- **ลบ:** ลบห้องออก

#### 4.10 จัดการประกาศหอ (Manage Listings)
- ดูรายการหอของตัวเอง
- แก้ไขข้อมูลหอ (รูป, ราคา, amenities, ที่อยู่)
- เปิด/ปิดประกาศ
- ลบประกาศ

#### 4.11 รับสอบถาม (Manage Inquiries)
- **Inbox:** รับข้อความจากนักศึกษาที่สนใจ
- **Mark as Read:** ทำเครื่องหมายว่าอ่านแล้ว
- **ตอบกลับ:** เขียนข้อความตอบกลับ (เบื้องต้น: ส่งได้ผ่านระบบ)

#### 4.12 Dashboard สถิติ (Statistics Dashboard)
- **ยอดเข้าชม:** นับว่าดูประกาศกี่ครั้ง
- **จำนวนสอบถาม:** นับสอบถามทั้งหมด, สอบถามที่ยังไม่อ่าน
- **คะแนน:** แสดงคะแนนรีวิวเฉลี่ย
- **ห้องว่าง:** นับจำนวนห้องว่าง/เต็ม

---

### ระบบกลาง (System Features)

#### 4.13 Authentication (การยืนยันตัวตน)
- **ลงทะเบียน (Register):** สมัครสมาชิกใหม่พร้อมเลือกบทบาท (Student/Owner)
- **เข้าสู่ระบบ (Login):** ใช้อีเมล + รหัสผ่าน
- **ออกจากระบบ (Logout):** ลบ session
- **Password Hashing:** รหัสผ่านเข้ารหัสด้วย bcryptjs
- **JWT Token:** ใช้ NextAuth.js ในการจัดการ token และ session

#### 4.14 ระบบ Notification (แจ้งเตือน)
- **Email Notification:** ส่งอีเมลแจ้งเมื่อมีข้อความจากนักศึกษา (ใช้ Nodemailer)
- **In-app Notification:** แสดงการแจ้งเตือนในระบบ (ใจ้ว่างเข้าแล้ว, มีสอบถามใหม่)

#### 4.15 ระบบแผนที่ (Map System)
- **Library:** Leaflet.js + OpenStreetMap
- **Center Point:** มหาวิทยาลัยนเรศวร (lat: 16.7459, lng: 100.1963)
- **Features:**
  - แสดง pin ของทุกหอพัก
  - คำนวณระยะทาง Haversine Formula
  - Interactive popup เมื่อคลิก pin

#### 4.16 Image Management
- **Storage:** Cloudinary (ไม่เก็บรูปใน public/)
- **Upload:** นักศึกษาและเจ้าของหอสามารถอัพโหลดรูป
- **Optimization:** Cloudinary ช่วยปรับขนาดและ optimize

#### 4.17 Admin Dashboard
- **สถิติระบบ:** แสดงจำนวนหอพัก, ผู้ใช้, นักศึกษา, เจ้าของหอ
- **ตารางหอพัก:** ดูข้อมูลหอทั้งหมด, เจ้าของ, สถิติ, สถานะ
- **ตารางผู้ใช้:** ดูข้อมูลผู้ใช้ทั้งหมด, แสดง Role, วันที่สมัคร
- **การลบหอพัก:** ลบหอพักออกจากระบบ (กรณีที่เนื้อหาไม่เหมาะสม, โปรแกรม)

---

## 5. โครงสร้าง Database

```prisma
User (ผู้ใช้)
├── id: รหัสผู้ใช้
├── email: อีเมล (unique)
├── password: รหัสผ่าน (hashed)
├── name: ชื่อ
├── role: บทบาท (STUDENT | OWNER | ADMIN)
├── phone: เบอร์โทรศัพท์
└── relationships: dorms, reviews, wishlists, inquiries

Dorm (หอพัก)
├── id: รหัสหอพัก
├── name: ชื่อหอ
├── description: รายละเอียด
├── price: ราคาต่ำสุด
├── priceMax: ราคาสูงสุด
├── type: ประเภท (FEMALE | MALE | MIXED)
├── lat/lng: พิกัด GPS
├── address: ที่อยู่เต็ม
├── phone: เบอร์ติดต่อ
├── images: อาเรย์รูปภาพ
├── amenities: อาเรย์สิ่งอำนวยความสะดวก
├── isAvailable: สถานะเปิด/ปิด
├── ownerId: เจ้าของ
└── relationships: owner, rooms, reviews, wishlists, inquiries

Room (ห้องพัก)
├── id: รหัสห้อง
├── dormId: เป็นห้องของหอไหน
├── name: ชื่อห้อง
├── price: ราคา
├── isAvailable: ว่าง/เต็ม
└── relationships: dorm

Review (รีวิว)
├── id: รหัสรีวิว
├── dormId: รีวิวหอไหน
├── userId: ใครเขียน
├── rating: คะแนน 1-5
├── comment: ความเห็น
└── createdAt: เวลา

Wishlist (บันทึกหอ)
├── id: รหัส
├── userId: ใครบันทึก
├── dormId: บันทึกหอไหน
└── unique constraint: (userId, dormId)

Inquiry (สอบถาม)
├── id: รหัสสอบถาม
├── dormId: สอบถามหอไหน
├── fromId: ใครถาม
├── message: ข้อความ
├── isRead: อ่านแล้ว?
└── createdAt: เวลา
```

---

## 6. ลำดับการพัฒนา (Development Phases)

### Phase 1 — Core (MVP) — ทำให้จำเป็น
1. ตั้งค่า Next.js + TypeScript + Tailwind
2. ติดตั้ง dependencies (Prisma, NextAuth, Leaflet, shadcn/ui)
3. สร้าง database schema + migration
4. Authentication (register/login, role separation)
5. หน้าลงประกาศหอ (Owner - Create Listing)
6. หน้าค้นหาหอ + รายการหอ (Student - Search)
7. หน้ารายละเอียดหอ (Dorm Detail)
8. แผนที่ Leaflet แสดงหอพัก

### Phase 2 — Engagement — เพิ่มความมีส่วนร่วม
9. ระบบรีวิว + ให้คะแนน
10. Wishlist
11. เปรียบเทียบหอ Side-by-side
12. ระบบ Inquiry (ส่งข้อความ)

### Phase 3 — Polish — เพิ่มเติมและแต่งแต้ม
13. Dashboard สถิติสำหรับเจ้าของหอ
14. Email Notification
15. Real-time สถานะห้อง
16. Mobile Responsive
17. UX/UI improvements

---

## 7. ลักษณะการทำงาน (System Workflow)

### Use Case 1: นักศึกษาค้นหาหอพัก
```
1. นักศึกษาเข้าสู่ระบบ
2. ไปที่หน้า "ค้นหาหอ"
3. กรองตามเงื่อนไข (ราคา, ระยะทาง, ประเภท)
4. ดูรายการหอที่ตรงกับเงื่อนไข
5. คลิกดูรายละเอียดหอ
6. เพิ่มเข้า Wishlist หรือเขียนรีวิว
7. ส่งข้อความสอบถามไปยังเจ้าของหอ
```

### Use Case 2: เจ้าของหอลงประกาศ
```
1. เจ้าของหอเข้าสู่ระบบ
2. ไปที่ "Dashboard" → "ลงประกาศใหม่"
3. กรอกข้อมูล: ชื่อ, ราคา, ที่อยู่, รูป, amenities
4. อัพโหลดรูป (Cloudinary)
5. เพิ่มห้องพัก
6. เผยแพร่ประกาศ
7. รับข้อความจากนักศึกษา → ตอบสอบถาม
8. อัพเดทสถานะห้องในแบบ Real-time
9. ดู Dashboard สถิติและรีวิว
```

---

## 8. สิ่งที่สำคัญในการพัฒนา

### ความปลอดภัย (Security)
- ✅ รหัสผ่านเข้ารหัส (bcryptjs)
- ✅ ใช้ NextAuth.js สำหรับ authentication
- ✅ ไม่ commit `.env.local`
- ✅ JWT + Session-based auth
- ✅ CORS headers สำหรับ API

### ประสิทธิภาพ (Performance)
- ✅ Server Components เป็น default
- ✅ Image optimization (Cloudinary)
- ✅ Database indexing บนฟิลด์ที่ค้นหาบ่อย
- ✅ Lazy loading สำหรับรูปภาพ

### ประสบการณ์ผู้ใช้ (UX)
- ✅ Responsive Design (Mobile-first)
- ✅ Real-time updates สำหรับสถานะห้อง
- ✅ Filter และ Search ที่เร็วและง่าย
- ✅ Error handling และ validation

### Code Quality
- ✅ TypeScript (ไม่มี `any`)
- ✅ Component naming: PascalCase
- ✅ API routes: RESTful
- ✅ Error responses: `{ error: string }` พร้อม HTTP status

---

## 9. Environment Variables ที่จำเป็น

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/nudorm"

# NextAuth
NEXTAUTH_SECRET="<random-secret>"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary
CLOUDINARY_CLOUD_NAME="<name>"
CLOUDINARY_API_KEY="<key>"
CLOUDINARY_API_SECRET="<secret>"

# Email (Nodemailer)
EMAIL_USER="<email@gmail.com>"
EMAIL_PASSWORD="<app-password>"

# Optional: Pusher/Socket.io
PUSHER_KEY="<key>"
PUSHER_SECRET="<secret>"
PUSHER_CLUSTER="<cluster>"
```

---

## 10. Summary

**NUDorm** เป็นระบบหาหอพักที่ครบถ้วน สนับสนุน **3 บทบาท** (นักศึกษา, เจ้าของหอ, Admin) พร้อมฟีเจอร์ 17 รายการ ใช้เทคโนโลยีสมัยใหม่ (Next.js, TypeScript, PostgreSQL, Prisma) สามารถ Deploy บน Vercel + Railway/Supabase ทำให้เป็นแอปเว็บที่สมบูรณ์ สะดวก ปลอดภัย และ สามารถจัดการแบบมืออาชีพสำหรับนักศึกษาและเจ้าของหอพักของมหาวิทยาลัยนเรศวร

---

**เอกสารนี้จัดทำเพื่อใช้ประกอบการยื่นฝึกงาน**
