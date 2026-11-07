# Rencana Perbaikan — Allaround (https://allaround.us.ci)

Rencana ini disusun dari `laporan-uat-allaround.md` (32 skenario, bagian A–D: 18 lulus, 13 gagal, 1 tidak bisa diuji). Laporan baru mencakup **32 dari 67 skenario**. Bagian E sampai I (Hitung Kata, QR Code, alat lain, privasi/keamanan, teknis/SEO) belum dijalankan, jadi 56,3% bukan tingkat kelulusan keseluruhan.

Ukuran usaha hanya perkiraan kasar: **S** ≤ 1 hari, **M** 2–3 hari, **L** > 3 hari.

Kolom **Status**: ☐ belum, 🔄 dikerjakan, ✅ selesai dan terverifikasi.

---

## 1. Rencana perbaikan

### Fase 0: kejujuran hasil dan keamanan berkas (lakukan dulu)

| # | Perbaikan | Temuan | Langkah | Selesai bila | Usaha | Status |
|---|---|---|---|---|---|---|
| 1 | **Hapus angka kompresi palsu** | B2, B9 | Kode `PdfCompressorTool.tsx` memakai angka tetap (`finalLength = Math.floor(file.size * 0.45)`), sehingga layar menampilkan "Hasil 648.8 KB, Penghematan -55%" padahal file asli yang diunduh hanya hemat 6,2% (1,38 MB). Tampilkan ukuran dari `compressedData.length`. Jika hasil ≥ ukuran asli, kembalikan file asli dan tampilkan pesan "File sudah optimal, kompresi tidak memperkecil ukuran". Periksa juga pola serupa di alat lain (Image Compressor) | Angka di layar sama dengan ukuran file yang diunduh | S | 🔄 |
| 2 | **Validasi PDF dan tangani PDF terkunci** | B7, B8, C7 | Cek header `%PDF-` dan coba muat dokumen sebelum diproses. Tolak berkas rusak dengan tegas (jangan pernah menghasilkan file 0 KB dengan status "Selesai"). Hapus `ignoreEncryption: true`: deteksi PDF terenkripsi lalu tampilkan "PDF ini dikunci kata sandi, buka kuncinya dulu" (atau minta sandi bila memakai pustaka yang bisa mendekripsi). Pesan error ramah, bukan teks mentah "Failed to parse PDF document…" | B7 dan B8 lulus; tidak ada hasil berukuran 0 KB | M | 🔄 |
| 3 | **Batas ukuran dan Web Worker** | B5, D7 | Batasi PDF (misalnya 25 MB) dengan penolakan seketika dan pesan jelas. Pindahkan pemrosesan `pdf-lib` ke Web Worker agar UI tidak membeku. Beri peringatan atau perkecil otomatis untuk gambar besar (8000×8000 px butuh ±12 detik). Perhatikan bahwa Safari iOS punya batas area kanvas yang jauh lebih kecil, sehingga gambar besar bisa gagal di sana | 52 MB ditolak seketika; UI tetap responsif | M | 🔄 |
| 4 | **Samakan klaim "Kompres PDF ke < 1MB"** | B2, B6 | Hasil uji: 1,41 MB → 1,32 MB dan scan 1,44 MB → 1,32 MB, jadi janji "< 1MB" tidak tercapai dan penghematan hanya 6–8%. Pilih: (a) implementasikan kompresi gambar sungguhan (render halaman lalu enkode ulang JPEG dengan kualitas tertentu, atau pustaka WebAssembly seperti MuPDF/Ghostscript; periksa lisensinya), atau (b) ubah klaim agar jujur ("mengoptimalkan struktur PDF"). Pastikan tiap preset menghasilkan ukuran berbeda | Klaim sesuai hasil; preset Hybrid dan Deflate terbukti berbeda pada PDF berisi gambar | L (a) / S (b) | ☐ |

### Fase 1: minggu pertama

