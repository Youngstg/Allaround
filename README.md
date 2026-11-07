# Allaround — Everyday Productivity Tools 🚀

Platform web multi-tool serbaguna berbasis **React 19**, **TypeScript**, dan **Vite 6** dengan antarmuka modern bernuansa warna pastel. Seluruh alat dirancang dengan prinsip **100% Client-Side Privacy**, di mana seluruh berkas (PDF, gambar, dan teks) diproses langsung di peramban lokal pengguna tanpa pernah diunggah ke server mana pun.

🌐 **Situs Resmi:** [https://allaround.us.ci](https://allaround.us.ci)

---

## ✨ Fitur & Inventaris Alat (24 Alat)

### 📄 PDF Tools
- **PDF Compressor:** Mengoptimalkan struktur objek internal PDF menggunakan background thread (**Web Worker**) agar UI tetap responsif. Menampilkan ukuran hasil nyata tanpa manipulasi angka, serta memproteksi berkas dari pembengkakan (*anti-bloat*).
- **Merge PDF:** Menggabungkan beberapa dokumen PDF menjadi satu berkas berurutan dengan validasi header `%PDF-` dan penolakan berkas terenkripsi/rusak yang menyebutkan nama berkas spesifik.
- **PDF to Text Extractor:** Mengekstrak teks dari dokumen PDF secara instan di peramban.
- **Image to PDF:** Mengonversi berbagai gambar menjadi satu dokumen PDF siap cetak.

### 🖼️ Image Tools
- **Photobooth Frame Cutout & Chroma BG:** Pembersih latar belakang berbasis warna solid dengan algoritma **Edge-Connected Flood Fill** dari tepi luar kanvas untuk melindungi label produk di tengah dari *over-cut*.
- **Image Compressor:** Kompresi ukuran berkas JPG, PNG, dan WebP dengan kontrol kualitas dan resolusi kanvas langsung.
- **Image Resizer:** Mengubah dimensi lebar dan tinggi gambar dengan penguncian rasio aspek (*aspect ratio lock*).
- **Image Converter:** Konversi cepat antar format PNG, JPG, dan WebP dengan deteksi ramah format iPhone HEIC dan proteksi berkas non-gambar.
- **JFIF to JPG Converter:** Mengubah format JFIF warisan menjadi JPG standar universal.
- **EXIF Metadata Scrubber:** Membersihkan metadata kamera/lokasi pada foto demi privasi dengan tetap mempertahankan orientasi rotasi fisik yang tegak.

### ✍️ Text Tools
- **Word Counter & Text Analyzer:** Menghitung jumlah kata, karakter (dengan/tanpa spasi), kalimat, paragraf, serta estimasi waktu membaca dan berbicara secara real-time. Tahan memproses lebih dari 100.000 kata dalam hitungan milidetik.
- **Case Converter:** Mengubah format teks ke UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, dan kebab-case.
- **Text Diff Checker:** Membandingkan dua teks secara visual per baris untuk menemukan perbedaan penambahan atau penghapusan kata.
- **Markdown Live Editor:** Editor markdown interaktif dengan pratinjau instan dan sanitasi entitas HTML untuk mencegah kerentanan XSS.
- **HTML Reader & Live Preview:** Pratinjau dokumen HTML secara aman di dalam `<iframe>` bersandbox terisolasi.
- **Lorem Ipsum Generator:** Generator teks *dummy* untuk prototyping dengan proteksi pembatasan input (*input clamping*) agar tidak membebani memori tab peramban.
- **Duplicate Line Remover:** Membersihkan baris duplikat dan baris kosong dengan opsi *case-sensitive*, *trim whitespace*, dan pengurutan abjad A-Z.

### 🔄 Converter Tools
- **Unit Converter:** Konversi satuan panjang, massa, suhu, dan volume.
- **Color Palette Converter:** Konversi kode warna HEX, RGB, HSL, serta generator palet warna pastel.
- **Kalkulator Biner:** Konversi angka desimal, biner, heksadesimal, dan oktal dengan visualisasi bit.

### ⚡ Generator Tools
- **QR Code Generator:** Membuat kode QR dari URL atau teks dengan palet warna kustom, deteksi peringatan kontras warna rendah (*contrast ratio check*), serta opsi ekspor gambar PNG dan vektor SVG tajam.
- **Password Generator:** Menghasilkan kata sandi acak yang kuat dengan pengaturan panjang, simbol, angka, dan huruf kapital.
- **UUID Generator:** Generator UUID v4 acak untuk pengembang perangkat lunak.

### ⏱️ Utilities
- **Pomodoro Focus Timer:** Pengatur waktu interval kerja dan istirahat untuk produktivitas harian.

---

## 🔒 Jaminan Privasi (100% Client-Side Privacy)

1. **Nol Pengiriman Berkas:** Saat Anda mengompres PDF, menghapus EXIF foto, atau mengonversi gambar, data biner berkas hanya dibaca ke dalam memori browser lokal (`ArrayBuffer`, `Canvas`, dan `Blob`). Tidak ada panggilan API `POST` atau `PUT` yang mengirim dokumen ke server.
2. **Tidak Ada Pelacak Pihak Ketiga:** Allaround bebas dari skrip pelacak invasif (tanpa Google Analytics, Facebook Pixel, Mixpanel, atau Hotjar).
3. **Dapat Berfungsi Offline:** Setelah aset web termuat, seluruh utilitas inti tetap dapat memproses berkas lokal Anda meskipun koneksi internet terputus.

---

## 🧭 Navigasi & Arsitektur URL

- **URL Bersih Per Alat:** Setiap alat memiliki URL mandiri (contoh: `/pdf-compressor`, `/word-counter`, `/qr-generator`) yang didukung oleh konfigurasi rewrites SPA (`vercel.json`).
- **History API Integration:** Mendukung tombol navigasi browser *Back* dan *Forward* secara mulus tanpa me-reset status aplikasi.
- **SEO & Structured Data:** Dilengkapi dengan tag Open Graph, Twitter Cards, robots meta, JSON-LD Schema `WebApplication`, serta tautan semantik fallback di dalam `<noscript>`.
- **Halaman 404 Interaktif:** Rute yang tidak terdaftar akan otomatis menampilkan halaman 404 ramah pengguna lengkap dengan tombol kembali ke beranda.

---

## 🛠️ Panduan Pengembang (Development)

### Prasyarat
- **Node.js** (versi 18 atau lebih baru)
- **npm** atau **pnpm**

### Instalasi & Menjalankan Lokal

```bash
# Clone repositori
git clone https://github.com/Youngstg/Allaround.git
cd Allaround

# Install dependensi
npm install

# Jalankan server pengembangan lokal (Vite)
npm run dev
```

Buka peramban di `http://localhost:5173`.

### Pengujian Otomatis (Unit Testing)

Proyek ini dilengkapi dengan 78 unit tests komprehensif menggunakan **Vitest**:

```bash
# Menjalankan seluruh test suite
npm test
```

### Build Produksi

```bash
# Typecheck TypeScript dan bundling Vite
npm run build
```

Hasil build yang siap di-deploy akan berada di direktori `dist/`.

---

## 📄 Lisensi

Hak Cipta © 2026 Allaround. Seluruh hak cipta dilindungi undang-undang.
