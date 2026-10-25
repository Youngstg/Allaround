# 📋 PRD — AllAround Web App
> **Product Requirements Document**  
> Versi: 1.0.0 | Tanggal: 2026-10-09 | Status: Draft  

---

## 1. Ringkasan Produk

**AllAround** adalah web application multi-tool yang menyediakan alat bantu produktivitas sehari-hari dalam satu platform. Pengguna tidak perlu berpindah ke berbagai website untuk kompres PDF, ubah format gambar, atau edit teks — semuanya tersedia di satu tempat dengan antarmuka bersih, cepat, dan intuitif.

---

## 2. Visi & Misi

| | |
|---|---|
| **Visi** | Platform "satu pintu" terpercaya untuk semua kebutuhan konversi, kompresi, dan manipulasi file sehari-hari |
| **Misi** | Menyediakan alat produktivitas berkualitas tinggi, gratis, dan mudah digunakan tanpa akun atau instalasi |
| **Tagline** | *"Semua yang kamu butuhkan, di satu tempat."* |

---

## 3. Target Pengguna (User Personas)

### 3.1 Mahasiswa / Pelajar
- **Kebutuhan**: Kompres PDF tugas, gabung dokumen, ubah foto jadi PDF, resize gambar
- **Frekuensi**: Tinggi (beberapa kali seminggu)

### 3.2 Pekerja Kantoran
- **Kebutuhan**: PDF ke Word, kompres gambar untuk presentasi, buat QR code, ekstrak teks
- **Frekuensi**: Sangat tinggi (hampir setiap hari)

### 3.3 Kreator Konten / Desainer
- **Kebutuhan**: Resize gambar untuk sosmed, kompres gambar, ubah format, hapus background
- **Frekuensi**: Tinggi

### 3.4 Pengguna Umum
- **Kebutuhan**: Password kuat, hitung kata, QR code dari link, konversi satuan
- **Frekuensi**: Sedang (beberapa kali sebulan)

---

## 4. Daftar Lengkap Tools

### 📄 PDF Tools
| No | Nama Tool | Deskripsi | Prioritas |
|----|-----------|-----------|-----------|
| 1 | PDF Compressor | Kompres ukuran file PDF | MVP |
| 2 | PDF to Word | Konversi PDF ke .docx | MVP |
| 3 | Word to PDF | Konversi .docx ke PDF | MVP |
| 4 | Merge PDF | Gabungkan beberapa PDF | MVP |
| 5 | Split PDF | Pisahkan halaman PDF | MVP |
| 6 | PDF to Image | Konversi halaman PDF ke gambar | Phase 2 |
| 7 | Image to PDF | Gabungkan gambar ke PDF | MVP |
| 8 | PDF Page Remover | Hapus halaman tertentu | Phase 2 |
| 9 | PDF Rotator | Putar halaman PDF | Phase 2 |
| 10 | PDF Locker | Tambahkan password ke PDF | Phase 2 |

### 🖼️ Image Tools
| No | Nama Tool | Deskripsi | Prioritas |
|----|-----------|-----------|-----------|
| 11 | Image Compressor | Kompres ukuran gambar | MVP |
| 12 | Image Resizer | Ubah dimensi gambar | MVP |
| 13 | Image Converter | Konversi format (JPG/PNG/WebP/GIF) | MVP |
| 14 | Background Changer | Ganti/hapus background gambar | MVP |
| 15 | Image Cropper | Potong gambar | MVP |
| 16 | Image to Base64 | Konversi gambar ke Base64 string | Phase 2 |
| 17 | EXIF Remover | Hapus metadata dari gambar | Phase 2 |
| 18 | Photo Filter | Tambahkan filter efek ke gambar | Phase 2 |
| 19 | Watermark Adder | Tambahkan watermark ke gambar | Phase 2 |
| 20 | Image Flipper/Rotator | Flip & rotasi gambar | MVP |

