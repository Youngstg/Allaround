import { describe, it, expect } from 'vitest';
import {
  toUpper,
  toLower,
  toTitle,
  toSentence,
  toCamel,
  toPascal,
  toSnake,
  toKebab,
  countWords,
  countChars,
  countCharsNoSpaces,
  countSentences,
  countParagraphs,
  estimateReadingTime,
  estimateSpeakingTime,
  processDuplicateLines,
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  parseTargetColor,
  detectCornerColor,
  processBackgroundRemoval,
  parseToDec,
  formatBinary,
  calculateBinary,
  convertUnit,
  generatePassword,
  calculatePasswordStrength,
  formatUuid,
  parseMarkdownToHtml,
  computeTextDiff,
  formatHtml,
  minifyHtml,
  countHtmlTags,
  extractHtmlTitle,
} from '../src/utils/tools-logic';

describe('1. Text Case Conversion Functions', () => {
  it('converts to uppercase correctly', () => {
    expect(toUpper('halo dunia')).toBe('HALO DUNIA');
    expect(toUpper('')).toBe('');
  });

  it('converts to lowercase correctly', () => {
    expect(toLower('HALO DUNIA')).toBe('halo dunia');
    expect(toLower('')).toBe('');
  });

  it('converts to title case correctly without deprecated methods', () => {
    expect(toTitle('halo dunia allaround')).toBe('Halo Dunia Allaround');
    expect(toTitle('SEKOLAH TINGGI TEKNIK')).toBe('Sekolah Tinggi Teknik');
  });

  it('converts to sentence case correctly', () => {
    expect(toSentence('halo dunia. ini kalimat kedua! apa kabar?')).toBe(
      'Halo dunia. Ini kalimat kedua! Apa kabar?'
    );
  });

  it('converts to camelCase correctly handling leading and special chars', () => {
    expect(toCamel('halo dunia')).toBe('haloDunia');
    expect(toCamel('hello_world_variable')).toBe('helloWorldVariable');
    expect(toCamel('  test   case  ')).toBe('testCase');
    expect(toCamel('')).toBe('');
  });

  it('converts to PascalCase correctly', () => {
    expect(toPascal('halo dunia')).toBe('HaloDunia');
    expect(toPascal('my_component_name')).toBe('MyComponentName');
  });

  it('converts to snake_case without dangling underscores', () => {
    expect(toSnake('Halo Dunia')).toBe('halo_dunia');
    expect(toSnake('Hello   World! ')).toBe('hello_world');
    expect(toSnake('_already_snake_')).toBe('already_snake');
  });

  it('converts to kebab-case without dangling hyphens', () => {
    expect(toKebab('Halo Dunia')).toBe('halo-dunia');
    expect(toKebab('User Profile Card?')).toBe('user-profile-card');
  });
});

describe('2. Text Analyzer & Word Counter Functions', () => {
  it('counts words accurately across whitespace variations', () => {
    expect(countWords('')).toBe(0);
    expect(countWords('   ')).toBe(0);
    expect(countWords('Satu dua tiga empat lima')).toBe(5);
    expect(countWords('  Banyak    spasi   di   sini ')).toBe(4);
  });

  it('counts characters with and without spaces', () => {
    const text = 'Halo Dunia';
    expect(countChars(text)).toBe(10);
    expect(countCharsNoSpaces(text)).toBe(9);
  });

  it('counts sentences and paragraphs', () => {
    const text = 'Halo dunia! Apa kabar? Saya baik-baik saja.\n\nIni paragraf kedua.';
    expect(countSentences(text)).toBe(4);
    expect(countParagraphs(text)).toBe(2);
    expect(countSentences('')).toBe(0);
    expect(countParagraphs('')).toBe(0);
  });

  it('estimates reading and speaking time', () => {
    expect(estimateReadingTime(400)).toBe(2);
    expect(estimateSpeakingTime(260)).toBe(2);
    expect(estimateReadingTime(0)).toBe(0);
  });
});

