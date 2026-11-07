import { describe, it, expect } from 'vitest';
import { 
  countWords, 
  countChars, 
  countCharsNoSpaces, 
  countSentences, 
  countParagraphs, 
  estimateReadingTime, 
  estimateSpeakingTime,
  toUpper,
  toLower,
  toTitle,
  toSentence,
  toCamel,
  toPascal,
  toSnake,
  toKebab,
  processDuplicateLines,
  parseMarkdownToHtml,
  hexToRgb
} from '../src/utils/tools-logic';
import { TOOLS } from '../src/data/tools';

describe('Fase 2 - Bagian E: Word Counter & Text Analyzer (E1 - E6)', () => {
  it('E1: Teks kosong mengembalikan semua metrik 0', () => {
    expect(countWords('')).toBe(0);
    expect(countWords('   ')).toBe(0);
    expect(countChars('')).toBe(0);
    expect(countCharsNoSpaces('')).toBe(0);
    expect(countSentences('')).toBe(0);
    expect(countParagraphs('')).toBe(0);
    expect(estimateReadingTime(0)).toBe(0);
    expect(estimateSpeakingTime(0)).toBe(0);
  });

  it('E2: Teks dengan jumlah kata yang diketahui (10 kata)', () => {
    const text10 = 'Satu dua tiga empat lima enam tujuh delapan sembilan sepuluh';
    expect(countWords(text10)).toBe(10);
    expect(countChars(text10)).toBe(60);
    expect(countCharsNoSpaces(text10)).toBe(51);
  });

  it('E3: Kasus khusus (emoji, tanda baca, spasi ganda, tanda hubung, baris baru)', () => {
    const specialText = 'Halo 👋 dunia 🌍!  Ini    adalah teks... dengan angka 123 dan kata-kata.';
    expect(countWords(specialText)).toBe(12);
    expect(countSentences(specialText)).toBeGreaterThanOrEqual(2);
  });

  it('E4: Metrik kalimat dan paragraf multi-baris', () => {
    const multiParagraph = 'Paragraf pertama terdiri dari satu kalimat.\n\nParagraf kedua punya dua kalimat! Apakah benar?';
    expect(countParagraphs(multiParagraph)).toBe(2);
    expect(countSentences(multiParagraph)).toBe(3);
  });

  it('E6: Teks sangat besar (100.000 kata) diproses dengan cepat tanpa membeku', () => {
    const largeWord = 'kata ';
    const largeText = largeWord.repeat(100000);
    const start = Date.now();
    const count = countWords(largeText);
    const elapsed = Date.now() - start;
    expect(count).toBe(100000);
    expect(elapsed).toBeLessThan(1000); // Harus selesai dalam < 1 detik
  });
});

describe('Fase 2 - Bagian G: Case Converter & Duplicate Remover', () => {
  it('Case Converter: Mengonversi ke semua format target dengan benar', () => {
    const sample = 'halo dunia modern';
    expect(toUpper(sample)).toBe('HALO DUNIA MODERN');
    expect(toLower(sample)).toBe('halo dunia modern');
    expect(toTitle(sample)).toBe('Halo Dunia Modern');
    expect(toSentence('halo dunia. apa kabar?')).toBe('Halo dunia. Apa kabar?');
    expect(toCamel(sample)).toBe('haloDuniaModern');
    expect(toPascal(sample)).toBe('HaloDuniaModern');
    expect(toSnake(sample)).toBe('halo_dunia_modern');
    expect(toKebab(sample)).toBe('halo-dunia-modern');
  });

  it('Duplicate Remover: Menghapus baris duplikat dengan berbagai opsi', () => {
    const raw = 'Apel\nJeruk\napel\n\nJeruk\nMangga  ';
    
    // Case insensitive, trim whitespace
    const res1 = processDuplicateLines(raw, { trimWhitespace: true, caseSensitive: false, sortAlphabetically: false });
    expect(res1.initialCount).toBe(5); // Baris kosong difilter
    expect(res1.uniqueCount).toBe(3); // Apel, Jeruk, Mangga
    expect(res1.removedCount).toBe(2);

    // Case sensitive
    const res2 = processDuplicateLines(raw, { trimWhitespace: true, caseSensitive: true, sortAlphabetically: false });
    expect(res2.uniqueCount).toBe(4); // Apel, Jeruk, apel, Mangga
  });

  it('Duplicate Remover: Input kosong tidak melempar error', () => {
    const res = processDuplicateLines('');
    expect(res.result).toBe('');
    expect(res.uniqueCount).toBe(0);
    expect(res.removedCount).toBe(0);
  });
});

describe('Fase 2 - Bagian H: Keamanan XSS (H5)', () => {
  it('H5: Markdown parser meng-escape tag script dan HTML berbahaya', () => {
    const malicious = '<script>alert("XSS")</script>';
    const parsed = parseMarkdownToHtml(malicious);
    expect(parsed).not.toContain('<script>');
    expect(parsed).toContain('&lt;script&gt;');
  });

  it('H5: Markdown tag gambar atau link dengan skrip tertanam dinetralkan', () => {
    const xssPayload = '<img src=x onerror=alert(1)>';
    const parsed = parseMarkdownToHtml(xssPayload);
    expect(parsed).not.toContain('<img');
    expect(parsed).toContain('&lt;img');
  });
});

describe('Fase 2 - Bagian F & I: QR Contrast & 404 Route', () => {
  it('F4: hexToRgb mengenali kode warna hex standar dan shorthand', () => {
    const white = hexToRgb('#FFFFFF');
    expect(white).toEqual({ r: 255, g: 255, b: 255 });

    const black = hexToRgb('#000');
    expect(black).toEqual({ r: 0, g: 0, b: 0 });

    const invalid = hexToRgb('invalid');
    expect(invalid).toEqual({ r: 147, g: 197, b: 253 }); // Fallback aman
  });

  it('I3: Semua ID alat di TOOLS valid dan rute tidak dikenal dapat dideteksi', () => {
    expect(TOOLS.length).toBeGreaterThan(20);
    const validTool = TOOLS.some(t => t.id === 'word-counter');
    expect(validTool).toBe(true);

    const unknownTool = TOOLS.some(t => t.id === 'halaman-fiktif-404');
    expect(unknownTool).toBe(false);
  });
});
