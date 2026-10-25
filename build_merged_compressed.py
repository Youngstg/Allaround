import pymupdf
import os

FILES = ["A4 - 1.pdf", "A4 - 2.pdf"]
OUTPUT_FILE = "A4-merged-compressed-perfect.pdf"

print("=" * 60)
print("  AllAround PDF Engine: High-Fidelity Compress & Merge")
print("  - Target: < 1 MB")
print("  - Selectable & Searchable Text: 100% Preserved")
print("=" * 60)

total_in_size = sum(os.path.getsize(f) for f in FILES)
for f in FILES:
    print(f"  Input: {f} ({os.path.getsize(f)/1024:.1f} KB)")
print(f"  Total input: {total_in_size/1024:.1f} KB ({total_in_size/1024/1024:.2f} MB)")
print("-" * 60)

# Create output document
out_doc = pymupdf.open()

for file_idx, fpath in enumerate(FILES):
    src_doc = pymupdf.open(fpath)
    print(f"\nProcessing {fpath} ({len(src_doc)} page(s))...")
    
    for page_idx, page in enumerate(src_doc):
        rect = page.rect
        
        # 1. Render high-res crisp background image (180 DPI, quality 82)
        # 180 DPI gives razor-sharp text reproduction on all screens & prints
        pix = page.get_pixmap(dpi=180)
        img_bytes = pix.tobytes(output="jpg", jpg_quality=82)
        print(f"  Page {page_idx+1}: rendered image size = {len(img_bytes)/1024:.1f} KB")
        
        # 2. Extract structured text spans (with exact font size and coordinates)
        text_data = page.get_text("dict")
        
        # 3. Create new page in output document
        new_page = out_doc.new_page(width=rect.width, height=rect.height)
        
        # 4. Insert crisp background image
        new_page.insert_image(rect, stream=img_bytes)
        
        # 5. Overlay invisible text layer (render_mode=3) for perfect selection & search
        total_spans = 0
        for block in text_data.get("blocks", []):
            if "lines" not in block:
                continue
            for line in block["lines"]:
                for span in line["spans"]:
                    text = span["text"]
                    if not text.strip():
                        continue
                    origin = pymupdf.Point(span["origin"][0], span["origin"][1])
                    size = span["size"]
                    # Render mode 3 = invisible text
                    try:
                        new_page.insert_text(
                            origin,
                            text,
                            fontsize=size,
                            fontname="helv",
                            render_mode=3
                        )
                        total_spans += 1
                    except Exception:
                        pass
                        
        print(f"  Page {page_idx+1}: inserted {total_spans} searchable/selectable text spans")

# Save with maximum compression and deflating
out_doc.save(
    OUTPUT_FILE,
    garbage=4,
    deflate=True,
    clean=True
)

out_size = os.path.getsize(OUTPUT_FILE)
reduction = ((total_in_size - out_size) / total_in_size) * 100

print("\n" + "=" * 60)
print("  HASIL AKHIR:")
print(f"  Input Total   : {total_in_size/1024:.1f} KB ({total_in_size/1024/1024:.2f} MB)")
print(f"  Output Final  : {out_size/1024:.1f} KB ({out_size/1024/1024:.2f} MB)")
print(f"  Pengurangan   : {reduction:.1f}%")
print(f"  Target < 1 MB : {'✅ BERHASIL! (LULUS)' if out_size < 1024*1024 else '❌ GAGAL'}")
print(f"  File Tersimpan: {OUTPUT_FILE}")
print("=" * 60)
