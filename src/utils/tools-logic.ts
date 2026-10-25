/**
 * Pure logic and utility functions for AllAround tools.
 * Decoupled from React UI state for comprehensive unit testing and reusability.
 */

// ==========================================
// 1. TEXT CASE CONVERSIONS
// ==========================================

export const toUpper = (s: string): string => s.toUpperCase();

export const toLower = (s: string): string => s.toLowerCase();

export const toTitle = (s: string): string => {
  return s.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
};

export const toSentence = (s: string): string => {
  return s.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
};

export const toCamel = (s: string): string => {
  const words = s.trim().split(/[^a-zA-Z0-9]+/).filter(Boolean);
  if (words.length === 0) return '';
  return words[0].toLowerCase() + words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
};

export const toPascal = (s: string): string => {
  const words = s.trim().split(/[^a-zA-Z0-9]+/).filter(Boolean);
  return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
};

export const toSnake = (s: string): string => {
  return s
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
};

export const toKebab = (s: string): string => {
  return s
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// ==========================================
// 2. TEXT ANALYZER & WORD COUNTER
// ==========================================

export const countWords = (text: string): number => {
  const trimmed = text.trim();
  return trimmed === '' ? 0 : trimmed.split(/\s+/).length;
};

export const countChars = (text: string): number => text.length;

export const countCharsNoSpaces = (text: string): number => text.replace(/\s/g, '').length;

export const countSentences = (text: string): number => {
  if (text.trim() === '') return 0;
  return text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
};

export const countParagraphs = (text: string): number => {
  if (text.trim() === '') return 0;
  return text.split(/\n+/).filter(p => p.trim().length > 0).length;
};

export const estimateReadingTime = (wordCount: number): number => {
  return Math.ceil(wordCount / 200);
};

export const estimateSpeakingTime = (wordCount: number): number => {
  return Math.ceil(wordCount / 130);
};

// ==========================================
// 3. DUPLICATE LINE REMOVER
// ==========================================

export interface ProcessDuplicateOptions {
  trimWhitespace?: boolean;
  caseSensitive?: boolean;
  sortAlphabetically?: boolean;
}

export interface DuplicateResult {
  result: string;
  removedCount: number;
  initialCount: number;
  uniqueCount: number;
}

export const processDuplicateLines = (
  inputText: string,
  options: ProcessDuplicateOptions = { trimWhitespace: true, caseSensitive: false, sortAlphabetically: false }
): DuplicateResult => {
  if (!inputText) {
    return {
      result: '',
      removedCount: 0,
      initialCount: 0,
      uniqueCount: 0,
    };
  }

  let lines = inputText.split('\n');

  if (options.trimWhitespace) {
    lines = lines.map(l => l.trim()).filter(l => l.length > 0);
  }

  const initialCount = lines.length;
  const seen = new Set<string>();
  const unique: string[] = [];

  for (const line of lines) {
    const key = options.caseSensitive ? line : line.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(line);
    }
  }

  if (options.sortAlphabetically) {
    unique.sort((a, b) => a.localeCompare(b));
  }

  return {
    result: unique.join('\n'),
    removedCount: initialCount - unique.length,
    initialCount,
    uniqueCount: unique.length,
  };
};

// ==========================================
// 4. COLOR CONVERSIONS & PALETTES
// ==========================================

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export const hexToRgb = (hex: string): RGB => {
  let clean = hex.replace('#', '').trim();
  // Expand 3-digit shorthand hex (e.g. "FFF" -> "FFFFFF")
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  if (clean.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(clean)) {
    return { r: 147, g: 197, b: 253 }; // Safe fallback
  }

  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);

  return {
    r: isNaN(r) ? 0 : r,
    g: isNaN(g) ? 0 : g,
    b: isNaN(b) ? 0 : b,
  };
};

export const rgbToHsl = (r: number, g: number, b: number): string => {
  const rNorm = Math.min(255, Math.max(0, r)) / 255;
  const gNorm = Math.min(255, Math.max(0, g)) / 255;
  const bNorm = Math.min(255, Math.max(0, b)) / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
      case gNorm: h = (bNorm - rNorm) / d + 2; break;
      case bNorm: h = (rNorm - gNorm) / d + 4; break;
    }
    h /= 6;
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
};

export const parseTargetColor = (colorStr: string): { r: number; g: number; b: number; a: number } => {
  if (colorStr === 'transparent') {
    return { r: 255, g: 255, b: 255, a: 0 };
  }
  const rgb = hexToRgb(colorStr);
  return { r: rgb.r, g: rgb.g, b: rgb.b, a: 255 };
};

