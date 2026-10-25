import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import zlib from 'zlib';

async function mergeAndCompress() {
  console.log('📂 Membaca file PDF...');
  const bytes1 = fs.readFileSync('A4 - 1.pdf');
  const bytes2 = fs.readFileSync('A4 - 2.pdf');

  console.log(`  A4-1: ${(bytes1.length / 1024).toFixed(1)} KB`);
  console.log(`  A4-2: ${(bytes2.length / 1024).toFixed(1)} KB`);

  // Load kedua PDF
  const pdf1 = await PDFDocument.load(bytes1, { ignoreEncryption: true });
  const pdf2 = await PDFDocument.load(bytes2, { ignoreEncryption: true });

  // Buat dokumen baru (merged)
  const merged = await PDFDocument.create();

  // Copy semua halaman dari A4-1
  const pages1 = await merged.copyPages(pdf1, pdf1.getPageIndices());
  pages1.forEach(p => merged.addPage(p));

  // Copy semua halaman dari A4-2
  const pages2 = await merged.copyPages(pdf2, pdf2.getPageIndices());
  pages2.forEach(p => merged.addPage(p));

  console.log(`\n✅ Merge selesai: ${merged.getPageCount()} halaman`);

  // Hapus metadata untuk kurangi ukuran
  merged.setTitle('');
  merged.setAuthor('');
  merged.setSubject('');
  merged.setKeywords([]);
  merged.setProducer('');
  merged.setCreator('');

  // Save dengan object streams (lebih efisien)
  console.log('\n⚙️  Menyimpan dengan kompresi object streams...');
  const compressedBytes = await merged.save({
    useObjectStreams: true,  // Kompresi object streams — lebih kecil
    addDefaultPage: false,
    objectsPerTick: 50,
  });

  const outputPath = 'A4-merged.pdf';
  fs.writeFileSync(outputPath, compressedBytes);

  const outSize = compressedBytes.length;
  const inSize = bytes1.length + bytes2.length;
  const ratio = (((inSize - outSize) / inSize) * 100).toFixed(1);

  console.log(`\n📊 Hasil:`);
  console.log(`  Input total : ${(inSize / 1024).toFixed(1)} KB`);
  console.log(`  Output      : ${(outSize / 1024).toFixed(1)} KB`);
  console.log(`  Dikurangi   : ${ratio}%`);
  console.log(`  Di bawah 1MB: ${outSize < 1024 * 1024 ? '✅ YA' : '❌ TIDAK — perlu strategi lain'}`);
  console.log(`\n💾 File tersimpan: ${outputPath}`);

  return outSize;
}

mergeAndCompress().catch(console.error);
