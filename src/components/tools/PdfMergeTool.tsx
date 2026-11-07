import React, { useState } from 'react';
import { 
  UploadCloud, Layers, Download, Trash2, ArrowUp, ArrowDown, 
  FileText, CheckCircle2, RefreshCw, AlertCircle, Info 
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { MAX_PDF_SIZE_BYTES, validatePdfHeader } from '../../utils/pdf-logic';

export const PdfMergeTool: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedBlobUrl, setMergedBlobUrl] = useState<string | null>(null);
  const [mergedSize, setMergedSize] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage('');
    if (e.target.files) {
      const selectedList = Array.from(e.target.files);
      const validPdfs: File[] = [];

      for (const f of selectedList) {
        if (!f.name.toLowerCase().endsWith('.pdf') && f.type !== 'application/pdf') {
          setErrorMessage(`Berkas "${f.name}" bukan file PDF dan dilewati.`);
          continue;
        }
        if (f.size > MAX_PDF_SIZE_BYTES) {
          setErrorMessage(`Ukuran berkas "${f.name}" (${formatSize(f.size)}) melebihi batas maksimal 25 MB.`);
          continue;
        }
        validPdfs.push(f);
      }

      setFiles(prev => [...prev, ...validPdfs]);
      setMergedBlobUrl(null);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setMergedBlobUrl(null);
    setErrorMessage('');
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setFiles(prev => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
    setMergedBlobUrl(null);
  };

  const moveDown = (index: number) => {
    if (index === files.length - 1) return;
    setFiles(prev => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
    setMergedBlobUrl(null);
  };

  const mergePdfs = async () => {
    if (files.length < 2) {
      setErrorMessage('Tambahkan minimal 1 dokumen lagi untuk menggabungkan PDF.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        // Validate size boundary
        if (file.size > MAX_PDF_SIZE_BYTES) {
          throw new Error(`Ukuran berkas "${file.name}" melebihi batas maksimal 25 MB.`);
        }

        const fileBuffer = await file.arrayBuffer();

        // 1. Header validation
        const headerCheck = validatePdfHeader(fileBuffer);
        if (!headerCheck.valid) {
          throw new Error(`Berkas "${file.name}" bukan dokumen PDF yang valid.`);
        }

        // 2. Load PDF strictly without ignoreEncryption
        let pdf: PDFDocument;
        try {
          pdf = await PDFDocument.load(fileBuffer);
        } catch (loadErr: any) {
          const msg = loadErr?.message || '';
          if (/encrypted/i.test(msg)) {
            throw new Error(`Dokumen "${file.name}" dikunci kata sandi, buka kuncinya dulu.`);
          }
          throw new Error(`Gagal membaca "${file.name}": format tidak valid atau rusak.`);
        }

        // 3. Validate pages
        let pageCount = 0;
        try {
          pageCount = pdf.getPageCount();
        } catch {
          throw new Error(`Gagal membaca "${file.name}": struktur halaman rusak atau tidak terbaca.`);
        }

        if (pageCount === 0) {
          throw new Error(`Berkas "${file.name}" rusak atau tidak memiliki halaman yang valid.`);
        }

        // 4. Copy pages into merged document
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save({ useObjectStreams: true });
      const blob = new Blob([mergedBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setMergedBlobUrl(url);
      setMergedSize(mergedBytes.length);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || 'Gagal menggabungkan PDF.');
      setMergedBlobUrl(null);
      setMergedSize(null);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px', fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
          Merge PDF
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}>
          Gabungkan beberapa file PDF menjadi satu dokumen berurutan dengan cepat dan aman.
        </p>
      </div>

      {/* Error Alert Banner */}
      {errorMessage && (
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          padding: '14px 18px',
          borderRadius: 'var(--radius-md)',
          background: '#FEF2F2',
          border: '1px solid #FCA5A5',
          color: '#991B1B',
          fontSize: '14px',
          marginBottom: '20px',
          lineHeight: 1.5,
        }}>
          <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ flex: 1, fontWeight: 500 }}>{errorMessage}</div>
          <button 
            onClick={() => setErrorMessage('')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#991B1B', fontWeight: 700 }}
            aria-label="Tutup pesan error"
          >
            ✕
          </button>
        </div>
      )}

      {/* Educational Notice Banner when only 1 file is uploaded */}
      {files.length === 1 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 18px',
          borderRadius: 'var(--radius-md)',
          background: '#EFF6FF',
          border: '1px solid #BFDBFE',
          color: '#1E40AF',
          fontSize: '13px',
          marginBottom: '20px',
          fontWeight: 500,
        }}>
          <Info size={18} style={{ flexShrink: 0 }} />
          <span>Tambahkan minimal 1 dokumen lagi untuk menggabungkan PDF.</span>
        </div>
      )}

      {/* Upload Zone */}
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
          multiple
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0,
            cursor: 'pointer',
            width: '100%',
            height: '100%',
          }}
          aria-label="Pilih dokumen PDF untuk digabung"
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
          <UploadCloud size={28} color="var(--cat-pdf-dark)" />
        </div>

        <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
          Pilih atau Tarik Beberapa File PDF ke Sini
        </div>
        <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
          Maksimal 25 MB per berkas • Minimal 2 dokumen untuk digabung
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="glass-card" style={{ padding: '20px', marginBottom: '24px', background: 'var(--color-bg-card)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
              Urutan Dokumen ({files.length} file)
            </h3>
            <button 
              onClick={() => { setFiles([]); setErrorMessage(''); setMergedBlobUrl(null); }}
              style={{ fontSize: '12px', color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
            >
              Hapus Semua
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {files.map((file, idx) => (
              <div 
                key={`${file.name}_${idx}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-secondary)', width: '20px' }}>
                    {idx + 1}.
                  </span>
                  <FileText size={18} color="var(--cat-pdf-dark)" style={{ flexShrink: 0 }} />
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {file.name}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginLeft: '8px' }}>
                      ({formatSize(file.size)})
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <button
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    style={{
                      padding: '4px',
                      background: 'none',
                      border: 'none',
                      cursor: idx === 0 ? 'not-allowed' : 'pointer',
                      opacity: idx === 0 ? 0.3 : 1,
                      color: 'var(--color-text-secondary)',
                    }}
                    title="Pindah ke atas"
                    aria-label="Pindah ke atas"
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    onClick={() => moveDown(idx)}
                    disabled={idx === files.length - 1}
                    style={{
                      padding: '4px',
                      background: 'none',
                      border: 'none',
                      cursor: idx === files.length - 1 ? 'not-allowed' : 'pointer',
                      opacity: idx === files.length - 1 ? 0.3 : 1,
                      color: 'var(--color-text-secondary)',
                    }}
                    title="Pindah ke bawah"
                    aria-label="Pindah ke bawah"
                  >
                    <ArrowDown size={16} />
                  </button>
                  <button
                    onClick={() => removeFile(idx)}
                    style={{
                      padding: '4px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#EF4444',
                      marginLeft: '6px',
                    }}
                    title="Hapus berkas"
                    aria-label="Hapus berkas"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={mergePdfs}
              disabled={files.length < 2 || isProcessing}
              className="btn-primary"
              style={{
                width: '100%',
                maxWidth: '280px',
                padding: '12px',
                fontSize: '14px',
                opacity: files.length < 2 || isProcessing ? 0.6 : 1,
                cursor: files.length < 2 || isProcessing ? 'not-allowed' : 'pointer',
              }}
            >
              {isProcessing ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Menggabungkan Dokumen...</span>
                </>
              ) : (
                <>
                  <Layers size={16} />
                  <span>Gabungkan {files.length} Dokumen</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Success Result Card */}
      {mergedBlobUrl && (
        <div className="glass-card animate-fade-in" style={{
          padding: '24px',
          textAlign: 'center',
          background: 'var(--color-bg-card)',
          border: '1px solid var(--cat-pdf-border)',
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'var(--cat-pdf-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
          }}>
            <CheckCircle2 size={24} color="var(--cat-pdf-dark)" />
          </div>

          <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
            Dokumen Berhasil Digabungkan!
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '18px' }}>
            Total ukuran dokumen gabungan: <strong>{mergedSize ? formatSize(mergedSize) : '0 KB'}</strong>
          </p>

          <a
            href={mergedBlobUrl}
            download="merged_document.pdf"
            className="btn-primary"
            style={{
              textDecoration: 'none',
              display: 'inline-flex',
              padding: '12px 28px',
              fontSize: '14px',
            }}
          >
            <Download size={17} />
            <span>Unduh Dokumen Gabungan</span>
          </a>
        </div>
      )}
    </div>
  );
};

export default PdfMergeTool;