describe('3. Duplicate Line Remover Function', () => {
  it('handles empty input gracefully', () => {
    const res = processDuplicateLines('');
    expect(res.result).toBe('');
    expect(res.removedCount).toBe(0);
    expect(res.initialCount).toBe(0);
    expect(res.uniqueCount).toBe(0);
  });

  it('removes duplicate lines case-insensitively by default', () => {
    const input = 'apel\njeruk\nApel\nmangga\nJeruk';
    const res = processDuplicateLines(input, { trimWhitespace: true, caseSensitive: false });
    expect(res.result).toBe('apel\njeruk\nmangga');
    expect(res.removedCount).toBe(2);
    expect(res.initialCount).toBe(5);
    expect(res.uniqueCount).toBe(3);
  });

  it('respects case-sensitivity when enabled', () => {
    const input = 'apel\nApel\nAPEL';
    const res = processDuplicateLines(input, { caseSensitive: true });
    expect(res.result).toBe('apel\nApel\nAPEL');
    expect(res.removedCount).toBe(0);
  });

  it('sorts lines alphabetically when option is true', () => {
    const input = 'zebra\napel\nkucing\napel';
    const res = processDuplicateLines(input, { sortAlphabetically: true });
    expect(res.result).toBe('apel\nkucing\nzebra');
  });

  it('trims whitespace and ignores blank lines when trimWhitespace is true', () => {
    const input = '  apel  \n\n   \njeruk   ';
    const res = processDuplicateLines(input, { trimWhitespace: true });
    expect(res.result).toBe('apel\njeruk');
  });
});

