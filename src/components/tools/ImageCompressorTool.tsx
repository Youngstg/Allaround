import React, { useState } from 'react';
import { UploadCloud, Compass, Download, RefreshCw, CheckCircle2 } from 'lucide-react';

export const ImageCompressorTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(75);
  const [scale, setScale] = useState(100);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const formatSize = (bytes: number) => {
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      processCompression(selected, quality, scale);
    }
  };

  const processCompression = (imgFile: File, q: number, s: number) => {
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const targetWidth = Math.round(img.width * (s / 100));
        const targetHeight = Math.round(img.height * (s / 100));

        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Fill white background to prevent transparent PNG turning black in JPEG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              setCompressedUrl(URL.createObjectURL(blob));
              setCompressedSize(blob.size);
            }
            setIsProcessing(false);
          },
          'image/jpeg',
          q / 100
        );
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(imgFile);
  };

  const handleQualityChange = (val: number) => {
    setQuality(val);
    if (file) processCompression(file, val, scale);
  };

  const handleScaleChange = (val: number) => {
    setScale(val);
    if (file) processCompression(file, quality, val);
  };

  const reduction = file && compressedSize ? (((file.size - compressedSize) / file.size) * 100).toFixed(1) : 0;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px', fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
          Image Compressor
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}>
          Kompres ukuran file gambar secara instan langsung di peramban dengan kontrol kualitas dan resolusi.
        </p>
      </div>

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
            <Compass size={30} color="var(--brand-dark)" />
          </div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            Pilih atau Tarik Gambar ke Sini
          </div>
          <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            Mendukung JPG, PNG, dan WebP
          </div>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '24px', background: 'var(--color-bg-card)' }}>
          {/* Controls */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--color-text-primary)' }}>
                <span>Kualitas Kompresi:</span>
                <span style={{ color: 'var(--brand-dark)' }}>{quality}%</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="95" 
                value={quality} 
                onChange={(e) => handleQualityChange(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--brand-primary)' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--color-text-primary)' }}>
                <span>Skala Resolusi:</span>
                <span style={{ color: 'var(--brand-dark)' }}>{scale}%</span>
              </div>
              <input 
                type="range" 
                min="20" 
                max="100" 
                value={scale} 
                onChange={(e) => handleScaleChange(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--brand-primary)' }}
              />
            </div>
          </div>

          {/* Results Comparison */}
          {compressedSize && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              textAlign: 'center',
              marginBottom: '24px',
            }}>
              <div style={{ background: 'var(--color-bg-surface)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Ukuran Asli</div>
                <div style={{ fontSize: '17px', fontWeight: 800, marginTop: '4px', color: 'var(--color-text-primary)' }}>
                  {formatSize(file.size)}
                </div>
              </div>

              <div style={{ background: 'var(--color-bg-surface)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--cat-img-border)' }}>
                <div style={{ fontSize: '12px', color: 'var(--brand-dark)' }}>Hasil Kompres</div>
                <div style={{ fontSize: '17px', fontWeight: 800, marginTop: '4px', color: 'var(--brand-dark)' }}>
                  {formatSize(compressedSize)}
                </div>
              </div>

              <div style={{ background: 'var(--color-bg-surface)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--cat-txt-border)' }}>
                <div style={{ fontSize: '12px', color: 'var(--cat-txt-dark)' }}>Penghematan</div>
                <div style={{ fontSize: '17px', fontWeight: 800, marginTop: '4px', color: 'var(--cat-txt-dark)' }}>
                  -{reduction}%
                </div>
              </div>
            </div>
          )}

          {/* Preview Image */}
          {compressedUrl && (
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                background: 'var(--color-bg-base)',
                border: '1px solid var(--color-border)',
                maxHeight: '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <img src={compressedUrl} alt="Compressed" style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }} />
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {compressedUrl && (
              <a
                href={compressedUrl}
                download={`compressed_${file.name.replace(/\.[^/.]+$/, '')}.jpg`}
                className="btn-primary"
                style={{ flex: 1, textDecoration: 'none', padding: '12px' }}
              >
                <Download size={17} />
                <span>Unduh Gambar ({compressedSize ? formatSize(compressedSize) : ''})</span>
              </a>
            )}
            <button
              onClick={() => { setFile(null); setCompressedUrl(null); }}
              className="btn-secondary"
            >
              Ganti Gambar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
