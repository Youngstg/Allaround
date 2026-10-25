import React, { useState } from 'react';
import { UploadCloud, Layers, Download, Trash2, ArrowUp, ArrowDown, FileText, CheckCircle2, RefreshCw } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export const PdfMergeTool: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedBlobUrl, setMergedBlobUrl] = useState<string | null>(null);
  const [mergedSize, setMergedSize] = useState<number | null>(null);

  const formatSize = (bytes: number) => {
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedList = Array.from(e.target.files).filter(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'));
      setFiles(prev => [...prev, ...selectedList]);
      setMergedBlobUrl(null);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setMergedBlobUrl(null);
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
    if (files.length < 2) return;
    setIsProcessing(true);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const fileBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
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
      alert('Gagal menggabungkan PDF: ' + err.message);
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
          accept=".pdf"
          onChange={handleFileChange}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0,
            cursor: 'pointer',
            width: '100%',
            height: '100%',
          }}
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
          Bisa memilih 2 atau lebih file sekaligus
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
              onClick={() => setFiles([])}
              style={{ fontSize: '12px', color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
            >
              Hapus Semua
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {files.map((f, idx) => (
              <div 
                key={`${f.name}-${idx}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: 'var(--color-bg-base)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ 
                    width: '24px', 
                    height: '24px', 
                    borderRadius: '50%', 
                    background: 'var(--cat-pdf-light)', 
                    color: 'var(--cat-pdf-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}>
                    {idx + 1}
                  </span>
                  <FileText size={18} color="var(--color-text-muted)" />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{f.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{formatSize(f.size)}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button 
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    style={{ border: 'none', background: 'transparent', cursor: idx === 0 ? 'default' : 'pointer', opacity: idx === 0 ? 0.3 : 1, color: 'var(--color-text-primary)' }}
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button 
                    onClick={() => moveDown(idx)}
                    disabled={idx === files.length - 1}
                    style={{ border: 'none', background: 'transparent', cursor: idx === files.length - 1 ? 'default' : 'pointer', opacity: idx === files.length - 1 ? 0.3 : 1, color: 'var(--color-text-primary)' }}
                  >
                    <ArrowDown size={16} />
                  </button>
                  <button 
                    onClick={() => removeFile(idx)}
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#EF4444' }}
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
                maxWidth: '300px',
                padding: '12px',
              }}
            >
              {isProcessing ? <RefreshCw size={17} className="animate-spin" /> : <Layers size={17} />}
              <span>Gabungkan {files.length} Dokumen</span>
            </button>
          </div>
        </div>
      )}

      {/* Result */}
      {mergedBlobUrl && mergedSize && (
        <div className="glass-card animate-fade-in" style={{
          padding: '24px',
          background: 'var(--color-bg-card)',
          border: '1px solid var(--cat-pdf-border)',
          textAlign: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--cat-pdf-dark)', fontWeight: 700, fontSize: '15px', marginBottom: '8px' }}>
            <CheckCircle2 size={18} />
            <span>Dokumen Selesai Digabungkan</span>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', marginBottom: '16px' }}>
            Ukuran total dokumen hasil gabungan: <strong>{formatSize(mergedSize)}</strong>
          </p>
          <a
            href={mergedBlobUrl}
            download="merged_document.pdf"
            className="btn-primary"
            style={{
              textDecoration: 'none',
              padding: '12px 28px',
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
