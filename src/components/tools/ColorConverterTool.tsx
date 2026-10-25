import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { hexToRgb, rgbToHsl } from '../../utils/tools-logic';

export const ColorConverterTool: React.FC = () => {
  const [hex, setHex] = useState('#93C5FD');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const rgb = hexToRgb(hex);
  const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslString = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const copyVal = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const CURATED_BLUE_PASTELS = [
    { name: 'Sky Pastel', hex: '#93C5FD' },
    { name: 'Baby Blue', hex: '#BAE6FD' },
    { name: 'Glacier Mist', hex: '#E0F2FE' },
    { name: 'Powder Ice', hex: '#EFF6FF' },
    { name: 'Periwinkle Blue', hex: '#C7D2FE' },
    { name: 'Ice Teal', hex: '#A7F3D0' },
    { name: 'Aqua Azure', hex: '#67E8F9' },
    { name: 'Soft Denim', hex: '#DBEAFE' },
  ];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px', fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
          Color Palette & Converter
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}>
          Konversi format warna antar HEX, RGB, HSL dan temukan inspirasi palet warna biru pastel estetik.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Color Preview & Input */}
        <div className="glass-card" style={{ padding: '24px', background: 'var(--color-bg-card)' }}>
          <div style={{
            height: '160px',
            borderRadius: 'var(--radius-md)',
            background: hex,
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.06)',
            border: '1px solid var(--color-border)',
          }}>
            <input 
              type="color"
              value={hex}
              onChange={(e) => setHex(e.target.value.toUpperCase())}
              style={{ width: '60px', height: '60px', border: 'none', borderRadius: '50%', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'HEX', val: hex, key: 'hex' },
              { label: 'RGB', val: rgbString, key: 'rgb' },
              { label: 'HSL', val: hslString, key: 'hsl' },
            ].map(item => (
              <div 
                key={item.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: 'var(--color-bg-base)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 700 }}>{item.label}</span>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>{item.val}</div>
                </div>
                <button
                  onClick={() => copyVal(item.val, item.key)}
                  style={{
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-bg-surface)',
                    color: 'var(--color-text-primary)',
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '12px',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  {copiedKey === item.key ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                  <span>{copiedKey === item.key ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Curated Blue Pastels */}
        <div className="glass-card" style={{ padding: '24px', background: 'var(--color-bg-card)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px', fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
            Palet Biru Pastel Pilihan
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {CURATED_BLUE_PASTELS.map(pastel => (
              <div
                key={pastel.name}
                onClick={() => setHex(pastel.hex)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-bg-base)',
                  border: hex === pastel.hex ? '2px solid var(--brand-primary)' : '1px solid var(--color-border)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: pastel.hex,
                  border: '1px solid rgba(0,0,0,0.08)',
                }} />
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{pastel.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>{pastel.hex}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
