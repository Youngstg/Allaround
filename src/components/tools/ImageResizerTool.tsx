import React, { useState } from 'react';
import { UploadCloud, Scaling, Download, Lock, Unlock } from 'lucide-react';

export const ImageResizerTool: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [originalWidth, setOriginalWidth] = useState<number>(0);
  const [originalHeight, setOriginalHeight] = useState<number>(0);
  const [targetWidth, setTargetWidth] = useState<number>(0);
  const [targetHeight, setTargetHeight] = useState<number>(0);
  const [lockAspect, setLockAspect] = useState(true);
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);

      const img = new Image();
      img.onload = () => {
        setOriginalWidth(img.width);
        setOriginalHeight(img.height);
        setTargetWidth(img.width);
        setTargetHeight(img.height);
        generateResize(img, img.width, img.height);
      };
      img.src = URL.createObjectURL(selected);
    }
  };

  const handleWidthChange = (w: number) => {
    setTargetWidth(w);
    if (lockAspect && originalWidth > 0) {
      const h = Math.round((w / originalWidth) * originalHeight);
      setTargetHeight(h);
      applyResize(w, h);
    } else {
      applyResize(w, targetHeight);
    }
  };

  const handleHeightChange = (h: number) => {
    setTargetHeight(h);
    if (lockAspect && originalHeight > 0) {
      const w = Math.round((h / originalHeight) * originalWidth);
      setTargetWidth(w);
      applyResize(w, h);
    } else {
      applyResize(targetWidth, h);
    }
  };

  const applyPreset = (w: number, h: number) => {
    setTargetWidth(w);
    setTargetHeight(h);
    applyResize(w, h);
  };

  const applyResize = (w: number, h: number) => {
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      generateResize(img, w, h);
    };
    img.src = URL.createObjectURL(file);
  };

  const generateResize = (img: HTMLImageElement, w: number, h: number) => {
    if (w <= 0 || h <= 0) return;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(img, 0, 0, w, h);
    canvas.toBlob((blob) => {
      if (blob) {
        setResizedUrl(URL.createObjectURL(blob));
      }
    }, 'image/png');
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px', fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
          Image Resizer
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}>
          Ubah resolusi lebar dan tinggi gambar dengan cepat sesuai kebutuhan media sosial atau pas foto.
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
            <Scaling size={30} color="var(--brand-dark)" />
          </div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }}>Pilih Gambar untuk Di-Resize</div>
          <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            Mendukung file JPG, PNG, dan WebP
          </div>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '24px', background: 'var(--color-bg-card)' }}>
          {/* Dimension Inputs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px', color: 'var(--color-text-secondary)' }}>
                Lebar (Pixel)
              </label>
              <input 
                type="number"
                value={targetWidth}
                onChange={(e) => handleWidthChange(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-input-bg)',
                  color: 'var(--color-text-primary)',
                  fontSize: '15px',
                  fontWeight: 600,
                }}
              />
            </div>

            <button
              onClick={() => setLockAspect(!lockAspect)}
              title={lockAspect ? 'Kunci Aspek Rasio (Aktif)' : 'Bebas Rasio'}
              style={{
                marginTop: '18px',
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                background: lockAspect ? 'var(--cat-img-light)' : 'var(--color-bg-surface)',
                color: lockAspect ? 'var(--brand-dark)' : 'var(--color-text-muted)',
                cursor: 'pointer',
              }}
            >
              {lockAspect ? <Lock size={16} /> : <Unlock size={16} />}
            </button>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px', color: 'var(--color-text-secondary)' }}>
                Tinggi (Pixel)
              </label>
              <input 
                type="number"
                value={targetHeight}
                onChange={(e) => handleHeightChange(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-input-bg)',
                  color: 'var(--color-text-primary)',
                  fontSize: '15px',
                  fontWeight: 600,
                }}
              />
            </div>
          </div>

          {/* Quick Presets */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '8px', color: 'var(--color-text-secondary)' }}>
              Preset Ukuran Populer:
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {[
                { label: 'Instagram Post (1:1)', w: 1080, h: 1080 },
                { label: 'Story / Reel (9:16)', w: 1080, h: 1920 },
                { label: 'YouTube Thumb (16:9)', w: 1280, h: 720 },
                { label: 'Full HD (1920x1080)', w: 1920, h: 1080 },
                { label: 'Pas Foto 3x4 (354x472)', w: 354, h: 472 },
                { label: 'Pas Foto 4x6 (472x709)', w: 472, h: 709 },
              ].map(p => (
                <button
                  key={p.label}
                  onClick={() => applyPreset(p.w, p.h)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-bg-base)',
                    color: 'var(--color-text-primary)',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {resizedUrl && (
              <a
                href={resizedUrl}
                download={`resized_${targetWidth}x${targetHeight}_${file.name}`}
                className="btn-primary"
                style={{ flex: 1, textDecoration: 'none', padding: '12px' }}
              >
                <Download size={17} />
                <span>Unduh Gambar ({targetWidth} x {targetHeight} px)</span>
              </a>
            )}
            <button
              onClick={() => { setFile(null); setResizedUrl(null); }}
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
