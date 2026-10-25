import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Download, Copy, Check } from 'lucide-react';

export const QrGeneratorTool: React.FC = () => {
  const [text, setText] = useState('https://allaround.tools');
  const [darkColor, setDarkColor] = useState('#0F172A');
  const [lightColor, setLightColor] = useState('#FFFFFF');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    generateQr();
  }, [text, darkColor, lightColor]);

  const generateQr = async () => {
    if (!text.trim()) {
      setQrDataUrl('');
      return;
    }
    try {
      const url = await QRCode.toDataURL(text, {
        width: 320,
        margin: 2,
        color: {
          dark: darkColor,
          light: lightColor,
        },
      });
      setQrDataUrl(url);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px', fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
          QR Code Generator
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}>
          Buat kode QR instan dari URL website, teks, atau tautan dengan kustomisasi warna biru pastel.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Controls */}
        <div className="glass-card" style={{ padding: '24px', background: 'var(--color-bg-card)' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '8px', color: 'var(--color-text-primary)' }}>
              Isi Teks / URL Link:
            </label>
            <input 
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ketik https://... atau teks pesan"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-input-bg)',
                color: 'var(--color-text-primary)',
                outline: 'none',
                fontSize: '14px',
              }}
            />
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
          {qrDataUrl ? (
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

              <a
                href={qrDataUrl}
                download="qrcode_allaround.png"
                className="btn-primary"
                style={{
                  textDecoration: 'none',
                  padding: '12px 24px',
                  color: '#FFFFFF',
                  width: '100%',
                  maxWidth: '240px',
                }}
              >
                <Download size={17} />
                <span>Unduh Gambar QR</span>
              </a>
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
