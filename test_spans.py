import pymupdf

doc = pymupdf.open('A4 - 1.pdf')
page = doc[0]
d = page.get_text('dict')
print('Blocks count:', len(d['blocks']))
sample_block = [b for b in d['blocks'] if b.get('lines')][:3]
for b in sample_block:
    for line in b['lines']:
        for span in line['spans']:
            print(f"Span: {repr(span['text'])} | size: {span['size']:.1f} | origin: ({span['origin'][0]:.1f}, {span['origin'][1]:.1f})")
