/**
 * PDF Merge + Aggressive Compress via image re-rendering
 * Strategy: render each PDF page → JPEG (quality 70, 120 DPI) → embed back to PDF
 * Result: teks tidak bisa diselect, tapi ukuran sangat kecil
 */
import { PDFDocument, rgb } from 'pdf-lib';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';

// Set pdf.js worker — must use file:// URL on Windows
import { pathToFileURL } from 'url';
const PDFJS_WORKER = pathToFileURL(
  path.resolve('./node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs')
).href;
pdfjs.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;

async function renderPageToJpeg(pdfPath, pageIndex, dpi = 120, quality = 70) {
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const doc = await pdfjs.getDocument({ data, disableFontFace: true }).promise;
  const page = await doc.getPage(pageIndex + 1);

  const scale = dpi / 72; // 72 is default PDF DPI
  const viewport = page.getViewport({ scale });

  const canvas = createCanvas(Math.floor(viewport.width), Math.floor(viewport.height));
  const ctx = canvas.getContext('2d');

  // White background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  await page.render({
    canvasContext: ctx,
    viewport,
  }).promise;

  // Return as JPEG buffer
  return {
    buffer: canvas.toBuffer('image/jpeg', { quality: quality / 100 }),
    width: canvas.width,
    height: canvas.height,
  };
}

async function main() {
  const files = ['A4 - 1.pdf', 'A4 - 2.pdf'];
  const DPI = 120;       // 120 DPI = cukup jelas dibaca, lebih kecil dari 150
  const QUALITY = 68;    // JPEG quality 68% = sweet spot size vs clarity

  console.log(`🖨️  Render PDF → JPEG @ ${DPI}DPI, quality=${QUALITY}%`);
  console.log('   (teks tetap terbaca, ukuran sangat dikurangi)\n');

  const mergedPdf = await PDFDocument.create();
  let totalJpegSize = 0;

  for (const file of files) {
    const data = new Uint8Array(fs.readFileSync(file));
    const doc = await pdfjs.getDocument({ data }).promise;
    const numPages = doc.numPages;

    console.log(`📄 Memproses ${file} (${numPages} halaman)...`);

    for (let i = 0; i < numPages; i++) {
      process.stdout.write(`   Halaman ${i + 1}/${numPages}... `);
      const { buffer, width, height } = await renderPageToJpeg(file, i, DPI, QUALITY);
      totalJpegSize += buffer.length;
      process.stdout.write(`${(buffer.length / 1024).toFixed(0)} KB\n`);

      // Embed JPEG image ke PDF
      const jpgImage = await mergedPdf.embedJpg(buffer);

      // Buat halaman sesuai ukuran asli (converted to PDF points)
      // 1 point = 1/72 inch; width/height dalam pixels @ DPI → convert ke points
      const wPt = (width / DPI) * 72;
      const hPt = (height / DPI) * 72;

      const page = mergedPdf.addPage([wPt, hPt]);
      page.drawImage(jpgImage, {
        x: 0,
        y: 0,
        width: wPt,
        height: hPt,
      });
    }
  }

  // Save compressed PDF
  const outBytes = await mergedPdf.save({ useObjectStreams: true });
  const outPath = 'A4-merged-compressed.pdf';
  fs.writeFileSync(outPath, outBytes);

  const inTotal = files.reduce((s, f) => s + fs.statSync(f).size, 0);
  const outSize = outBytes.length;
  const reduction = (((inTotal - outSize) / inTotal) * 100).toFixed(1);

  console.log('\n📊 Ringkasan:');
  console.log(`  Input total    : ${(inTotal / 1024).toFixed(1)} KB`);
  console.log(`  JPEG total     : ${(totalJpegSize / 1024).toFixed(1)} KB`);
  console.log(`  Output PDF     : ${(outSize / 1024).toFixed(1)} KB`);
  console.log(`  Pengurangan    : ${reduction}%`);
  console.log(`  Di bawah 1 MB  : ${outSize < 1024 * 1024 ? '✅ YA!' : '❌ TIDAK'}`);
  console.log(`\n💾 Tersimpan di: ${outPath}`);

  // Jika masih > 1MB, coba kualitas lebih rendah lagi
  if (outSize >= 1024 * 1024) {
    console.log('\n⚠️  Masih > 1MB. Coba lagi dengan quality=50 dan DPI=96...');
    await tryLowerQuality(files, 96, 50);
  }
}

async function tryLowerQuality(files, dpi, quality) {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const data = new Uint8Array(fs.readFileSync(file));
    const doc = await pdfjs.getDocument({ data }).promise;
    const numPages = doc.numPages;

    for (let i = 0; i < numPages; i++) {
      const { buffer, width, height } = await renderPageToJpeg(file, i, dpi, quality);
      const jpgImage = await mergedPdf.embedJpg(buffer);
      const wPt = (width / dpi) * 72;
      const hPt = (height / dpi) * 72;
      const page = mergedPdf.addPage([wPt, hPt]);
      page.drawImage(jpgImage, { x: 0, y: 0, width: wPt, height: hPt });
    }
  }

  const outBytes = await mergedPdf.save({ useObjectStreams: true });
  const outPath = 'A4-merged-compressed-v2.pdf';
  fs.writeFileSync(outPath, outBytes);

  console.log(`  Output (DPI=${dpi}, Q=${quality}): ${(outBytes.length / 1024).toFixed(1)} KB`);
  console.log(`  Di bawah 1 MB : ${outBytes.length < 1024 * 1024 ? '✅ YA!' : '❌ TIDAK'}`);
  console.log(`  Tersimpan di  : ${outPath}`);
}

main().catch(console.error);
