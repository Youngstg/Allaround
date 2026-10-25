/**
 * Buat 3 versi output dengan kualitas berbeda — pilih yang terbaik
 */
import { PDFDocument } from 'pdf-lib';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import { createCanvas } from 'canvas';
import { pathToFileURL } from 'url';
import fs from 'fs';
import path from 'path';

pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(
  path.resolve('./node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs')
).href;

const FILES = ['A4 - 1.pdf', 'A4 - 2.pdf'];

const PRESETS = [
  { name: 'Tinggi  (cetak jelas)',  dpi: 200, quality: 85, outFile: 'result-HIGH.pdf' },
  { name: 'Sedang  (baca layar)',   dpi: 150, quality: 75, outFile: 'result-MED.pdf'  },
  { name: 'Rendah  (ukuran min)',   dpi: 120, quality: 60, outFile: 'result-LOW.pdf'  },
];

async function renderPage(filePath, pageIdx, dpi, quality) {
  const data = new Uint8Array(fs.readFileSync(filePath));
  const doc  = await pdfjs.getDocument({ data, disableFontFace: true }).promise;
  const page = await doc.getPage(pageIdx + 1);

  const scale    = dpi / 72;
  const viewport = page.getViewport({ scale });
  const canvas   = createCanvas(Math.floor(viewport.width), Math.floor(viewport.height));
  const ctx      = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: ctx, viewport }).promise;

  return {
    jpeg  : canvas.toBuffer('image/jpeg', { quality: quality / 100 }),
    width : canvas.width,
    height: canvas.height,
  };
}

async function buildPdf(preset) {
  const merged = await PDFDocument.create();

  for (const file of FILES) {
    const data    = new Uint8Array(fs.readFileSync(file));
    const doc     = await pdfjs.getDocument({ data }).promise;
    const nPages  = doc.numPages;

    for (let i = 0; i < nPages; i++) {
      const { jpeg, width, height } = await renderPage(file, i, preset.dpi, preset.quality);
      const img  = await merged.embedJpg(jpeg);
      const wPt  = (width  / preset.dpi) * 72;
      const hPt  = (height / preset.dpi) * 72;
      const pg   = merged.addPage([wPt, hPt]);
      pg.drawImage(img, { x: 0, y: 0, width: wPt, height: hPt });
    }
  }

  const bytes = await merged.save({ useObjectStreams: true });
  fs.writeFileSync(preset.outFile, bytes);
  return bytes.length;
}

async function main() {
  const inTotal = FILES.reduce((s, f) => s + fs.statSync(f).size, 0);
  console.log('='.repeat(58));
  console.log('  AllAround PDF — Merge & Compress (3 preset)');
  console.log('='.repeat(58));
  console.log(`  Input: ${FILES.join(' + ')}`);
  console.log(`  Total input : ${(inTotal / 1024).toFixed(1)} KB (${(inTotal/1024/1024).toFixed(2)} MB)`);
  console.log('─'.repeat(58));

  for (const preset of PRESETS) {
    process.stdout.write(`  [${preset.name}] DPI=${preset.dpi} Q=${preset.quality}% ... `);
    const size = await buildPdf(preset);
    const kb   = (size / 1024).toFixed(1);
    const pct  = (((inTotal - size) / inTotal) * 100).toFixed(1);
    const ok   = size < 1024 * 1024 ? '✅ <1MB' : '❌ >1MB';
    console.log(`${kb} KB  (−${pct}%)  ${ok}  → ${preset.outFile}`);
  }

  console.log('─'.repeat(58));
  console.log('  ⚠️  Catatan: versi ini teks TIDAK bisa diselect (trade-off)');
  console.log('  💡 Buka file result-*.pdf dan pilih kualitas yang cocok!');
  console.log('='.repeat(58));
}

main().catch(console.error);
