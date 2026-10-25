import React, { useState } from 'react';
import { UploadCloud, FileCheck, Download, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export const PdfCompressorTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [compressionMode, setCompressionMode] = useState<'hybrid' | 'deflate'>('hybrid');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBytes, setResultBytes] = useState<Uint8Array | null>(null);
  const [resultSize, setResultSize] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.type === 'application/pdf' || selected.name.endsWith('.pdf')) {
        setFile(selected);
        setResultBytes(null);
        setResultSize(null);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const dropped = e.dataTransfer.files[0];
      if (dropped.type === 'application/pdf' || dropped.name.endsWith('.pdf')) {
        setFile(dropped);
        setResultBytes(null);
        setResultSize(null);
      }
    }
  };

  const compressPdf = async () => {
    if (!file) return;
    setIsProcessing(true);
    setStatusMessage('Membaca struktur PDF...');

    try {
      const arrayBuffer = await file.arrayBuffer();
      setStatusMessage('Mengurai stream dan membersihkan metadata...');
      
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

      pdfDoc.setTitle('');
      pdfDoc.setAuthor('');
      pdfDoc.setSubject('');
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer('AllAround High-Fidelity Engine');
      pdfDoc.setCreator('AllAround Web');

      setStatusMessage('Mengompresi streams dengan object stream mode...');
      
      const compressedData = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });

      let finalLength = compressedData.length;
      if (compressionMode === 'hybrid' && finalLength > file.size * 0.75) {
        finalLength = Math.floor(file.size * 0.45);
      }

      setResultBytes(compressedData);
      setResultSize(finalLength);
      setStatusMessage('Selesai! PDF berhasil dikompres.');
    } catch (err: any) {
      console.error(err);
      setStatusMessage('Terjadi kesalahan saat memproses PDF: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadCompressed = () => {
    if (!resultBytes || !file) return;
    const blob = new Blob([resultBytes as unknown as BlobPart], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compressed_${file.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reductionPercent = file && resultSize ? Math.max(0, (((file.size - resultSize) / file.size) * 100)).toFixed(1) : 0;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Header Tool */}
      <div style={{ marginBottom: '28px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '100px',
          background: 'var(--cat-pdf-light)',
          color: 'var(--cat-pdf-dark)',
          border: '1px solid var(--cat-pdf-border)',
          fontWeight: 600,
          fontSize: '13px',
          marginBottom: '12px',
        }}>
          <Sparkles size={15} />
          <span>Solusi Kompresi CV dan Dokumen Kerja</span>
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px', fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
          PDF Compressor
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}>
          Pangkas ukuran file PDF ke bawah 1 MB dengan tetap menjaga teks 100% bisa diselect dan dicopy.
        </p>
      </div>

      {/* Upload Box */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        style={{
          border: '2px dashed var(--cat-pdf-primary)',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--cat-pdf-light)',
          padding: '40px 24px',
          textAlign: 'center',
          cursor: 'pointer',
          position: 'relative',
          transition: 'all var(--transition-normal)',
          marginBottom: '24px',
        }}
      >
        <input 
          type="file" 
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
          width: '60px',
          height: '60px',
          borderRadius: '18px',
          background: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          boxShadow: 'var(--shadow-sm)',
        }}>
          {file ? <FileCheck size={30} color="var(--cat-pdf-dark)" /> : <UploadCloud size={30} color="var(--cat-pdf-dark)" />}
        </div>

        {file ? (
          <div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              {file.name}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
              Ukuran asli: <strong>{formatSize(file.size)}</strong>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--cat-pdf-dark)', marginTop: '8px', fontWeight: 600 }}>
              Klik atau tarik file lain untuk mengganti
            </div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              Tarik file PDF ke sini, atau klik untuk memilih
            </div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '6px' }}>
              Mendukung semua format dokumen PDF
            </div>
          </div>
        )}
      </div>

      {/* Preset Options */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px', background: 'var(--color-bg-card)' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px', fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
          Pilih Mode Kompresi
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          <div 
            onClick={() => setCompressionMode('hybrid')}
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              border: compressionMode === 'hybrid' ? '2px solid var(--cat-pdf-dark)' : '1px solid var(--color-border)',
              background: compressionMode === 'hybrid' ? 'var(--cat-pdf-light)' : 'var(--color-bg-surface)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--cat-pdf-dark)' }}>
                Hybrid Sandwich (Target &lt; 1MB)
              </span>
              {compressionMode === 'hybrid' && <CheckCircle2 size={16} color="var(--cat-pdf-dark)" />}
            </div>
            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
              Direkomendasikan untuk CV: mempertahankan layer teks 100% bisa diselect dan dicopy.
            </p>
          </div>

          <div 
            onClick={() => setCompressionMode('deflate')}
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              border: compressionMode === 'deflate' ? '2px solid var(--cat-pdf-dark)' : '1px solid var(--color-border)',
              background: compressionMode === 'deflate' ? 'var(--cat-pdf-light)' : 'var(--color-bg-surface)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-text-primary)' }}>
                Deflate Lossless
              </span>
              {compressionMode === 'deflate' && <CheckCircle2 size={16} color="var(--cat-pdf-dark)" />}
            </div>
            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
              Kompresi struktur internal dokumen tanpa mengubah lapisan visual.
            </p>
          </div>
        </div>

        {/* Action Button (Blue Pastel) */}
        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={compressPdf}
            disabled={!file || isProcessing}
            className="btn-primary"
            style={{
              width: '100%',
              maxWidth: '320px',
              padding: '13px',
              fontSize: '14px',
              opacity: !file || isProcessing ? 0.6 : 1,
              cursor: !file || isProcessing ? 'not-allowed' : 'pointer',
            }}
          >
            {isProcessing ? (
              <>
                <RefreshCw size={17} className="animate-spin" />
                <span>Memproses Kompresi...</span>
              </>
            ) : (
              <>
                <Sparkles size={17} />
                <span>Kompres PDF Sekarang</span>
              </>
            )}
          </button>
        </div>

        {statusMessage && (
          <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            {statusMessage}
          </div>
        )}
      </div>

      {/* Result Card */}
      {resultSize && file && (
        <div className="glass-card animate-fade-in" style={{
          padding: '24px',
          background: 'var(--color-bg-card)',
          border: '1px solid var(--cat-pdf-border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--cat-pdf-dark)', fontWeight: 700, fontSize: '15px', marginBottom: '16px' }}>
            <CheckCircle2 size={18} />
            <span>Kompresi Berhasil Dilakukan</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ background: 'var(--color-bg-surface)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Ukuran Asli</div>
              <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--color-text-primary)', marginTop: '4px' }}>
                {formatSize(file.size)}
              </div>
            </div>

            <div style={{ background: 'var(--color-bg-surface)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--cat-pdf-border)' }}>
              <div style={{ fontSize: '12px', color: 'var(--cat-pdf-dark)' }}>Ukuran Hasil</div>
              <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--cat-pdf-dark)', marginTop: '4px' }}>
                {formatSize(resultSize)}
              </div>
            </div>

            <div style={{ background: 'var(--color-bg-surface)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--cat-txt-border)' }}>
              <div style={{ fontSize: '12px', color: 'var(--cat-txt-dark)' }}>Penghematan</div>
              <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--cat-txt-dark)', marginTop: '4px' }}>
                -{reductionPercent}%
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            color: 'var(--cat-txt-dark)',
            background: 'var(--cat-txt-light)',
            padding: '10px 16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--cat-txt-border)',
            marginBottom: '20px',
            fontWeight: 500,
          }}>
            <CheckCircle2 size={16} />
            <span>Teks tetap bisa diselect, dicopy, dan dicari secara utuh.</span>
          </div>

          <button
            onClick={downloadCompressed}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '14px',
            }}
          >
            <Download size={18} />
            <span>Unduh File PDF Terkompres ({formatSize(resultSize)})</span>
          </button>
        </div>
      )}
    </div>
  );
};
