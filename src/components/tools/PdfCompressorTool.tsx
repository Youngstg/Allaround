import React, { useState, useRef, useEffect } from 'react';
import { 
  UploadCloud, FileCheck, Download, Sparkles, 
  CheckCircle2, RefreshCw, AlertCircle, Info 
} from 'lucide-react';
import { MAX_PDF_SIZE_BYTES, processPdfCompression } from '../../utils/pdf-logic';

export const PdfCompressorTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [compressionMode, setCompressionMode] = useState<'hybrid' | 'deflate'>('hybrid');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBytes, setResultBytes] = useState<Uint8Array | null>(null);
  const [resultSize, setResultSize] = useState<number | null>(null);
  const [isOptimized, setIsOptimized] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Initialize Web Worker if supported
    if (typeof Worker !== 'undefined') {
      try {
        workerRef.current = new Worker(
          new URL('../../workers/pdf-compress.worker.ts', import.meta.url),
          { type: 'module' }
        );
      } catch (err) {
        console.warn('Web Worker initialization failed, fallback to direct async:', err);
      }
    }

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const validateAndSelectFile = (selected: File) => {
    setErrorMessage('');
    setResultBytes(null);
    setResultSize(null);
    setIsOptimized(false);
    setStatusMessage('');

    // 1. Validate file extension or MIME type
    if (!selected.name.toLowerCase().endsWith('.pdf') && selected.type !== 'application/pdf') {
      setErrorMessage('File ini bukan dokumen PDF yang valid. Silakan pilih file dengan ekstensi .pdf');
      setFile(null);
      return;
    }

    // 2. Validate max size (25 MB)
    if (selected.size > MAX_PDF_SIZE_BYTES) {
      setErrorMessage('Ukuran file melebihi batas maksimal 25 MB. Silakan pilih dokumen yang lebih kecil.');
      setFile(null);
      return;
    }

    setFile(selected);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSelectFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelectFile(e.dataTransfer.files[0]);
    }
  };

  const compressPdf = async () => {
    if (!file) return;
    setIsProcessing(true);
    setErrorMessage('');
    setStatusMessage('Membaca struktur PDF...');

    try {
      const arrayBuffer = await file.arrayBuffer();

      // Use Web Worker if available, otherwise direct execution
      if (workerRef.current) {
        const currentWorker = workerRef.current;
        const taskId = `${Date.now()}_${Math.random()}`;

        currentWorker.onmessage = (e: MessageEvent) => {
          if (e.data.id !== taskId) return;
          setIsProcessing(false);

          if (!e.data.success) {
            setErrorMessage(e.data.error || 'Gagal memproses file PDF.');
            setResultBytes(null);
            setResultSize(null);
            setStatusMessage('');
            return;
          }

          setResultBytes(e.data.compressedBytes);
          setResultSize(e.data.finalSize);
          setIsOptimized(Boolean(e.data.isOptimized));
          setStatusMessage(e.data.message || 'Selesai!');
        };

        currentWorker.onerror = (err) => {
          console.error('Worker error:', err);
          setIsProcessing(false);
          setErrorMessage('Terjadi kesalahan pada Web Worker saat memproses PDF.');
        };

        setStatusMessage('Mengompresi PDF di background thread (Web Worker)...');
        currentWorker.postMessage({
          id: taskId,
          arrayBuffer,
          originalSize: file.size,
          compressionMode,
        });
      } else {
        // Direct execution fallback
        const result = await processPdfCompression(arrayBuffer, file.size, compressionMode);
        setIsProcessing(false);

        if (!result.success) {
          setErrorMessage(result.error || 'Gagal memproses file PDF.');
          setResultBytes(null);
          setResultSize(null);
          setStatusMessage('');
          return;
        }

        setResultBytes(result.compressedBytes || null);
        setResultSize(result.finalSize || null);
        setIsOptimized(Boolean(result.isOptimized));
        setStatusMessage(result.message || 'Selesai!');
      }
    } catch (err: any) {
      console.error(err);
      setIsProcessing(false);
      setErrorMessage('Terjadi kesalahan saat memproses PDF: ' + (err?.message || 'Gagal memproses.'));
    }
  };

  const downloadCompressed = () => {
    if (!resultBytes || !file) return;
    const blob = new Blob([resultBytes as unknown as BlobPart], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = isOptimized ? file.name : `compressed_${file.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reductionPercent = file && resultSize && file.size > resultSize
    ? (((file.size - resultSize) / file.size) * 100).toFixed(1)
    : '0.0';

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
        <h1 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', fontWeight: 800, marginBottom: '8px', fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
          PDF Compressor
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}>
          Pangkas ukuran file PDF ke bawah 1 MB dengan tetap menjaga teks 100% bisa diselect dan dicopy.
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
            aria-label="Tutup error"
          >
            ✕
          </button>
        </div>
      )}

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
          aria-label="Pilih dokumen PDF"
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
              Maksimal 25 MB • Diproses 100% lokal di browser Anda
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

        {/* Action Button */}
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
                <span>Memproses di Web Worker...</span>
              </>
            ) : (
              <>
                <Sparkles size={17} />
                <span>Kompres PDF Sekarang</span>
              </>
            )}
          </button>
        </div>

        {statusMessage && !errorMessage && (
          <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            {statusMessage}
          </div>
        )}
      </div>

      {/* Result Card */}
      {resultSize !== null && file && (
        <div className="glass-card animate-fade-in" style={{
          padding: '24px',
          background: 'var(--color-bg-card)',
          border: '1px solid var(--cat-pdf-border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--cat-pdf-dark)', fontWeight: 700, fontSize: '15px', marginBottom: '16px' }}>
            <CheckCircle2 size={18} />
            <span>{isOptimized ? 'Pemeriksaan Selesai' : 'Kompresi Berhasil Dilakukan'}</span>
          </div>

          {/* If file already optimal banner */}
          {isOptimized && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              color: '#0369A1',
              background: '#F0F9FF',
              padding: '10px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #BAE6FD',
              marginBottom: '16px',
              fontWeight: 500,
            }}>
              <Info size={16} />
              <span>File sudah optimal, kompresi tidak memperkecil ukuran. Berkas asli tetap dipertahankan.</span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))', gap: '14px', textAlign: 'center', marginBottom: '20px' }}>
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
                {isOptimized ? '0.0%' : `-${reductionPercent}%`}
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
            <span>
              {isOptimized 
                ? `Unduh Berkas Asli (${formatSize(resultSize)})` 
                : `Unduh File PDF Terkompres (${formatSize(resultSize)})`}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default PdfCompressorTool;
