# 🎬 Script & Materi Video: Rahasia Kompres PDF Jadi < 1MB Tanpa Hilang Teks Seleksi

> **Judul Rekomendasi Video:**  
> - *"Kenapa Web Kompres PDF Bikin Teks Hilang? Begini Solusi Teknikalnya!"*  
> - *"Bedah Jeroan File PDF: Cara Kompres PDF 3MB Jadi 700KB & Teks Tetap Bisa Di-Select (Bukan Kaleng-Kaleng)"*  
> - *"Rahasia Algoritma Hybrid Sandwich PDF Engine: Solusi Kompresi CV & Dokumen Kerja"*  
>
> **Format:** YouTube Tech Breakdown / Shorts / Reels / LinkedIn Tech Post  
> **Target Audience:** Programmer, Mahasiswa, Jobseeker, Tech Enthusiast  

---

## 📌 1. Hook (0:00 - 0:45)
*Target: Bikin penonton langsung relate dan penasaran.*

### 🎙️ Narasi / Talking Points:
> *"Pernah nggak kalian mau upload CV ke portal kerja atau email, tapi mentok syarat: **'Maksimal ukuran file 1 MB'**?*  
> *Lalu kalian buka situs kompres PDF populer di internet... dan hasilnya ada dua skenario nyebelin:*  
> 1. *Ukurannya nggak turun banyak (tetap di atas 1MB atau cuma turun dikit).*  
> 2. *Ukurannya memang turun jadi 500KB, tapi pas dibuka... **SEMUA TEKS BERUBAH JADI GAMBAR**, nggak bisa di-blok, nggak bisa di-copy-paste, dan kalau ATS (Applicant Tracking System) scan CV kalian, hasilnya **KOSONG** alias auto-reject!*  
>  
> *Kenapa hal ini bisa terjadi? Dan gimana kita bisa bikin algoritma kompresi sendiri yang bisa pangkas file 3MB jadi 700KB, tetap tajam, dan **teksnya 100% tetap bisa diselect & dicopy-paste**?*  
> *Mari kita bedah jeroan file PDF-nya sampai ke tingkat byte!"*

---

## 🕵️ 2. Bedah Masalah: Mengapa File PDF Bisa Bengkak? (0:45 - 2:00)
*Target: Edukasi teknis yang visual dan bikin penonton paham akar masalah.*

### 🔍 Kasus Nyata: File CV `A4 - 1.pdf` & `A4 - 2.pdf`
Saat kita menginspeksi file PDF asli (misalnya hasil export dari Canva, Figma, Google Docs, atau Chrome Print):
- **Jumlah Halaman:** Hanya 2 Halaman A4
- **Jumlah Gambar:** **0 Gambar** (Nol gambar sama sekali!)
- **Ukuran File:** **2.87 MB** (Kenapa 2 lembar teks bisa sebesar 3 MB?!)

### 🔬 Jeroan File PDF:
Saat didekompresi dan dibongkar content stream-nya:
```text
=== A4 - 1.pdf ===
Operator Teks (BT/ET): 215 blok
Operator Kurva Vektor (m/l/c/h): 64.704 operasi!
Baris stream: 71.980 baris angka floating-point
```

### 💡 Penjelasan Masalah:
1. **Text as Outlines (Kurva Vektor):**
   Aplikasi pembuat desain mengubah setiap huruf menjadi ratusan garis kurva bezier (`c`, `l`, `m`).
   Contoh potongan koordinat di dalam file:
   ```pdf
   17.380505 0.933243 17.011896 0.470886 16.496271 0.121454 c
   15.984908 -0.227978 15.360619 -0.402693 14.623403 -0.402693 c
   ```
2. **Kenapa Zlib/Flate Gagal Kompres?**
   Angka desimal 6 digit (seperti `17.380505`) memiliki entropi tinggi dan pola acak. Algoritma kompresi teks standar tidak bisa memampatkannya secara signifikan.
3. **Kenapa Web Lain Merusak Teks?**
   Ketika situs kompresi online memilih mode "Extreme Compression", mereka cuma mengambil jalan pintas: me-rasterize seluruh halaman menjadi gambar JPEG lalu membuang semua metadata & stream teks. Akibatnya teks hilang total!

---

## 💡 3. The "Aha!" Moment: Konsep *Hybrid Sandwich PDF Engine* (2:00 - 3:30)
*Target: Menjelaskan solusi arsitektur yang elegan.*

### 🥪 Konsep Tiga Lapisan (Sandwich):
Alih-alih memilih antara "hanya teks vektor bengkak" atau "hanya gambar gepeng tanpa teks", kita ciptakan struktur **Hybrid Sandwich**:

```
┌────────────────────────────────────────────────────────┐
│  LAYER 2 (ATAS): INVISIBLE TEXT LAYER (render_mode = 3) │  <-- Bisa di-blok, di-copy, & Ctrl+F
├────────────────────────────────────────────────────────┤
│  LAYER 1 (BAWAH): CRISP RENDERED IMAGE (180 DPI JPEG)  │  <-- Tampilan visual super jernih
└────────────────────────────────────────────────────────┘
```

