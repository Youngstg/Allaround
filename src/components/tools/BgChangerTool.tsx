import React, { useState, useRef } from 'react';
import { UploadCloud, Wand2, Download, RefreshCw } from 'lucide-react';
import { parseTargetColor } from '../../utils/tools-logic';

const PASTEL_PRESETS = [
  { name: 'Transparan (PNG)', color: 'transparent', hex: 'transparent' },
  { name: 'Baby Sky Blue', color: '#EFF6FF', hex: '#EFF6FF' },
  { name: 'Glacier Blue', color: '#E0F2FE', hex: '#E0F2FE' },
  { name: 'Powder Blue', color: '#BAE6FD', hex: '#BAE6FD' },
  { name: 'Ice Teal', color: '#ECFDF5', hex: '#ECFDF5' },
  { name: 'Soft Denim', color: '#DBEAFE', hex: '#DBEAFE' },
  { name: 'Periwinkle Ice', color: '#EEF2FF', hex: '#EEF2FF' },
  { name: 'Putih Bersih', color: '#FFFFFF', hex: '#FFFFFF' },
];

export const BgChangerTool: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [selectedBg, setSelectedBg] = useState<string>('#EFF6FF');
  const [tolerance, setTolerance] = useState<number>(30);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setImageSrc(url);
      setProcessedUrl(null);
    }
  };

  const processBackground = () => {
    if (!imageSrc) return;
    setIsProcessing(true);

    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;

      // Draw original
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Sample top-left pixel as background reference
      const bgR = data[0];
      const bgG = data[1];
      const bgB = data[2];

      // Parse target color safely
      const target = parseTargetColor(selectedBg);
      const targetR = target.r;
      const targetG = target.g;
      const targetB = target.b;
      const targetA = target.a;

      // Replace pixels close to background color
      const tolSq = tolerance * tolerance * 3;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const distSq = (r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2;
        if (distSq <= tolSq) {
          data[i] = targetR;
          data[i + 1] = targetG;
          data[i + 2] = targetB;
          data[i + 3] = targetA;
        }
      }

      ctx.putImageData(imgData, 0, 0);

      const result = canvas.toDataURL(selectedBg === 'transparent' ? 'image/png' : 'image/jpeg', 0.92);
      setProcessedUrl(result);
      setIsProcessing(false);
    };
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '840px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px', fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
          Background Changer
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}>
          Ubah background foto produk, pas foto, atau grafis ke nuansa biru pastel lembut atau transparan secara instan.
        </p>
      </div>

      {!imageSrc ? (
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
            <Wand2 size={30} color="var(--cat-img-dark)" />
          </div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }}>Tarik Foto ke Sini atau Klik untuk Memilih</div>
          <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            Mendukung file PNG, JPEG, dan WebP
          </div>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '24px', background: 'var(--color-bg-card)' }}>
          {/* Controls */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '8px', color: 'var(--color-text-primary)' }}>
              Pilih Warna Background Baru:
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {PASTEL_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => setSelectedBg(preset.hex)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-full)',
                    border: selectedBg === preset.hex ? '2px solid var(--cat-img-dark)' : '1px solid var(--color-border)',
                    background: preset.hex === 'transparent' ? 'var(--color-bg-surface)' : preset.hex,
                    color: '#0F172A',
                    fontSize: '12px',
                    fontWeight: selectedBg === preset.hex ? 700 : 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: preset.hex === 'transparent' ? 'repeating-conic-gradient(#ccc 0% 25%, white 0% 50%) 50% / 8px 8px' : preset.hex,
                    border: '1px solid #ddd',
                  }} />
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px', color: 'var(--color-text-secondary)' }}>
              <span style={{ fontWeight: 600 }}>Sensitivitas Toleransi Deteksi Warna:</span>
              <span>{tolerance}%</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="80" 
              value={tolerance} 
              onChange={(e) => setTolerance(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--brand-primary)' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <button
              onClick={processBackground}
              disabled={isProcessing}
              className="btn-primary"
              style={{
                flex: 1,
                padding: '12px',
              }}
            >
              {isProcessing ? <RefreshCw size={17} className="animate-spin" /> : <Wand2 size={17} />}
              <span>Terapkan Background Baru</span>
            </button>
            <button
              onClick={() => { setImageSrc(null); setProcessedUrl(null); }}
              className="btn-secondary"
            >
              Ganti Foto
            </button>
          </div>

          {/* Preview Comparison */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--color-text-secondary)' }}>Foto Asli</div>
              <div style={{
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                background: 'var(--color-bg-base)',
                border: '1px solid var(--color-border)',
                maxHeight: '340px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <img src={imageSrc} alt="Original" style={{ maxWidth: '100%', maxHeight: '340px', objectFit: 'contain' }} />
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: 'var(--color-text-secondary)' }}>Hasil Background Baru</div>
              <div style={{
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                background: selectedBg === 'transparent' ? 'repeating-conic-gradient(#ccc 0% 25%, white 0% 50%) 50% / 16px 16px' : selectedBg,
                maxHeight: '340px',
                minHeight: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--color-border)',
              }}>
                {processedUrl ? (
                  <img src={processedUrl} alt="Processed" style={{ maxWidth: '100%', maxHeight: '340px', objectFit: 'contain' }} />
                ) : (
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                    Klik "Terapkan Background Baru" untuk melihat hasil
                  </div>
                )}
              </div>
            </div>
          </div>

          {processedUrl && (
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <a
                href={processedUrl}
                download="allaround_bg_change.png"
                className="btn-primary"
                style={{
                  textDecoration: 'none',
                  padding: '12px 28px',
                }}
              >
                <Download size={17} />
                <span>Unduh Gambar Hasil</span>
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
