import { PDFDocument } from 'pdf-lib';

export const MAX_PDF_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

export interface PdfValidationResult {
  valid: boolean;
  error?: string;
  isEncrypted?: boolean;
}

/**
 * Validates whether the given buffer has a standard %PDF- header in the first 1024 bytes.
 */
export const validatePdfHeader = (buffer: ArrayBuffer | Uint8Array): PdfValidationResult => {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  if (bytes.length < 5) {
    return { valid: false, error: 'File terlalu kecil atau bukan PDF yang valid.' };
  }

  // Look for '%PDF-' (0x25, 0x50, 0x44, 0x46, 0x2D)
  const headerLimit = Math.min(bytes.length - 4, 1024);
  let found = false;
  for (let i = 0; i < headerLimit; i++) {
    if (
      bytes[i] === 0x25 &&
      bytes[i + 1] === 0x50 &&
      bytes[i + 2] === 0x44 &&
      bytes[i + 3] === 0x46 &&
      bytes[i + 4] === 0x2D
    ) {
      found = true;
      break;
    }
  }

  if (!found) {
    return { valid: false, error: 'File ini bukan dokumen PDF yang valid.' };
  }

  return { valid: true };
};

export interface PdfCompressionResult {
  success: boolean;
  isOptimized?: boolean;
  compressedBytes?: Uint8Array;
  finalSize?: number;
  originalSize?: number;
  message?: string;
  error?: string;
}

/**
 * Core PDF compression engine with strict validation, encryption detection, and real byte measurement.
 */
export const processPdfCompression = async (
  arrayBuffer: ArrayBuffer,
  originalSize: number,
  compressionMode: 'hybrid' | 'deflate' = 'hybrid'
): Promise<PdfCompressionResult> => {
  // 1. Validate file size boundary
  if (originalSize > MAX_PDF_SIZE_BYTES) {
    return {
      success: false,
      error: 'Ukuran file melebihi batas maksimal 25 MB. Silakan pilih dokumen yang lebih kecil.',
    };
  }

  // 2. Validate header
  const headerCheck = validatePdfHeader(arrayBuffer);
  if (!headerCheck.valid) {
    return {
      success: false,
      error: headerCheck.error || 'File ini bukan dokumen PDF yang valid.',
    };
  }

  // 3. Load PDF strictly without ignoreEncryption
  let pdfDoc: PDFDocument;
  try {
    pdfDoc = await PDFDocument.load(arrayBuffer);
  } catch (loadErr: any) {
    const msg = loadErr?.message || '';
    if (/encrypted/i.test(msg)) {
      return {
        success: false,
        error: 'PDF ini dikunci kata sandi, buka kuncinya dulu.',
      };
    }
    return {
      success: false,
      error: 'File PDF rusak atau tidak lengkap.',
    };
  }

  // 4. Validate pages structure
  let pageCount = 0;
  try {
    pageCount = pdfDoc.getPageCount();
  } catch {
    return {
      success: false,
      error: 'File PDF rusak atau tidak lengkap.',
    };
  }

  if (pageCount === 0) {
    return {
      success: false,
      error: 'File PDF rusak atau tidak lengkap.',
    };
  }

  // 5. Clean metadata to save bytes while preserving document content
  pdfDoc.setTitle('');
  pdfDoc.setAuthor('');
  pdfDoc.setSubject('');
  pdfDoc.setKeywords([]);
  pdfDoc.setProducer('AllAround High-Fidelity Engine');
  pdfDoc.setCreator('AllAround Web');

  // 6. Save with object streams
  const compressedData = await pdfDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
  });

  const realLength = compressedData.length;

  // 7. Check if file expanded/already optimal
  if (realLength >= originalSize) {
    return {
      success: true,
      isOptimized: true,
      compressedBytes: new Uint8Array(arrayBuffer),
      finalSize: originalSize,
      originalSize,
      message: 'File sudah optimal, kompresi tidak memperkecil ukuran.',
    };
  }

  return {
    success: true,
    isOptimized: false,
    compressedBytes: compressedData,
    finalSize: realLength,
    originalSize,
    message: 'Selesai! PDF berhasil dikompres.',
  };
};

