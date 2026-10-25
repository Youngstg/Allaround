import React, { useState } from 'react';
import { UploadCloud, FileSpreadsheet, Copy, Check, Download, RefreshCw } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export const PdfToTextTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      extractText(selected);
    }
  };

  const extractText = async (pdfFile: File) => {
    setIsProcessing(true);
    setExtractedText('');

    try {
      const buffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const pages = pdfDoc.getPages();
      
      // Simple client-side text extractor reading uncompressed stream contents
      let fullText = `Dokumen: ${pdfFile.name}\nTotal Halaman: ${pages.length}\n` + '='.repeat(50) + '\n\n';
      
      // Extract textual tokens from raw content streams
      const uint8 = new Uint8Array(buffer);
      const textDecoder = new TextDecoder('latin1');
      const rawString = textDecoder.decode(uint8);
      
      // Extract text in parentheses (Tj / TJ operators)
      const tjMatches = rawString.match(/\(([^()]{2,})\)\s*(?:Tj|'|")/g) || [];
      const cleanedWords = tjMatches.map(m => {
        const match = m.match(/\(([^()]+)\)/);
        return match ? match[1] : '';
      }).filter(w => w.trim().length > 0 && !w.startsWith('\\'));

      if (cleanedWords.length > 0) {
        fullText += cleanedWords.join(' ');
      } else {
        fullText += `(Informasi teks diekstrak: ${pages.length} halaman terdeteksi. Untuk dokumen berbasis raster/scan, disarankan menggunakan OCR).`;
      }

      setExtractedText(fullText);
    } catch (err: any) {
      setExtractedText('Gagal mengekstrak teks: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadText = () => {
    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `extracted_${file?.name.replace('.pdf', '') || 'text'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px', fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
          PDF to Text Extractor
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}>
          Ekstrak teks dari dokumen PDF secara instan langsung di peramban tanpa kirim ke server.
        </p>
      </div>

      <div style={{
        border: '2px dashed var(--cat-pdf-primary)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--cat-pdf-light)',
        padding: '36px 24px',
        textAlign: 'center',
        position: 'relative',
        cursor: 'pointer',
        marginBottom: '24px',
      }}>
        <input 
          type="file" 
          accept=".pdf"
          onChange={handleFileChange}
          style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
        />
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 14px',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <FileSpreadsheet size={28} color="var(--cat-pdf-dark)" />
        </div>
        <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
          {file ? file.name : 'Pilih atau Tarik Dokumen PDF ke Sini'}
        </div>
        <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
          Teks akan otomatis diekstrak segera setelah file dipilih
        </div>
      </div>

      {isProcessing && (
        <div style={{ textAlign: 'center', padding: '30px', color: 'var(--cat-pdf-dark)' }}>
          <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 8px' }} />
          <div>Mengekstrak teks dari PDF...</div>
        </div>
      )}

      {extractedText && (
        <div className="glass-card animate-fade-in" style={{ padding: '24px', background: 'var(--color-bg-card)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              Hasil Ekstraksi Teks
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={copyText}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-bg-surface)',
                  color: 'var(--color-text-primary)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 500,
                }}
              >
                {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                <span>{copied ? 'Tersalin' : 'Salin'}</span>
              </button>

              <button
                onClick={downloadText}
                className="btn-primary"
                style={{ padding: '6px 14px', fontSize: '12px' }}
              >
                <Download size={14} />
                <span>Unduh .txt</span>
              </button>
            </div>
          </div>

          <textarea
            rows={14}
            readOnly
            value={extractedText}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-input-bg)',
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              lineHeight: 1.6,
              resize: 'vertical',
            }}
          />
        </div>
      )}
    </div>
  );
};
