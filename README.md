# SIPINKA (Sistem Informasi Peminjaman Ruangan Kampus)

Sistem Informasi Manajemen untuk mengelola peminjaman ruangan pada lingkungan kampus UMG

![Status](https://img.shields.io/badge/status-MVP-brightgreen)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![Node](https://img.shields.io/badge/Node.js-18+-green)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange)

---

## 📋 Fitur Utama

### 🌐 Publik (Guest)
- ✅ Melihat daftar ruangan
- ✅ Melihat jadwal peminjaman yang disetujui
- ✅ Landing page informasi

### 👤 User (Login)
- ✅ Semua fitur Guest
- ✅ Mengajukan peminjaman ruangan
- ✅ Melihat riwayat peminjaman sendiri
- ✅ Filter peminjaman by status (Menunggu/Disetujui/Ditolak)
- ✅ Menghapus pengajuan peminjaman (jika masih Menunggu)
- ✅ Tracking status pengajuan real-time

### 👨‍💼 Admin (Login)
- ✅ Semua fitur User
- ✅ CRUD Manajemen Ruangan (termasuk jam operasional)
- ✅ Setujui/Tolak pengajuan peminjaman
- ✅ Melihat semua riwayat peminjaman
- ✅ Filter peminjaman by status/ruangan

---

## 🛠️ Tech Stack

### Frontend
- **React 19.2** + **Vite 7** - UI Framework & Build Tool
- **TailwindCSS 4.1** - Utility-first CSS Framework
- **Shadcn/ui** - Komponen UI modern & accessible
- **React Router 7** - Client-side routing
- **Lucide React** - Icon library

### Backend
- **Node.js 18+** + **Express** - Server & REST API
- **Prisma** - ORM untuk database
- **MySQL** - Relational Database
- **JWT (jsonwebtoken)** - Authentication & Authorization
- **bcryptjs** - Password hashing
- **CORS** - Cross-Origin Resource Sharing

---

## 🚀 Cara Menjalankan Proyek

### Prasyarat
- Node.js v18+ terinstall
- MySQL (XAMPP/MySQL Server)
- Git

### 1️⃣ Clone Repository
```bash
git clone https://github.com/vidyasulton/sistem-peminjaman-ruangan.git
cd sistem-peminjaman-ruangan
```

### 2️⃣ Setup Backend

#### a. Masuk ke folder backend
```bash
cd backend
```

#### b. Install dependencies
```bash
npm install
```

#### c. Buat database MySQL
Buka **phpMyAdmin** (jika pakai XAMPP) atau MySQL CLI, lalu jalankan:
```sql
CREATE DATABASE peminjaman_ruangan CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### d. Konfigurasi Environment Variables
Buat file `.env` di folder `backend/`:
```env
# Database Connection
DATABASE_URL="mysql://root:@localhost:3306/peminjaman_ruangan"

# JWT Secret (GANTI dengan string random yang kuat!)
JWT_SECRET="ganti_dengan_string_random_aman_minimal_32_karakter"

# Server Port
PORT=3050
```

**⚠️ PENTING:** Ganti `JWT_SECRET` dengan string random yang kuat untuk keamanan!

#### e. Jalankan Prisma Migration
```bash
npx prisma migrate dev
```

Prisma akan:
- Membuat tabel-tabel di database
- Generate Prisma Client untuk query database

#### f. Jalankan Backend Server
```bash
npm run dev
```

**Cek apakah berhasil:** Buka `http://localhost:3050` di browser

---

### 3️⃣ Setup Frontend

Buka **terminal baru** (jangan tutup terminal backend).

#### a. Masuk ke folder frontend
```bash
cd frontend
```

#### b. Install dependencies
```bash
npm install
```

#### c. Jalankan Frontend Development Server
```bash
npm run dev
```

**Frontend berjalan di:** `http://localhost:5173`

---

### 4️⃣ Akses Aplikasi

Buka browser dan akses:
- **Landing Page:** `http://localhost:5173`
- **Login:** `http://localhost:5173/login`
- **Register:** `http://localhost:5173/register`

---

## 👤 Membuat User Admin Pertama

Setelah register user pertama, ubah role-nya menjadi ADMIN:

### Via phpMyAdmin
1. Buka phpMyAdmin
2. Pilih database `peminjaman_ruangan`
3. Klik tabel `User`
4. Edit user yang diinginkan
5. Ubah kolom `role` menjadi `ADMIN`
6. Save

---


## Kekurangan MVP:
1. **Tidak pakai Axios** - Menggunakan native `fetch()` API
2. **Upload lampiran surat** - Belum diimplementasikan (schema sudah ada)
3. **Chart di admin dashboard** - Belum diimplementasikan
4. **Desain UI** - Masih bisa dipoles lebih lanjut
5. **Toast notifications** - Masih menggunakan `alert()` native

## Developer

Developed with ❤️ by `Kelompok 4 SIM`

---

## 📄 License

MIT License - Silakan gunakan untuk pembelajaran dan pengembangan.