describe('4. Color Conversion & Parsing Functions', () => {
  it('converts 6-digit hex to RGB correctly', () => {
    expect(hexToRgb('#60A5FA')).toEqual({ r: 96, g: 165, b: 250 });
    expect(hexToRgb('60A5FA')).toEqual({ r: 96, g: 165, b: 250 });
  });

  it('expands 3-digit shorthand hex (#FFF, #000) correctly', () => {
    expect(hexToRgb('#FFF')).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb('#000')).toEqual({ r: 0, g: 0, b: 0 });
    expect(hexToRgb('#123')).toEqual({ r: 17, g: 34, b: 51 });
  });

  it('falls back safely on invalid hex input without crashing', () => {
    expect(hexToRgb('invalid-hex')).toEqual({ r: 147, g: 197, b: 253 });
  });

  it('converts RGB to HSL format accurately', () => {
    expect(rgbToHsl(255, 255, 255)).toBe('hsl(0, 0%, 100%)');
    expect(rgbToHsl(0, 0, 0)).toBe('hsl(0, 0%, 0%)');
    expect(rgbToHsl(255, 0, 0)).toBe('hsl(0, 100%, 50%)');
  });

  it('parses target color in BgChanger correctly without || 255 bug on 0 channels', () => {
    const black = parseTargetColor('#000000');
    expect(black).toEqual({ r: 0, g: 0, b: 0, a: 255 });

    const transparent = parseTargetColor('transparent');
    expect(transparent).toEqual({ r: 255, g: 255, b: 255, a: 0 });
  });

  it('converts rgb to hex correctly', () => {
    expect(rgbToHex(255, 255, 255)).toBe('#FFFFFF');
    expect(rgbToHex(0, 0, 0)).toBe('#000000');
    expect(rgbToHex(246, 161, 192)).toBe('#F6A1C0');
  });

  it('detects corner colors correctly', () => {
    // 2x2 image, RGBA
    const data = new Uint8ClampedArray([
      255, 0, 0, 255,   255, 0, 0, 255,
      255, 0, 0, 255,   255, 0, 0, 255,
    ]);
    const corner = detectCornerColor(data, 2, 2);
    expect(corner).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('removes target color globally without affecting other colors (e.g. removes white, preserves pink)', () => {
    // 2 pixels: pixel 0 is white (255,255,255,255), pixel 1 is pink (246,161,192,255)
    const data = new Uint8ClampedArray([
      255, 255, 255, 255,
      246, 161, 192, 255,
    ]);

    processBackgroundRemoval(data, 2, 1, {
      targetColor: { r: 255, g: 255, b: 255 },
      tolerance: 25,
      feather: 0,
      mode: 'global',
    });

    // Pixel 0 should become transparent (alpha = 0)
    expect(data[3]).toBe(0);
    // Pixel 1 (pink) should remain opaque (alpha = 255) and pink
    expect(data[4]).toBe(246);
    expect(data[5]).toBe(161);
    expect(data[6]).toBe(192);
    expect(data[7]).toBe(255);
  });

  it('removes target color via flood fill connected area', () => {
    // 3 pixels: [white, pink, white]
    const data = new Uint8ClampedArray([
      255, 255, 255, 255,
      246, 161, 192, 255,
      255, 255, 255, 255,
    ]);

    processBackgroundRemoval(data, 3, 1, {
      targetColor: { r: 255, g: 255, b: 255 },
      tolerance: 20,
      feather: 0,
      mode: 'floodFill',
      startX: 0,
      startY: 0,
    });

    // Pixel 0 (connected white) -> transparent
    expect(data[3]).toBe(0);
    // Pixel 1 (pink wall) -> preserved
    expect(data[7]).toBe(255);
    // Pixel 2 (disconnected white) -> preserved in floodFill!
    expect(data[11]).toBe(255);
  });

  it('preserves small white line details and only removes large frames in framesOnly mode', () => {
    // 6 pixels wide:
    // [W, W, W, W] (component size = 4: large photo frame)
    // [P] (pink divider)
    // [W] (single white pixel: design line / sparkle detail)
    const data = new Uint8ClampedArray([
      255, 255, 255, 255, // Pixel 0 (frame)
      255, 255, 255, 255, // Pixel 1 (frame)
      255, 255, 255, 255, // Pixel 2 (frame)
      255, 255, 255, 255, // Pixel 3 (frame)
      246, 161, 192, 255, // Pixel 4 (pink divider)
      255, 255, 255, 255, // Pixel 5 (small white line / detail)
    ]);

    processBackgroundRemoval(data, 6, 1, {
      targetColor: { r: 255, g: 255, b: 255 },
      tolerance: 20,
      feather: 0,
      mode: 'framesOnly',
      minRegionSize: 3, // only components >= 3 pixels are removed
    });

    // Pixels 0-3 (large photo frame >= 3 pixels) should become transparent
    expect(data[3]).toBe(0);
    expect(data[7]).toBe(0);
    expect(data[11]).toBe(0);
    expect(data[15]).toBe(0);

    // Pixel 4 (pink divider) is untouched
    expect(data[19]).toBe(255);

    // Pixel 5 (small white line / detail < 3 pixels) MUST BE PRESERVED!
    expect(data[20]).toBe(255);
    expect(data[21]).toBe(255);
    expect(data[22]).toBe(255);
    expect(data[23]).toBe(255); // Alpha is 255 (opaque)!
  });

  it('supports multi-click floodFill removing multiple selected boxes', () => {
    // 5 pixels: [W, P, W, P, W]
    const data = new Uint8ClampedArray([
      255, 255, 255, 255, // 0: Box 1
      246, 161, 192, 255, // 1: Divider
      255, 255, 255, 255, // 2: Box 2
      246, 161, 192, 255, // 3: Divider
      255, 255, 255, 255, // 4: Box 3
    ]);

    // Click on Box 1 (x=0) and Box 3 (x=4)
    processBackgroundRemoval(data, 5, 1, {
      targetColor: { r: 255, g: 255, b: 255 },
      tolerance: 20,
      feather: 0,
      mode: 'floodFill',
      clickPoints: [{ x: 0, y: 0 }, { x: 4, y: 0 }],
    });

    // Box 1 and Box 3 transparent
    expect(data[3]).toBe(0);
    expect(data[19]).toBe(0);

    // Box 2 (unclicked) remains white & opaque!
    expect(data[11]).toBe(255);
    // Dividers remain intact
    expect(data[7]).toBe(255);
    expect(data[15]).toBe(255);
  });

  it('strictly isolates and removes only top K frames in photoboothFrames mode', () => {
    // 12x12 grid with two 4x4 blocks and a thin 1-pixel line
    const w = 12;
    const h = 12;
    const data = new Uint8ClampedArray(w * h * 4);
    // Background is dark blue (0, 0, 50, 255)
    for (let i = 0; i < w * h * 4; i += 4) {
      data[i] = 0; data[i + 1] = 0; data[i + 2] = 50; data[i + 3] = 255;
    }

    // Box 1: 4x4 white at (1, 1)
    for (let y = 1; y <= 4; y++) {
      for (let x = 1; x <= 4; x++) {
        const idx = (y * w + x) * 4;
        data[idx] = 255; data[idx + 1] = 255; data[idx + 2] = 255;
      }
    }

    // Box 2: 4x4 white at (7, 7)
    for (let y = 7; y <= 10; y++) {
      for (let x = 7; x <= 10; x++) {
        const idx = (y * w + x) * 4;
        data[idx] = 255; data[idx + 1] = 255; data[idx + 2] = 255;
      }
    }

    // Thin white line: 1x4 white at (1, 8)
    for (let x = 1; x <= 4; x++) {
      const idx = (8 * w + x) * 4;
      data[idx] = 255; data[idx + 1] = 255; data[idx + 2] = 255;
    }

    processBackgroundRemoval(data, w, h, {
      targetColor: { r: 255, g: 255, b: 255 },
      tolerance: 20,
      feather: 0,
      mode: 'photoboothFrames',
      targetFrameCount: 2,
    });

    // Both boxes should have been targeted
    // Center of Box 1 (2, 2)
    const b1Center = (2 * w + 2) * 4;
    expect(data[b1Center + 3]).toBe(0);

    // Center of Box 2 (8, 8)
    const b2Center = (8 * w + 8) * 4;
    expect(data[b2Center + 3]).toBe(0);

    // Thin line at (8, 2) must remain intact!
    const linePix = (8 * w + 2) * 4;
    expect(data[linePix + 3]).toBe(255);
  });
});

describe('5. Binary Calculator & Base Conversion Functions', () => {
  it('parses decimal, binary, hex, and octal inputs into BigInt', () => {
    expect(parseToDec('42', 'dec')).toBe(42n);
    expect(parseToDec('-15', 'dec')).toBe(-15n);
    expect(parseToDec('101010', 'bin')).toBe(42n);
    expect(parseToDec('2A', 'hex')).toBe(42n);
    expect(parseToDec('52', 'oct')).toBe(42n);
  });

  it('returns null on invalid base inputs', () => {
    expect(parseToDec('102', 'bin')).toBeNull();
    expect(parseToDec('ZZ', 'hex')).toBeNull();
    expect(parseToDec('89', 'oct')).toBeNull();
    expect(parseToDec('abc', 'dec')).toBeNull();
    expect(parseToDec('', 'dec')).toBeNull();
  });

  it('formats binary string with 4-bit nibble groupings', () => {
    expect(formatBinary(42n)).toBe('0010 1010');
    expect(formatBinary(-5n)).toBe('-0000 0101');
    expect(formatBinary(null)).toBe('-');
  });

  it('performs binary calculations (+, -, *, /, AND, OR, XOR)', () => {
    const add = calculateBinary('1010', '0010', '+'); // 10 + 2 = 12 (1100)
    expect(add.bin).toBe('1100');
    expect(add.dec).toBe('12');

    const sub = calculateBinary('1010', '0010', '-'); // 10 - 2 = 8 (1000)
    expect(sub.bin).toBe('1000');

    const mul = calculateBinary('0101', '0011', '*'); // 5 * 3 = 15 (1111)
    expect(mul.bin).toBe('1111');

    const div = calculateBinary('1000', '0010', '/'); // 8 / 2 = 4 (100)
    expect(div.bin).toBe('100');

    const bitAnd = calculateBinary('1100', '1010', 'AND'); // 1000
    expect(bitAnd.bin).toBe('1000');

    const bitOr = calculateBinary('1100', '0011', 'OR'); // 1111
    expect(bitOr.bin).toBe('1111');

    const bitXor = calculateBinary('1100', '1010', 'XOR'); // 0110 -> 110
    expect(bitXor.bin).toBe('110');
  });

  it('prevents division by zero in binary calculator', () => {
    const divZero = calculateBinary('1010', '0000', '/');
    expect(divZero.error).toBe('Pembagian dengan nol tidak diizinkan.');
  });
});

describe('6. Unit Converter Function', () => {
  it('converts length units accurately', () => {
    // 1 km = 1000 m
    expect(convertUnit('length', 1, 0, 1)).toBe(1000);
    // 100 cm = 1 m
    expect(convertUnit('length', 2, 0, 100)).toBe(1);
    // 1 inch = 0.0254 m
    expect(convertUnit('length', 4, 0, 1)).toBe(0.0254);
  });

  it('converts weight units accurately', () => {
    // 1 kg = 1000 g
    expect(convertUnit('weight', 0, 1, 1)).toBe(1000);
    // 1000 g = 1 kg
    expect(convertUnit('weight', 1, 0, 1000)).toBe(1);
  });

  it('converts temperature units accurately (Celsius, Fahrenheit, Kelvin)', () => {
    // 0 °C -> 32 °F
    expect(convertUnit('temperature', 0, 1, 0)).toBe(32);
    // 100 °C -> 212 °F
    expect(convertUnit('temperature', 0, 1, 100)).toBe(212);
    // 0 °C -> 273.15 K
    expect(convertUnit('temperature', 0, 2, 0)).toBeCloseTo(273.15, 2);
    // 273.15 K -> 0 °C
    expect(convertUnit('temperature', 2, 0, 273.15)).toBeCloseTo(0, 2);
  });

  it('converts digital storage units accurately', () => {
    // 1 KB = 1024 Bytes
    expect(convertUnit('digital', 1, 0, 1)).toBe(1024);
    // 1 MB = 1024 KB
    expect(convertUnit('digital', 2, 1, 1)).toBe(1024);
    // 1 GB = 1024 MB
    expect(convertUnit('digital', 3, 2, 1)).toBe(1024);
  });
});

describe('7. Password Generator & Strength Functions', () => {
  it('generates password of requested length', () => {
    const pw = generatePassword(16, { includeLower: true, includeUpper: true, includeNumbers: true, includeSymbols: true });
    expect(pw.length).toBe(16);
  });

  it('generates deterministic password with mock array', () => {
    const mock = new Uint32Array([0, 1, 2, 3]);
    const pw = generatePassword(4, { includeLower: true, includeUpper: false, includeNumbers: false, includeSymbols: false }, mock);
    expect(pw).toBe('abcd');
  });

  it('calculates password strength appropriately', () => {
    expect(calculatePasswordStrength('abc').label).toBe('Lemah');
    expect(calculatePasswordStrength('Abc123456789').label).toBe('Kuat');
    expect(calculatePasswordStrength('Abc$1234#XyZ!9876').label).toBe('Sangat Kuat');
  });
});

describe('8. UUID Formatter Function', () => {
  it('formats UUID with options (uppercase, remove hyphens)', () => {
    const id = '123e4567-e89b-12d3-a456-426614174000';
    expect(formatUuid(id, { uppercase: true })).toBe('123E4567-E89B-12D3-A456-426614174000');
    expect(formatUuid(id, { removeHyphens: true })).toBe('123e4567e89b12d3a456426614174000');
    expect(formatUuid(id, { uppercase: true, removeHyphens: true })).toBe('123E4567E89B12D3A456426614174000');
  });
});

describe('9. Markdown to HTML Parser Function', () => {
  it('escapes raw HTML to prevent XSS attacks', () => {
    const html = parseMarkdownToHtml('<script>alert("xss")</script>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).not.toContain('<script>');
  });

  it('parses headings (H1, H2, H3) and styling properly', () => {
    const md = '# Judul Utama\n## Sub Judul\n### Sub-sub Judul';
    const html = parseMarkdownToHtml(md);
    expect(html).toContain('<h1');
    expect(html).toContain('Judul Utama</h1>');
    expect(html).toContain('<h2');
    expect(html).toContain('Sub Judul</h2>');
    expect(html).toContain('<h3');
    expect(html).toContain('Sub-sub Judul</h3>');
  });

  it('parses bold, italic, code, blockquote and list items', () => {
    const md = '**tebal** *miring* `kode`\n> kutipan\n- poin 1';
    const html = parseMarkdownToHtml(md);
    expect(html).toContain('<strong>tebal</strong>');
    expect(html).toContain('<em>miring</em>');
    expect(html).toContain('<code');
    expect(html).toContain('kode</code>');
    expect(html).toContain('<blockquote');
    expect(html).toContain('kutipan</blockquote>');
    expect(html).toContain('<li');
  });
});

describe('10. Text Diff Computation Function', () => {
  it('detects unchanged lines', () => {
    const diff = computeTextDiff('baris satu\nbaris dua', 'baris satu\nbaris dua');
    expect(diff.stats.unchanged).toBe(2);
    expect(diff.stats.added).toBe(0);
    expect(diff.stats.removed).toBe(0);
  });

  it('detects added lines', () => {
    const diff = computeTextDiff('baris satu', 'baris satu\nbaris baru');
    expect(diff.stats.added).toBe(1);
    expect(diff.stats.unchanged).toBe(1);
  });

  it('detects removed lines', () => {
    const diff = computeTextDiff('baris satu\nbaris dihapus', 'baris satu');
    expect(diff.stats.removed).toBe(1);
    expect(diff.stats.unchanged).toBe(1);
  });
});

describe('11. HTML Reader & Viewer Utilities', () => {
  it('formats unformatted HTML with indentation', () => {
    const input = '<div><p>Hello <strong>World</strong></p></div>';
    const formatted = formatHtml(input);
    expect(formatted).toContain('<div>');
    expect(formatted).toContain('  <p>');
    expect(formatted).toContain('</div>');
  });

  it('minifies HTML by removing comments and extra spacing', () => {
    const input = '<!-- komentar --> <div>   <p> Hello </p>   </div>';
    const minified = minifyHtml(input);
    expect(minified).toBe('<div><p> Hello </p></div>');
    expect(minified).not.toContain('komentar');
  });

  it('counts HTML opening and self-closing tags accurately', () => {
    const input = '<div><h1>Title</h1><p>Text<br/></p></div>';
    expect(countHtmlTags(input)).toBe(4); // div, h1, p, br/
  });

  it('extracts HTML title properly', () => {
    const withTitle = '<html><head><title>Halaman Keren</title></head></html>';
    expect(extractHtmlTitle(withTitle)).toBe('Halaman Keren');

    const withoutTitle = '<div>Konten saja</div>';
    expect(extractHtmlTitle(withoutTitle)).toBe('Dokumen HTML');
  });
});

