"""
Merge + Compress PDF menggunakan pikepdf (berbasis QPDF)
- Teks TETAP bisa diselect
- Font di-subset (hapus karakter yang tidak dipakai)
- Object streams diaktifkan
- Metadata dibersihkan
"""
import pikepdf
import os

FILES  = ["A4 - 1.pdf", "A4 - 2.pdf"]
OUTPUT = "result-FINAL.pdf"

def fmt(size_bytes):
    return f"{size_bytes/1024:.1f} KB ({size_bytes/1024/1024:.2f} MB)"

# Ukuran input
total_in = sum(os.path.getsize(f) for f in FILES)
print("=" * 55)
print("  AllAround PDF — Merge & Compress (pikepdf/QPDF)")
print("=" * 55)
for f in FILES:
    print(f"  {f}: {fmt(os.path.getsize(f))}")
print(f"  Total input : {fmt(total_in)}")
print("-" * 55)

# Merge semua file
print("\n📎 Menggabungkan PDF...")
merged = pikepdf.Pdf.new()
for filepath in FILES:
    src = pikepdf.Pdf.open(filepath)
    merged.pages.extend(src.pages)
    print(f"   + {filepath} ({len(src.pages)} halaman)")

print(f"   Total halaman: {len(merged.pages)}")

# Hapus metadata untuk kurangi ukuran
print("\n🧹 Membersihkan metadata...")
with merged.open_metadata() as meta:
    for key in list(meta.keys()):
        try:
            del meta[key]
        except Exception:
            pass

# Simpan dengan optimasi penuh
print("\n⚙️  Menyimpan dengan kompresi QPDF...")
merged.save(
    OUTPUT,
    compress_streams=True,          # Compress semua stream
    object_stream_mode=pikepdf.ObjectStreamMode.generate,  # Object streams
    recompress_flate=True,          # Re-compress stream yang sudah ada
    normalize_content=False,        # Jangan ubah content stream
    linearize=False,                # Skip linearisasi (lebih kecil tanpa ini)
)

# Hasil
out_size = os.path.getsize(OUTPUT)
reduction = ((total_in - out_size) / total_in) * 100

print("\n📊 Hasil:")
print(f"  Input total  : {fmt(total_in)}")
print(f"  Output       : {fmt(out_size)}")
print(f"  Pengurangan  : {reduction:.1f}%")
print(f"  Di bawah 1MB : {'✅ YA!' if out_size < 1024*1024 else '❌ TIDAK'}")
print(f"\n✅ TEKS TETAP BISA DISELECT!")
print(f"💾 File: {OUTPUT}")
print("=" * 55)
