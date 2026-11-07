import { describe, it, expect } from 'vitest';
import { processBackgroundRemoval, RGB } from '../src/utils/tools-logic';
import { TOOLS } from '../src/data/tools';

describe('Fase 1: Uji Fitur & Anti Over-Cut', () => {

  // ==========================================
  // 1. Edge-Connected Flood Fill (D2 Anti Over-Cut)
  // ==========================================
  describe('Background Removal: Edge-Connected Flood Fill (#8)', () => {
    it('harus menghapus latar putih di tepi luar namun TIDAK melubangi label putih di dalam produk', () => {
      const width = 10;
      const height = 10;
      // Buat image 10x10 RGBA
      const data = new Uint8ClampedArray(width * height * 4);

      // Inisialisasi semua pixel dengan background putih (#FFFFFF, alpha 255)
      for (let i = 0; i < width * height; i++) {
        data[i * 4] = 255;
        data[i * 4 + 1] = 255;
        data[i * 4 + 2] = 255;
        data[i * 4 + 3] = 255;
      }

      // Buat botol hijau mengelilingi area tengah (x: 2..7, y: 2..7)
      for (let y = 2; y <= 7; y++) {
        for (let x = 2; x <= 7; x++) {
          const idx = (y * width + x) * 4;
          data[idx] = 5;     // R
          data[idx + 1] = 150; // G (Green)
          data[idx + 2] = 105; // B
          data[idx + 3] = 255;
        }
      }

      // Buat label putih di dalam botol (x: 4..5, y: 4..5)
      for (let y = 4; y <= 5; y++) {
        for (let x = 4; x <= 5; x++) {
          const idx = (y * width + x) * 4;
          data[idx] = 255; // White label
          data[idx + 1] = 255;
          data[idx + 2] = 255;
          data[idx + 3] = 255;
        }
      }

      // Jalankan processBackgroundRemoval pada mode 'global' dengan target putih
      processBackgroundRemoval(data, width, height, {
        targetColor: { r: 255, g: 255, b: 255 },
        tolerance: 20,
        feather: 0,
        replacementColor: { r: 0, g: 0, b: 0, a: 0 }, // transparent
        mode: 'global',
      });

      // 1. Verifikasi pixel pojok luar (0, 0): harus terhapus menjadi transparan (Alpha = 0)
      const cornerIdx = 0;
      expect(data[cornerIdx + 3]).toBe(0);

      // 2. Verifikasi pixel label putih di tengah (4, 4): HARUS TETAP UTUH (Alpha = 255)!
      const labelIdx = (4 * width + 4) * 4;
      expect(data[labelIdx]).toBe(255);
      expect(data[labelIdx + 1]).toBe(255);
      expect(data[labelIdx + 2]).toBe(255);
      expect(data[labelIdx + 3]).toBe(255); // Alpha tetap 255! Tidak terjadi over-cut!
    });
  });

  // ==========================================
  // 2. Pemetaan URL Tool Id (A5)
  // ==========================================
  describe('Pemetaan Tool ID & Routing URL (#5)', () => {
    it('setiap alat harus memiliki ID unik yang valid untuk pathname', () => {
      const ids = TOOLS.map(t => t.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(TOOLS.length);

      // Seluruh ID harus URL-friendly (hanya lowercase, angka, dan hyphen)
      ids.forEach(id => {
        expect(id).toMatch(/^[a-z0-9\-]+$/);
      });
    });

    it('harus memetakan tool penting ke ID yang sesuai', () => {
      const pdfComp = TOOLS.find(t => t.id === 'pdf-compressor');
      expect(pdfComp).toBeDefined();
      expect(pdfComp?.name).toBe('PDF Compressor');

      const bgChanger = TOOLS.find(t => t.id === 'image-bg-changer');
      expect(bgChanger).toBeDefined();
      expect(bgChanger?.name).toContain('Photobooth');
    });
  });

  // ==========================================
  // 3. Pencarian Alat & Empty State (#6)
  // ==========================================
  describe('Pencarian Alat & Filter Kategori (#6)', () => {
    it('harus menemukan alat relevan untuk query "pdf"', () => {
      const query = 'pdf';
      const matched = TOOLS.filter(t => 
        t.name.toLowerCase().includes(query) || 
        t.description.toLowerCase().includes(query)
      );
      expect(matched.length).toBeGreaterThanOrEqual(4);
    });

    it('harus menghasilkan 0 alat untuk query yang tidak ada', () => {
      const query = 'xyz123tidakada';
      const matched = TOOLS.filter(t => 
        t.name.toLowerCase().includes(query) || 
        t.description.toLowerCase().includes(query)
      );
      expect(matched.length).toBe(0);
    });
  });
});

