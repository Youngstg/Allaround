import React, { useState } from 'react';
import { FileType, Download, AlertTriangle, X } from 'lucide-react';

export const ImageConverterTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<'image/png' | 'image/jpeg' | 'image/webp'>('image/webp');
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [convertedSize, setConvertedSize] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setErrorMessage(null);

      // HEIC validation
      const isHeic = selected.name.toLowerCase().endsWith('.heic') || selected.name.toLowerCase().endsWith('.heif');
      if (isHeic) {
        setErrorMessage(
          "Format HEIC dari iPhone belum didukung secara langsung di peramban ini. Silakan ubah pengaturan kamera iPhone ke 'Most Compatible' (JPEG) atau gunakan format JPG/PNG/WebP."
        );
        setFile(null);
        e.target.value = '';
        return;
      }

      // Non-image validation
      const isImage = selected.type.startsWith('image/') || /\.(jpe?g|png|webp|gif|bmp|svg)$/i.test(selected.name);
      if (!isImage) {
        setErrorMessage(
          `Berkas "${selected.name}" bukan format gambar yang valid. Harap unggah berkas gambar dengan format PNG, JPG, WebP, GIF, atau BMP.`
        );
        setFile(null);
        e.target.value = '';
        return;
      }

      setFile(selected);
      convertImage(selected, targetFormat);
    }
  };

  const convertImage = (imgFile: File, format: string) => {
    setIsProcessing(true);
    setErrorMessage(null);

    const reader = new FileReader();
    reader.onerror = () => {
      setIsProcessing(false);
      setErrorMessage(`Gagal membaca berkas "${imgFile.name}".`);
    };

    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => {
        setIsProcessing(false);
        setErrorMessage(`Gagal memuat gambar "${imgFile.name}". Berkas mungkin rusak atau tidak didukung oleh browser.`);
      };

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            setIsProcessing(false);
            setErrorMessage('Gagal membuat kanvas render untuk gambar.');
            return;
          }

          // If converting to JPEG, draw white background first to avoid black transparency
          if (format === 'image/jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }

          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) {
              setConvertedUrl(URL.createObjectURL(blob));
              setConvertedSize(blob.size);
            } else {
              setErrorMessage('Gagal mengonversi gambar ke format yang dipilih.');
            }
            setIsProcessing(false);
          }, format, 0.92);
        } catch (err: any) {
          setIsProcessing(false);
          setErrorMessage(`Terjadi kesalahan saat memproses gambar: ${err?.message || 'Error tidak diketahui'}`);
        }
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(imgFile);
  };

  const handleFormatChange = (fmt: 'image/png' | 'image/jpeg' | 'image/webp') => {
    setTargetFormat(fmt);
    if (file) convertImage(file, fmt);
  };

  const getExtension = () => {
    if (targetFormat === 'image/png') return 'png';
    if (targetFormat === 'image/jpeg') return 'jpg';
    return 'webp';
  };

  const formatSize = (bytes: number) => {
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px', fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
          Image Converter
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}>
          Konversi format gambar antar PNG, JPG, dan WebP secara instan di peramban Anda.
        </p>
      </div>

      {/* Error / Alert Banner */}
      {errorMessage && (
        <div style={{
          background: '#FEF2F2',
          border: '1px solid #FCA5A5',
          borderRadius: 'var(--radius-md)',
          padding: '14px 16px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          color: '#991B1B',
        }}>
          <AlertTriangle size={20} style={{ flexShrink: 0, marginTop: '2px', color: '#DC2626' }} />
          <div style={{ flex: 1, fontSize: '13px', lineHeight: 1.5 }}>
            {errorMessage}
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#991B1B', padding: '2px' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {!file ? (
        <div style={{
          border: '2px dashed var(--cat-img-primary)',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--cat-img-light)',
          padding: '48px 24px',
          textAlign: 'center',
          position: 'relative',
          cursor: 'pointer',
        }}>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleImageUpload}
            style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
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
            <FileType size={30} color="var(--brand-dark)" />
          </div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }}>Pilih Gambar untuk Dikonversi</div>
          <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            Mendukung PNG, JPG, WebP, GIF, BMP
          </div>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '24px', background: 'var(--color-bg-card)' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '8px', color: 'var(--color-text-primary)' }}>
              Pilih Format Tujuan:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {[
                { label: 'WebP (Modern & Ringan)', val: 'image/webp' },
                { label: 'PNG (Transparan Tanpa Kompresi)', val: 'image/png' },
                { label: 'JPG (Universal)', val: 'image/jpeg' },
              ].map((fmt) => (
                <button
                  key={fmt.val}
                  onClick={() => handleFormatChange(fmt.val as any)}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    border: targetFormat === fmt.val ? '2px solid var(--brand-dark)' : '1px solid var(--color-border)',
                    background: targetFormat === fmt.val ? 'var(--cat-img-light)' : 'var(--color-bg-surface)',
                    color: targetFormat === fmt.val ? 'var(--brand-dark)' : 'var(--color-text-primary)',
                    fontWeight: targetFormat === fmt.val ? 700 : 500,
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  {fmt.label}
                </button>
              ))}
            </div>
          </div>

          {convertedUrl && (
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                background: 'var(--color-bg-base)',
                border: '1px solid var(--color-border)',
                maxHeight: '280px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}>
                <img src={convertedUrl} alt="Converted" style={{ maxWidth: '100%', maxHeight: '280px', objectFit: 'contain' }} />
              </div>

              {convertedSize && (
                <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                  Ukuran Berkas: <strong>{formatSize(convertedSize)}</strong> (dari {formatSize(file.size)})
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <a
                  href={convertedUrl}
                  download={`converted_${file.name.replace(/\.[^/.]+$/, '')}.${getExtension()}`}
                  className="btn-primary"
                  style={{ flex: 1, textDecoration: 'none', padding: '12px' }}
                >
                  <Download size={17} />
                  <span>Unduh File {getExtension().toUpperCase()}</span>
                </a>
                <button
                  onClick={() => { setFile(null); setConvertedUrl(null); }}
                  className="btn-secondary"
                >
                  Ganti Gambar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