// ==========================================
// 5. BINARY CALCULATOR & BASE CONVERSIONS
// ==========================================

export const parseToDec = (val: string, base: 'dec' | 'bin' | 'hex' | 'oct'): bigint | null => {
  try {
    const clean = val.trim();
    if (!clean) return null;
    if (base === 'bin') {
      if (!/^[01]+$/.test(clean)) return null;
      return BigInt('0b' + clean);
    }
    if (base === 'hex') {
      if (!/^[0-9a-fA-F]+$/.test(clean)) return null;
      return BigInt('0x' + clean);
    }
    if (base === 'oct') {
      if (!/^[0-7]+$/.test(clean)) return null;
      return BigInt('0o' + clean);
    }
    if (!/^-?\d+$/.test(clean)) return null;
    return BigInt(clean);
  } catch {
    return null;
  }
};

export const formatBinary = (n: bigint | null): string => {
  if (n === null) return '-';
  const isNegative = n < 0n;
  const absVal = isNegative ? -n : n;
  const bin = absVal.toString(2);
  const padLength = Math.ceil(bin.length / 8) * 8 || 8;
  const padded = bin.padStart(padLength, '0');
  const formatted = padded.match(/.{1,4}/g)?.join(' ') || bin;
  return isNegative ? `-${formatted}` : formatted;
};

export interface BinaryCalcResult {
  bin?: string;
  dec?: string;
  hex?: string;
  numA?: string;
  numB?: string;
  error?: string;
}

export const calculateBinary = (
  calcBinA: string,
  calcBinB: string,
  operator: '+' | '-' | '*' | '/' | 'AND' | 'OR' | 'XOR'
): BinaryCalcResult => {
  try {
    const cleanA = calcBinA.trim();
    const cleanB = calcBinB.trim();
    if (!/^[01]+$/.test(cleanA) || !/^[01]+$/.test(cleanB)) {
      return { error: 'Masukkan hanya angka biner (0 dan 1).' };
    }

    const numA = BigInt('0b' + cleanA);
    const numB = BigInt('0b' + cleanB);
    let res = 0n;

    switch (operator) {
      case '+': res = numA + numB; break;
      case '-': res = numA - numB; break;
      case '*': res = numA * numB; break;
      case '/':
        if (numB === 0n) return { error: 'Pembagian dengan nol tidak diizinkan.' };
        res = numA / numB;
        break;
      case 'AND': res = numA & numB; break;
      case 'OR': res = numA | numB; break;
      case 'XOR': res = numA ^ numB; break;
    }

    return {
      bin: res.toString(2),
      dec: res.toString(10),
      hex: res.toString(16).toUpperCase(),
      numA: numA.toString(10),
      numB: numB.toString(10),
    };
  } catch (e: any) {
    return { error: e.message };
  }
};

// ==========================================
// 6. UNIT CONVERTER
// ==========================================

export type UnitCategory = 'length' | 'weight' | 'temperature' | 'digital';

export interface UnitDefinition {
  name: string;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
}