### ✍️ Text Tools
| No | Nama Tool | Deskripsi | Prioritas |
|----|-----------|-----------|-----------|
| 21 | Word Counter | Hitung kata, karakter, paragraf | MVP |
| 22 | Case Converter | Ubah huruf (UPPER/lower/Title/camel) | MVP |
| 23 | Text Diff Checker | Bandingkan dua teks | Phase 2 |
| 24 | Lorem Ipsum Generator | Generate teks placeholder | MVP |
| 25 | Markdown Previewer | Preview render Markdown real-time | Phase 2 |
| 26 | Text to Speech | Konversi teks ke audio | Phase 3 |
| 27 | Duplicate Line Remover | Hapus baris duplikat | MVP |
| 28 | Text Encryptor | Enkripsi/dekripsi teks sederhana | Phase 2 |

### 🔄 Converter Tools
| No | Nama Tool | Deskripsi | Prioritas |
|----|-----------|-----------|-----------|
| 29 | Unit Converter | Konversi satuan (panjang, berat, suhu) | MVP |
| 30 | Color Converter | Konversi HEX/RGB/HSL/CMYK | MVP |
| 31 | Number Base Converter | Desimal/Biner/Oktal/Hex | Phase 2 |
| 32 | CSV to JSON | Konversi CSV ke JSON | Phase 2 |
| 33 | JSON Formatter | Format & validasi JSON | Phase 2 |
| 34 | Timestamp Converter | Unix timestamp ke tanggal/waktu | Phase 2 |

### 🔐 Generator Tools
| No | Nama Tool | Deskripsi | Prioritas |
|----|-----------|-----------|-----------|
| 35 | QR Code Generator | Buat QR code dari teks/URL | MVP |
| 36 | Password Generator | Generate password kuat | MVP |
| 37 | UUID Generator | Generate UUID v1/v4 | MVP |
| 38 | Barcode Generator | Buat barcode dari teks | Phase 2 |
| 39 | Hash Generator | MD5, SHA-1, SHA-256 | Phase 2 |
| 40 | Favicon Generator | Buat favicon dari gambar | Phase 3 |

### 📊 Utility Tools
| No | Nama Tool | Deskripsi | Prioritas |
|----|-----------|-----------|-----------|
| 41 | Pomodoro Timer | Timer fokus metode Pomodoro | MVP |
| 42 | Stopwatch | Stopwatch & countdown timer | MVP |
| 43 | Age Calculator | Hitung usia dari tanggal lahir | MVP |
| 44 | BMI Calculator | Hitung Body Mass Index | MVP |
| 45 | Loan Calculator | Kalkulator cicilan pinjaman/KPR | Phase 2 |
| 46 | Tip Calculator | Hitung tip di restoran | MVP |

### 🌐 Dev Tools
| No | Nama Tool | Deskripsi | Prioritas |
|----|-----------|-----------|-----------|
| 47 | URL Encoder/Decoder | Encode/decode URL string | MVP |
| 48 | HTML Entity Encoder | Konversi ke HTML entities | Phase 2 |
| 49 | Regex Tester | Test & debug ekspresi reguler | Phase 2 |
| 50 | CSS Minifier | Minify kode CSS | Phase 2 |

---

## 5. Struktur Navigasi Sidebar

```
AllAround
├── Dashboard (Beranda)
├── ─────────────────
├── PDF Tools
│   ├── PDF Compressor
│   ├── PDF to Word
│   ├── Word to PDF
│   ├── Merge PDF
│   ├── Split PDF
│   └── Image to PDF
├── Image Tools
│   ├── Image Compressor
│   ├── Image Resizer
│   ├── Image Converter
│   ├── Background Changer
│   ├── Image Cropper
│   └── Image Flipper
├── Text Tools
│   ├── Word Counter
│   ├── Case Converter
│   ├── Lorem Ipsum
│   └── Duplicate Remover
├── Converter
│   ├── Unit Converter
│   └── Color Converter
├── Generator
│   ├── QR Code Generator
│   ├── Password Generator
│   └── UUID Generator
├── Utilities
│   ├── Pomodoro Timer
│   ├── Stopwatch
│   ├── Age Calculator
│   ├── BMI Calculator
│   └── Tip Calculator
├── Dev Tools
│   └── URL Encoder/Decoder
└── Pengaturan
```

---

## 6. Functional Requirements