1. **Layer Dasar (Visual):**
   Kita render halaman vektor kompleks tersebut menjadi gambar JPEG beresolusi 180 DPI dengan kualitas terkalibrasi (82%). 
   - 180 DPI memberikan ketajaman setara cetak kertas fisik.
   - Ukurannya hanya **~340 KB** per halaman!
2. **Layer Atas (Teks & Semantik):**
   Kita ekstrak setiap kata, baris, origin koordinat `(x, y)`, dan ukuran font aslinya dari dokumen sumber.
   Lalu kita letakkan kembali teks tersebut tepat di atas gambar menggunakan **`render_mode = 3` (Invisible Text)**.
3. **Hasil Sinergi:**
   - Mata penonton melihat gambar beresolusi tinggi yang tajam.
   - Kursor mouse penonton berinteraksi dengan teks tak kasat mata yang presisi di titik koordinat yang sama persis!

---

## 💻 4. Bedah Kode Python / Backend Engine (3:30 - 5:00)
*Target: Menampilkan implementasi teknis yang nyata & clean.*

```python
import pymupdf
import os

FILES = ["A4 - 1.pdf", "A4 - 2.pdf"]
OUTPUT_FILE = "A4-merged-compressed-perfect.pdf"

out_doc = pymupdf.open()

for fpath in FILES:
    src_doc = pymupdf.open(fpath)
    
    for page in src_doc:
        rect = page.rect
        
        # 1. RENDER LAPISAN VISUAL (180 DPI, Quality 82)
        pix = page.get_pixmap(dpi=180)
        img_bytes = pix.tobytes(output="jpg", jpg_quality=82)
        
        # 2. EKSTRAK POSISI TEKS ASLI (Origin, Size, Bounding Box)
        text_data = page.get_text("dict")
        
        # 3. BUAT HALAMAN BARU & PASANG GAMBAR DI BAWAH
        new_page = out_doc.new_page(width=rect.width, height=rect.height)
        new_page.insert_image(rect, stream=img_bytes)
        
        # 4. OVERLAY LAPISAN TEKS (render_mode=3 / Invisible)
        for block in text_data.get("blocks", []):
            if "lines" not in block:
                continue
            for line in block["lines"]:
                for span in line["spans"]:
                    text = span["text"]
                    if not text.strip():
                        continue
                    origin = pymupdf.Point(span["origin"][0], span["origin"][1])
                    
                    # render_mode=3 = Teks tetap ada & bisa diselect, tapi transparan
                    new_page.insert_text(
                        origin,
                        text,
                        fontsize=span["size"],
                        fontname="helv",
                        render_mode=3
                    )

# 5. SIMPAN DENGAN GARBAGE COLLECTION & STREAM DEFLATING
out_doc.save(OUTPUT_FILE, garbage=4, deflate=True, clean=True)
```

---

## 📊 5. Hasil Uji & Pembuktian (Live Demo / Benchmark) (5:00 - 6:00)
*Target: Menunjukkan bukti nyata bahwa solusi ini bekerja 100%.*

### Tabel Komparasi Hasil:
| Parameter | File Input Asli | Web Kompres Biasa | Hybrid Sandwich Engine (AllAround) |
| :--- | :--- | :--- | :--- |
| **Ukuran Total** | 2.87 MB | ~1.8 MB (masih > 1MB) | **698.4 KB (Turun 76.3%)** |
| **Bisa Di-Select Teks?** | Ya | Seringkali TIDAK (jadi img) | **100% BISA (3.009 karakter)** |
| **Bisa Di-Search (Ctrl+F)?**| Ya | Gagal | **100% BISA** |
| **Kompatibel ATS CV?** | Ya | Tidak terbaca | **Terbaca Sempurna** |
| **Ketajaman Visual** | Vektor berat | Pecah / Buram | **Sangat Tajam (180 DPI)** |

---

## 🎯 6. Outro & Call to Action (6:00 - Selesai)
*Target: Menghubungkan ke proyek web AllAround.*

### 🎙️ Narasi Penutup:
> *"Nah, algoritma ini sekarang sedang saya integrasikan langsung ke dalam web app buatan saya: **AllAround** — sebuah platform tool harian multifungsi yang ringan, estetik dengan tema warna pastel, dan memprioritaskan privasi pengguna.*  
>  
> *Kalau kalian suka dengan bedah teknikal seperti ini, jangan lupa like, subscribe, dan drop pertanyaan di kolom komentar:*  
> *'Kalian lebih sering pakai tool kompresi apa selama ini, dan masalah apa yang paling bikin kalian kesel?'*  
> *Sampai jumpa di video berikutnya!"*

---

## 🎨 Asset Tambahan untuk Slide / Video
1. **Thumbnail Ideas:**
   - Background: Split screen (Kiri: "PDF Biasa 2.8MB ❌ Error Upload", Kanan: "AllAround 698KB ✅ Teks Bisa Di-Select").
   - Headline: *"KOMPRES PDF TANPA MERUSAK TEKS!"*
2. **B-Roll / Screen Recording:**
   - Tunjukkan kursor menyeleksi teks di file hasil `A4-merged-compressed-perfect.pdf`.
   - Tekan `Ctrl + F` dan cari kata *"Lucky"*, *"Software"*, atau *"Next.js"*.
   - Buka properties file dan tunjukkan ukuran `698 KB`.
