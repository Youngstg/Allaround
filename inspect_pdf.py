import pikepdf
import os

for fname in ['A4 - 1.pdf', 'A4 - 2.pdf']:
    if not os.path.exists(fname):
        print(f"File not found: {fname}")
        continue
    pdf = pikepdf.Pdf.open(fname)
    print(f"=== {fname} ({os.path.getsize(fname)/1024:.1f} KB) ===")
    print(f"Pages: {len(pdf.pages)}")
    for i, page in enumerate(pdf.pages):
        images = list(page.images.keys())
        print(f"  Page {i+1}: {len(images)} images")
        for img_name, img_obj in page.images.items():
            try:
                w = getattr(img_obj, 'Width', 'unknown')
                h = getattr(img_obj, 'Height', 'unknown')
                filt = img_obj.get(pikepdf.Name('/Filter'), 'None')
                raw_len = len(img_obj.read_raw_bytes())
                print(f"    Image {img_name}: {w}x{h}, Filter={filt}, StreamBytes={raw_len/1024:.1f} KB")
            except Exception as e:
                print(f"    Image {img_name}: error {e}")
        # Check fonts / text
        resources = page.get(pikepdf.Name('/Resources'), {})
        fonts = resources.get(pikepdf.Name('/Font'), {})
        print(f"  Page {i+1} Fonts: {list(fonts.keys()) if fonts else 'No /Font'}")
