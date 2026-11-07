import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';
import { 
  validatePdfHeader, 
  processPdfCompression, 
  MAX_PDF_SIZE_BYTES 
} from '../src/utils/pdf-logic';

const BERKAS_DIR = path.resolve('uat', 'berkas-uji');

describe('Fase 0: Validasi dan Logika Kompresi PDF', () => {

  // ==========================================
  // 1. Validasi Header %PDF-
  // ==========================================
  describe('validatePdfHeader', () => {
    it('harus menerima buffer dengan header %PDF-', () => {
      const headerBytes = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x34]); // %PDF-1.4
      const result = validatePdfHeader(headerBytes);
      expect(result.valid).toBe(true);
    });

    it('harus menolak buffer yang tidak memiliki header %PDF-', () => {
      const fakeBytes = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10]); // JPEG magic bytes
      const result = validatePdfHeader(fakeBytes);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('bukan dokumen PDF');
    });

    it('harus menolak buffer yang terlalu kecil (< 5 bytes)', () => {
      const tinyBytes = new Uint8Array([0x25, 0x50]);
      const result = validatePdfHeader(tinyBytes);
      expect(result.valid).toBe(false);
    });
  });

  // ==========================================
  // 2. Batas Ukuran File (Max 25 MB)
  // ==========================================
  describe('Batas Ukuran Berkas 25 MB', () => {
    it('harus menolak file yang melebihi 25 MB seketika', async () => {
      const dummyBuffer = new ArrayBuffer(100);
      const fakeLargeSize = 26 * 1024 * 1024; // 26 MB

      const result = await processPdfCompression(dummyBuffer, fakeLargeSize);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Ukuran file melebihi batas maksimal 25 MB');
    });
  });

  // ==========================================
  // 3. Penanganan PDF Berkata Sandi (B7)
  // ==========================================
  describe('Penanganan PDF Terenkripsi / Password (B7)', () => {
    it('harus menolak PDF berpassword dengan pesan ramah, tanpa ignoreEncryption', async () => {
      const passPath = path.join(BERKAS_DIR, 'pdf_password.pdf');
      if (fs.existsSync(passPath)) {
        const fileBuf = fs.readFileSync(passPath);
        const arrayBuf = fileBuf.buffer.slice(fileBuf.byteOffset, fileBuf.byteOffset + fileBuf.byteLength);

        const result = await processPdfCompression(arrayBuf, fileBuf.length);
        expect(result.success).toBe(false);
        expect(result.error).toBe('PDF ini dikunci kata sandi, buka kuncinya dulu.');
      }
    });
  });

  // ==========================================
  // 4. Penanganan Berkas Rusak & Palsu (B8)
  // ==========================================
  describe('Penanganan Berkas Rusak & Palsu (B8)', () => {
    it('harus menolak file palsu JPEG berekstensi PDF', async () => {
      const fakePath = path.join(BERKAS_DIR, 'file_palsu_jpg.pdf');
      if (fs.existsSync(fakePath)) {
        const fileBuf = fs.readFileSync(fakePath);
        const arrayBuf = fileBuf.buffer.slice(fileBuf.byteOffset, fileBuf.byteOffset + fileBuf.byteLength);

        const result = await processPdfCompression(arrayBuf, fileBuf.length);
        expect(result.success).toBe(false);
        expect(result.error).toContain('bukan dokumen PDF');
      }
    });

    it('harus menolak file PDF rusak 63 byte tanpa menghasilkan file 0 KB', async () => {
      const rusakPath = path.join(BERKAS_DIR, 'pdf_rusak.pdf');
      if (fs.existsSync(rusakPath)) {
        const fileBuf = fs.readFileSync(rusakPath);
        const arrayBuf = fileBuf.buffer.slice(fileBuf.byteOffset, fileBuf.byteOffset + fileBuf.byteLength);

        const result = await processPdfCompression(arrayBuf, fileBuf.length);
        expect(result.success).toBe(false);
        expect(result.error).toBe('File PDF rusak atau tidak lengkap.');
        expect(result.compressedBytes).toBeUndefined();
      }
    });
  });

  // ==========================================
  // 5. Kejujuran Ukuran & Berkas Sudah Optimal (B2 & B9)
  // ==========================================
  describe('Kejujuran Ukuran Kompresi (B2 & B9)', () => {
    it('tidak boleh menggunakan konstanta pengali fiktif 0.45', async () => {
      const smallPdfPath = path.join(BERKAS_DIR, 'pdf_kecil.pdf');
      if (fs.existsSync(smallPdfPath)) {
        const fileBuf = fs.readFileSync(smallPdfPath);
        const arrayBuf = fileBuf.buffer.slice(fileBuf.byteOffset, fileBuf.byteOffset + fileBuf.byteLength);

        const result = await processPdfCompression(arrayBuf, fileBuf.length, 'hybrid');
        expect(result.success).toBe(true);

        // Ukuran hasil tidak boleh merupakan Math.floor(file.size * 0.45)
        const fakeMultiplierSize = Math.floor(fileBuf.length * 0.45);
        expect(result.finalSize).not.toBe(fakeMultiplierSize);
      }
    });

    it('harus mengembalikan file asli jika hasil kompresi membengkak (B9)', async () => {
      const verySmallPdfPath = path.join(BERKAS_DIR, 'pdf_sangat_kecil.pdf');
      if (fs.existsSync(verySmallPdfPath)) {
        const fileBuf = fs.readFileSync(verySmallPdfPath);
        const arrayBuf = fileBuf.buffer.slice(fileBuf.byteOffset, fileBuf.byteOffset + fileBuf.byteLength);

        const result = await processPdfCompression(arrayBuf, fileBuf.length, 'hybrid');
        expect(result.success).toBe(true);
        expect(result.isOptimized).toBe(true);
        expect(result.finalSize).toBe(fileBuf.length);
        expect(result.message).toBe('File sudah optimal, kompresi tidak memperkecil ukuran.');
        // Berkas asli dikembalikan, tidak ada pembengkakan yang dipaksakan
        expect(result.compressedBytes?.length).toBe(fileBuf.length);
      }
    });
  });
});

