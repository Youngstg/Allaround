import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Download, AlertTriangle } from 'lucide-react';
import { hexToRgb } from '../../utils/tools-logic';

export const QrGeneratorTool: React.FC = () => {
  const [text, setText] = useState('https://allaround.tools');
  const [darkColor, setDarkColor] = useState('#0F172A');
  const [lightColor, setLightColor] = useState('#FFFFFF');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [svgBlobUrl, setSvgBlobUrl] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isLowContrast = (() => {
    try {
      const rgb1 = hexToRgb(darkColor);
      const rgb2 = hexToRgb(lightColor);
      const lum = (r: number, g: number, b: number) => {
        const a = [r, g, b].map(v => {
          v /= 255;
          return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
      };
      const l1 = lum(rgb1.r, rgb1.g, rgb1.b);
      const l2 = lum(rgb2.r, rgb2.g, rgb2.b);
      const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      return ratio < 2.5;
    } catch {
      return false;
    }
  })();

  useEffect(() => {
    generateQr();
  }, [text, darkColor, lightColor]);

  const generateQr = async () => {
    if (!text.trim()) {
      setQrDataUrl('');
      setSvgBlobUrl('');
      setErrorMsg(null);
      return;
    }

    try {
      setErrorMsg(null);
      const url = await QRCode.toDataURL(text, {
        width: 320,
        margin: 2,
        color: {
          dark: darkColor,
          light: lightColor,
        },
      });
      setQrDataUrl(url);

      // Generate SVG as well
      const svgStr = await QRCode.toString(text, {
        type: 'svg',
        margin: 2,
        color: {
          dark: darkColor,
          light: lightColor,
        },
      });
      const blob = new Blob([svgStr], { type: 'image/svg+xml' });
      setSvgBlobUrl(URL.createObjectURL(blob));
    } catch (err: any) {
      setQrDataUrl('');
      setSvgBlobUrl('');
      if (err?.message && err.message.toLowerCase().includes('big')) {
        setErrorMsg('Teks terlalu panjang untuk disimpan dalam kode QR (maksimal ~2.000 karakter). Mohon perpendek teks Anda.');
      } else {
        setErrorMsg('Gagal menghasilkan kode QR. Pastikan teks masukan valid.');
      }
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px', fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
          QR Code Generator
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}>
          Buat kode QR instan dari URL website, teks, atau tautan dengan kustomisasi warna dan ekspor PNG / SVG.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Controls */}
        <div className="glass-card" style={{ padding: '24px', background: 'var(--color-bg-card)' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '8px', color: 'var(--color-text-primary)' }}>
              Isi Teks / URL Link:
            </label>
            <textarea 
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ketik https://... atau teks pesan (maksimal ~2.000 karakter)"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-input-bg)',
                color: 'var(--color-text-primary)',
                outline: 'none',
                fontSize: '14px',
                resize: 'vertical',
                fontFamily: 'var(--font-body)',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '11px', color: 'var(--color-text-muted)' }}>
              <span>Batas panjang teks: ~2.000 karakter</span>
              <span>{text.length} karakter</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px', color: 'var(--color-text-secondary)' }}>
                Warna Kode:
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="color" 
                  value={darkColor} 
                  onChange={(e) => setDarkColor(e.target.value)}
                  style={{ width: '40px', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>{darkColor}</span>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px', color: 'var(--color-text-secondary)' }}>
                Warna Background:
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="color" 
                  value={lightColor} 
                  onChange={(e) => setLightColor(e.target.value)}
                  style={{ width: '40px', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>{lightColor}</span>
              </div>
            </div>
          </div>

          {/* Contrast Warning */}
          {isLowContrast && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              marginBottom: '16px',
              background: '#FFFBEB',
              border: '1px solid #FDE68A',
              borderRadius: 'var(--radius-md)',
              color: '#B45309',
              fontSize: '12px',
            }}>
              <AlertTriangle size={16} style={{ flexShrink: 0 }} />
              <span><strong>Peringatan Kontras:</strong> Warna kode dan latar belakang sangat mirip. Kamera HP mungkin sulit memindai QR code ini.</span>
            </div>
          )}

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '8px', color: 'var(--color-text-secondary)' }}>
              Preset Warna Cepat:
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {[
                { label: 'Classic', dark: '#0F172A', light: '#FFFFFF' },
                { label: 'Sky Pastel', dark: '#0284C7', light: '#F0F9FF' },
                { label: 'Navy Ice', dark: '#1E3A8A', light: '#EFF6FF' },
                { label: 'Glacier Teal', dark: '#047857', light: '#F0FDF4' },
                { label: 'Slate Blue', dark: '#334155', light: '#F8FAFC' },
              ].map((p) => (
                <button
                  key={p.label}
                  onClick={() => { setDarkColor(p.dark); setLightColor(p.light); }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--color-border)',
                    background: p.light,
                    color: p.dark,
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* QR Preview & Download */}
        <div className="glass-card" style={{ padding: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-card)' }}>
          {errorMsg ? (
            <div style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: '#FEF2F2',
              border: '1px solid #FCA5A5',
              color: '#991B1B',
              fontSize: '13px',
              lineHeight: 1.5,
              maxWidth: '300px',
            }}>
              <AlertTriangle size={24} color="#DC2626" style={{ margin: '0 auto 8px', display: 'block' }} />
              {errorMsg}
            </div>
          ) : qrDataUrl ? (
            <>
              <div style={{
                padding: '16px',
                borderRadius: 'var(--radius-lg)',
                background: lightColor,
                boxShadow: 'var(--shadow-md)',
                marginBottom: '20px',
                border: '1px solid var(--color-border)',
              }}>
                <img src={qrDataUrl} alt="QR Code" style={{ width: '220px', height: '220px', display: 'block' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '240px' }}>
                <a
                  href={qrDataUrl}
                  download="qrcode_allaround.png"
                  className="btn-primary"
                  style={{
                    textDecoration: 'none',
                    padding: '10px 16px',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '13px',
                  }}
                >
                  <Download size={16} />
                  <span>Unduh PNG</span>
                </a>

                {svgBlobUrl && (
                  <a
                    href={svgBlobUrl}
                    download="qrcode_allaround.svg"
                    className="btn-secondary"
                    style={{
                      textDecoration: 'none',
                      padding: '10px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontSize: '13px',
                    }}
                  >
                    <Download size={16} />
                    <span>Unduh SVG (Vektor)</span>
                  </a>
                )}
              </div>
            </>
          ) : (
            <div style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
              Masukkan teks untuk menghasilkan kode QR
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