### Navigasi & Layout
- Sidebar sticky di sisi kiri dengan kategori yang dapat di-expand/collapse
- Search bar global untuk mencari tool berdasarkan nama
- Dashboard menampilkan tool terpopuler dan terbaru
- Responsive: desktop (sidebar), tablet/mobile (hamburger + bottom nav)
- Breadcrumb navigasi

### Penggunaan Tool
- Semua tool bekerja di browser (client-side) — tidak ada upload ke server pihak ketiga
- Drag & drop untuk upload file
- Preview hasil sebelum download
- Tombol download hasil yang jelas
- Tombol reset/clear
- Progress indicator untuk proses yang lama
- Pesan error yang informatif

### Pengalaman Pengguna
- "Favorit" — simpan tool favorit (localStorage)
- "Riwayat" — tampilkan tool yang baru digunakan
- Tooltip singkat di setiap tool card
- Dark mode toggle
- Animasi transisi halaman yang halus

---

## 7. Non-Functional Requirements

| Aspek | Target |
|-------|--------|
| Performance | Waktu muat pertama < 2 detik (LCP) |
| Offline | Tool berbasis teks/kalkulasi tetap bekerja via Service Worker |
| Security | Semua file diproses di sisi client — tidak ada upload ke server |
| Browser | Chrome 90+, Firefox 88+, Edge 90+, Safari 14+ |
| Aksesibilitas | WCAG 2.1 Level AA, keyboard navigable |
| SEO | Meta tags, Open Graph, deskripsi per halaman tool |

---

## 8. Tech Stack Rekomendasi

| Layer | Teknologi | Alasan |
|-------|-----------|--------|
| Framework | Next.js 14 (App Router) | SSR/SSG untuk SEO, routing file-based |
| Styling | Tailwind CSS + Custom CSS | Utility-first + fleksibilitas tema pastel |
| PDF | pdf-lib, pdfjs-dist | Client-side PDF manipulation |
| Image | browser-image-compression, Canvas API | Kompresi & manipulasi di browser |
| File Conversion | mammoth (docx), FileSaver.js | Word parsing, download file |
| QR Code | qrcode, html5-qrcode | Generate & scan QR |
| State | Zustand | Ringan, tanpa backend |
| Icons | Lucide React | Ringan, konsisten, modern |
| Fonts | Google Fonts: Outfit + Inter | Modern, mudah dibaca |
| Animasi | Framer Motion | Animasi halus profesional |
| Hosting | Vercel | Gratis, CI/CD, CDN global |

---

## 9. MVP Scope (Fase 1) — 20 Tools

| Kategori | Tools MVP |
|----------|-----------|
| PDF | Compressor, to Word, Merge, Split, Image to PDF |
| Image | Compressor, Resizer, Converter, Background Changer, Cropper, Flipper |
| Text | Word Counter, Case Converter, Lorem Ipsum, Duplicate Remover |
| Converter | Unit Converter, Color Converter |
| Generator | QR Code, Password, UUID |
| Utility | Pomodoro, Age Calculator, BMI |
| Dev | URL Encoder |

---

## 10. Timeline

| Fase | Durasi | Deliverables |
|------|--------|--------------|
| Fase 0 — Setup | 1 minggu | Project setup, design system, komponen dasar |
| Fase 1 — MVP | 3 minggu | 20 tools MVP, sidebar, search, responsive |
| Fase 2 — Expand | 4 minggu | +15 tools Phase 2, dark mode, favorit, PWA |
| Fase 3 — Polish | 2 minggu | Optimasi performa, SEO, aksesibilitas, testing |
| Launch | — | Deploy ke Vercel, domain custom |

---

## 11. Risiko & Mitigasi

| Risiko | Probabilitas | Dampak | Mitigasi |
|--------|-------------|--------|---------|
| Konversi PDF kompleks gagal di browser | Sedang | Tinggi | Gunakan pdf-lib + fallback error message |
| Performa lambat untuk file besar | Tinggi | Sedang | Batas file max 50MB, gunakan Web Workers |
| Browser support API baru | Rendah | Sedang | Polyfill + graceful degradation |
| Kualitas hasil konversi kurang | Sedang | Tinggi | Preview sebelum download + test ekstensif |

---

*Dokumen ini akan diperbarui seiring perkembangan proyek.*