| # | Perbaikan | Temuan | Langkah | Usaha | Status |
|---|---|---|---|---|---|
| 5 | **URL per alat dan tombol Back** | A5 | Navigasi memakai `useState(activeToolId)` tanpa routing. Tambahkan routing (path seperti `/pdf-compressor` dengan rewrite di server, atau hash `#/pdf-compressor`) dan gunakan History API agar Back, Refresh, dan tautan langsung berfungsi. Beri title dan deskripsi unik per alat | M | ☐ |
| 6 | **Empty state pencarian** | A4 | Ganti "HASIL PENCARIAN (0)" dengan pesan ramah: "Alat tidak ditemukan. Coba kata kunci lain" dan tombol hapus pencarian | S | ☐ |
| 7 | **Pesan error dan petunjuk yang konsisten** | B8, C4, C7, D6 | Ganti `alert()` bawaan browser dengan notifikasi di dalam aplikasi. Tampilkan petunjuk "Tambahkan minimal 1 dokumen lagi" saat hanya 1 berkas di Gabung PDF. Sebut nama berkas bermasalah pada error ("Gagal membaca *nama.pdf*"). Validasi tipe berkas dan tampilkan pesan untuk file bukan gambar | S–M | ☐ |
| 8 | **Alat Background Changer: nama, perilaku, dan HEIC** | D1, D2, D6 | Alat ini sebenarnya "Photobooth Frame Cutout" berbasis chroma key, bukan penghapus latar berbasis AI. Pilih: (a) ubah nama dan deskripsi di dashboard agar jujur, atau (b) tambahkan penghapus latar AI di browser (misalnya model ONNX/WebAssembly; periksa lisensi pustakanya). Untuk mode "Semua Warna Putih (Global)", hapus hanya area putih yang terhubung ke tepi gambar (flood fill dari tepi) agar label putih di tengah produk tidak ikut bolong. Untuk HEIC, konversi di sisi klien (pustaka seperti `heic2any`; periksa lisensi) atau tolak dengan pesan jelas | M–L | ☐ |
| 9 | **Metadata, privasi, dan konten tanpa JavaScript** | Temuan awal | Beranda kosong tanpa JavaScript. Lengkapi `og:title`, `og:description`, `og:image`, canonical, `theme-color`, dan pertimbangkan pra-render (SSG) agar tiap alat bisa ditemukan mesin pencari dan pratinjau tautan tidak kosong. Tambahkan Kebijakan Privasi dan Kontak yang menjelaskan bahwa berkas diproses di perangkat (setelah terbukti, lihat #10) | M | ☐ |

### Fase 2: verifikasi dan kelengkapan

| # | Perbaikan | Langkah | Usaha | Status |
|---|---|---|---|---|
| 10 | **Verifikasi klaim "100% Client-Side Privacy"** | Pantau tab Network saat mengompres PDF dan mengubah gambar: tidak boleh ada berkas yang dikirim ke server atau pihak ketiga. Cek juga domain pihak ketiga (font, analitik). Ini skenario H1, H2, H8, H9 | S | ☐ |
| 11 | **Jalankan bagian E–I yang belum diuji** | Hitung Kata, QR Code, alat lain (G), privasi/keamanan (H: XSS, berkas berbahaya, batas dan rate limit), teknis/SEO/aksesibilitas (I: Lighthouse, keyboard, browser) | M | ☐ |
| 12 | **Uji fungsi 19 alat lainnya** | A6 hanya membuktikan semua alat bisa dibuka (24/24), bukan bahwa fungsinya benar. Jalankan templat G (input valid, kosong, ekstrem, keluaran) untuk tiap alat | L | ☐ |
| 13 | **Uji di perangkat nyata** | D8 diuji di Chrome headless dengan emulasi viewport. Uji di Android, iPhone Safari (batas kanvas, HEIC), dan HP kelas menengah | M | ☐ |
| 14 | **Otomasi** | Jalankan skenario inti di CI setiap deploy | M | ☐ |

---

## 2. Koreksi untuk laporan UAT

| ID | Masalah di laporan | Yang lebih tepat |
|---|---|---|
| **D9** | Dinilai gagal karena EXIF terhapus. Namun hasil keluaran 400×600 menunjukkan rotasi sudah diterapkan sebelum EXIF dibuang | Kemungkinan **false positive**. Menghapus EXIF setelah rotasi diterapkan justru benar dan baik untuk privasi. Cek visual apakah hasil tegak; bila ya, ubah menjadi lulus dan tambahkan catatan di UI bahwa metadata dihapus. Rekomendasi `image-orientation` tidak diperlukan |
| **D1, D2** | Skenario mengharapkan penghapus latar AI, tapi alatnya memang utilitas chroma key photobooth | Masalah sebenarnya adalah nama dan deskripsi di dashboard yang menyesatkan (perbaikan #8). Over-cut D2 adalah efek mode global; solusinya flood fill |
| **B1** | Status lulus, padahal file hasil membengkak (1.565 → 1.579 B) dan UI tetap menyatakan "berhasil dikompres" | Termasuk akar masalah B2/B9; ubah menjadi gagal atau catat sebagai bagian perbaikan #1 |
| **B3, B6** | Lulus secara teknis, tapi karena kompresi nyaris tidak terjadi (6–8%), keutuhan teks dan gambar tidak diuji pada kompresi sungguhan | Uji ulang setelah perbaikan #4 dengan PDF berisi gambar besar |
| **B4** | Kedua preset (Hybrid dan Deflate) menghasilkan ukuran identik 1.579 B | Belum terbukti preset berbeda; uji dengan PDF berisi gambar |
| **A6** | "24 alat berhasil dibuka" | Hanya membuktikan alat tidak crash saat dibuka, bukan bahwa fungsinya benar |
| **A1** | Mencatat teks "100% Client-Side Privacy" di layar | Itu klaim, belum dibuktikan (lihat #10) |
| **Ringkasan** | Tingkat kelulusan 56,3% | Berlaku hanya untuk 32 dari 67 skenario |

---

## 3. Uji ulang setelah perbaikan

- **Otomatis:** A4, A5, B1, B2, B4, B5, B7, B8, B9, C4, C7, D2, D6, D9 (cek visual).
- **Dengan berkas baru:** PDF berisi gambar besar (untuk memastikan kompresi nyata dan preset berbeda), PDF terenkripsi, PDF rusak 63 byte, dan file `.heic`.
- **Manual:** bagian E–I, 19 alat lain, dan perangkat fisik.

---

## 4. Catatan penyelesaian

| Tanggal | Perbaikan # | Catatan |
|---|---|---|
| 7 Nov 2026 | #1, #2, #3 | Branch `fix/fase-0` dibuat. Rencana perbaikan teknis disusun dan menunggu persetujuan user sebelum pengubahan kode. |