export const UNITS: Record<UnitCategory, UnitDefinition[]> = {
  length: [
    { name: 'Meter (m)', toBase: v => v, fromBase: v => v },
    { name: 'Kilometer (km)', toBase: v => v * 1000, fromBase: v => v / 1000 },
    { name: 'Centimeter (cm)', toBase: v => v / 100, fromBase: v => v * 100 },
    { name: 'Milimeter (mm)', toBase: v => v / 1000, fromBase: v => v * 1000 },
    { name: 'Inch (in)', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
    { name: 'Foot (ft)', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
    { name: 'Mile (mi)', toBase: v => v * 1609.344, fromBase: v => v / 1609.344 },
  ],
  weight: [
    { name: 'Kilogram (kg)', toBase: v => v, fromBase: v => v },
    { name: 'Gram (g)', toBase: v => v / 1000, fromBase: v => v * 1000 },
    { name: 'Miligram (mg)', toBase: v => v / 1000000, fromBase: v => v * 1000000 },
    { name: 'Pound (lb)', toBase: v => v * 0.45359237, fromBase: v => v / 0.45359237 },
    { name: 'Ounce (oz)', toBase: v => v * 0.0283495, fromBase: v => v / 0.0283495 },
  ],
  temperature: [
    { name: 'Celsius (°C)', toBase: v => v, fromBase: v => v },
    { name: 'Fahrenheit (°F)', toBase: v => (v - 32) * (5 / 9), fromBase: v => (v * (9 / 5)) + 32 },
    { name: 'Kelvin (K)', toBase: v => v - 273.15, fromBase: v => v + 273.15 },
  ],
  digital: [
    { name: 'Byte (B)', toBase: v => v, fromBase: v => v },
    { name: 'Kilobyte (KB)', toBase: v => v * 1024, fromBase: v => v / 1024 },
    { name: 'Megabyte (MB)', toBase: v => v * 1024 * 1024, fromBase: v => v / (1024 * 1024) },
    { name: 'Gigabyte (GB)', toBase: v => v * 1024 * 1024 * 1024, fromBase: v => v / (1024 * 1024 * 1024) },
    { name: 'Terabyte (TB)', toBase: v => v * Math.pow(1024, 4), fromBase: v => v / Math.pow(1024, 4) },
  ],
};

export const convertUnit = (
  category: UnitCategory,
  fromIndex: number,
  toIndex: number,
  value: number
): number => {
  if (isNaN(value)) return 0;
  const list = UNITS[category];
  const fromUnit = list[fromIndex] || list[0];
  const toUnit = list[toIndex] || list[0];
  const baseValue = fromUnit.toBase(value);
  return toUnit.fromBase(baseValue);
};

// ==========================================
// 7. PASSWORD GENERATOR & STRENGTH
// ==========================================

export interface PasswordOptions {
  includeUpper?: boolean;
  includeLower?: boolean;
  includeNumbers?: boolean;
  includeSymbols?: boolean;
}

export const generatePassword = (
  length: number,
  options: PasswordOptions = { includeUpper: true, includeLower: true, includeNumbers: true, includeSymbols: true },
  pseudoRandomArray?: Uint32Array
): string => {
  let charset = '';
  if (options.includeLower) charset += 'abcdefghijklmnopqrstuvwxyz';
  if (options.includeUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (options.includeNumbers) charset += '0123456789';
  if (options.includeSymbols) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

  if (!charset || length <= 0) return '';

  const array = pseudoRandomArray || new Uint32Array(length);
  if (!pseudoRandomArray && typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array as any);
  } else if (!pseudoRandomArray) {
    for (let i = 0; i < length; i++) {
      array[i] = Math.floor(Math.random() * 0xFFFFFFFF);
    }
  }

  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset[array[i] % charset.length];
  }
  return result;
};

export const calculatePasswordStrength = (
  password: string,
  options: PasswordOptions = {}
): { label: string; color: string; percent: number } => {
  let score = 0;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  if (score <= 2) return { label: 'Lemah', color: '#EF4444', percent: 30 };
  if (score <= 4) return { label: 'Kuat', color: '#0284C7', percent: 70 };
  return { label: 'Sangat Kuat', color: '#10B981', percent: 100 };
};

// ==========================================
// 8. UUID FORMATTER
// ==========================================

export const formatUuid = (
  rawUuid: string,
  options: { uppercase?: boolean; removeHyphens?: boolean } = {}
): string => {
  let u = rawUuid;
  if (options.removeHyphens) u = u.replace(/-/g, '');
  if (options.uppercase) u = u.toUpperCase();
  return u;
};

// ==========================================
// 9. MARKDOWN TO HTML PARSER
// ==========================================

export const parseMarkdownToHtml = (md: string): string => {
  return md
    // Escape HTML entities to prevent XSS
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Headers
    .replace(/^### (.*$)/gim, '<h3 style="font-size: 16px; font-weight: 700; margin: 16px 0 8px;">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 style="font-size: 20px; font-weight: 800; margin: 20px 0 10px; border-bottom: 1px solid var(--color-border); padding-bottom: 6px;">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 style="font-size: 24px; font-weight: 800; margin: 24px 0 12px; border-bottom: 1px solid var(--color-border); padding-bottom: 8px;">$1</h1>')
    // Blockquotes (matching &gt; since > was escaped)
    .replace(/^(?:&gt;|>)\s*(.*$)/gim, '<blockquote style="border-left: 3px solid var(--brand-primary); margin: 12px 0; padding-left: 14px; color: var(--color-text-secondary); font-style: italic;">$1</blockquote>')
    // Code blocks
    .replace(/```([\s\S]*?)```/gim, '<pre style="background: var(--color-bg-base); padding: 12px; border-radius: 8px; border: 1px solid var(--color-border); font-family: var(--font-mono); font-size: 13px; overflow-x: auto; margin: 12px 0;"><code>$1</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/gim, '<code style="background: var(--color-bg-base); padding: 2px 6px; border-radius: 4px; font-family: var(--font-mono); font-size: 12px; border: 1px solid var(--color-border);">$1</code>')
    // Bold & Italic
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    // Horizontal Rules
    .replace(/^---$/gim, '<hr style="border: none; border-top: 1px solid var(--color-border); margin: 20px 0;" />')
    // Unordered lists
    .replace(/^\- (.*$)/gim, '<li style="margin-left: 20px; margin-bottom: 4px;">$1</li>')
    // Line breaks to paragraphs
    .replace(/\n\n/gim, '<p style="margin-bottom: 12px;"></p>');
};

// ==========================================
// 10. TEXT DIFF COMPUTATION
// ==========================================

export interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  text: string;
  lineNumA?: number;
  lineNumB?: number;
}

export interface DiffReport {
  lines: DiffLine[];
  stats: {
    added: number;
    removed: number;
    unchanged: number;
  };
}

export const computeTextDiff = (textA: string, textB: string): DiffReport => {
  const linesA = textA.split('\n');
  const linesB = textB.split('\n');

  const result: DiffLine[] = [];
  let added = 0;
  let removed = 0;
  let unchanged = 0;

  let idxA = 0;
  let idxB = 0;

  while (idxA < linesA.length || idxB < linesB.length) {
    if (idxA < linesA.length && idxB < linesB.length) {
      if (linesA[idxA] === linesB[idxB]) {
        result.push({
          type: 'unchanged',
          text: linesA[idxA],
          lineNumA: idxA + 1,
          lineNumB: idxB + 1,
        });
        unchanged++;
        idxA++;
        idxB++;
      } else {
        const foundInB = linesB.indexOf(linesA[idxA], idxB);
        const foundInA = linesA.indexOf(linesB[idxB], idxA);

        if (foundInB !== -1 && (foundInA === -1 || foundInB <= foundInA)) {
          result.push({
            type: 'added',
            text: linesB[idxB],
            lineNumB: idxB + 1,
          });
          added++;
          idxB++;
        } else if (foundInA !== -1) {
          result.push({
            type: 'removed',
            text: linesA[idxA],
            lineNumA: idxA + 1,
          });
          removed++;
          idxA++;
        } else {
          result.push({
            type: 'removed',
            text: linesA[idxA],
            lineNumA: idxA + 1,
          });
          removed++;
          idxA++;
          result.push({
            type: 'added',
            text: linesB[idxB],
            lineNumB: idxB + 1,
          });
          added++;
          idxB++;
        }
      }
    } else if (idxA < linesA.length) {
      result.push({
        type: 'removed',
        text: linesA[idxA],
        lineNumA: idxA + 1,
      });
      removed++;
      idxA++;
    } else {
      result.push({
        type: 'added',
        text: linesB[idxB],
        lineNumB: idxB + 1,
      });
      added++;
      idxB++;
    }
  }

  return {
    lines: result,
    stats: { added, removed, unchanged },
  };
};

// ==========================================
// 12. HTML READER & VIEWER UTILITIES
// ==========================================

export const formatHtml = (html: string): string => {
  if (!html.trim()) return '';
  let formatted = '';
  let indent = 0;
  const tab = '  ';

  // Normalize newlines and collapse whitespace outside tag definitions
  const clean = html
    .replace(/>\s*</g, '><')
    .replace(/(\r\n|\n|\r)/gm, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Void tags in HTML5 that do not require closing tags
  const voidTags = /^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)(>|\s)/i;

  const tokens = clean.split(/(<[^>]+>)/g).filter(Boolean);

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i].trim();
    if (!token) continue;

    if (token.startsWith('</')) {
      // Closing tag
      indent = Math.max(0, indent - 1);
      formatted += (formatted ? '\n' : '') + tab.repeat(indent) + token;
    } else if (token.startsWith('<') && !token.startsWith('<!') && !token.startsWith('<?')) {
      // Opening or self-closing tag
      const isClosingTag = token.endsWith('/>');
      const tagContent = token.slice(1);
      const isVoid = voidTags.test(tagContent);

      formatted += (formatted ? '\n' : '') + tab.repeat(indent) + token;

      if (!isClosingTag && !isVoid && !token.startsWith('<!--')) {
        indent++;
      }
    } else {
      // Text node or <!DOCTYPE ...> or <!-- comment -->
      formatted += (formatted ? '\n' : '') + tab.repeat(indent) + token;
    }
  }

  return formatted;
};

export const minifyHtml = (html: string): string => {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/>\s+</g, '><')
    .replace(/\s+/g, ' ')
    .trim();
};

export const countHtmlTags = (html: string): number => {
  const matches = html.match(/<([a-zA-Z0-9\-]+)[^>]*>/g);
  return matches ? matches.length : 0;
};

export const extractHtmlTitle = (html: string): string => {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return match && match[1] ? match[1].trim() : 'Dokumen HTML';
};

