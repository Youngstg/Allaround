import React, { useState } from 'react';
import { Copy, Check, RefreshCw, Hash } from 'lucide-react';

export const UuidGeneratorTool: React.FC = () => {
  const [quantity, setQuantity] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [removeHyphens, setRemoveHyphens] = useState(false);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const generateUuids = () => {
    const list: string[] = [];
    for (let i = 0; i < quantity; i++) {
      let u: string = crypto.randomUUID();
      if (removeHyphens) u = u.replace(/-/g, '');
      if (uppercase) u = u.toUpperCase();
      list.push(u);
    }
    setUuids(list);
  };

  React.useEffect(() => {
    generateUuids();
  }, [quantity, uppercase, removeHyphens]);

  const copySingle = (uuid: string, idx: number) => {
    navigator.clipboard.writeText(uuid);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join('\n'));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '720px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px', fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
          UUID Generator
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}>
          Hasilkan identifier UUID v4 unik secara instan menggunakan Web Crypto API.
        </p>
      </div>

      <div className="glass-card" style={{ padding: '24px', background: 'var(--color-bg-card)', marginBottom: '20px' }}>
        {/* Controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ flex: 1, minWidth: '160px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px', color: 'var(--color-text-secondary)' }}>
              Jumlah UUID ({quantity}):
            </label>
            <input 
              type="range"
              min="1"
              max="20"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--brand-primary)' }}
            />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer', color: 'var(--color-text-primary)' }}>
            <input 
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              style={{ accentColor: 'var(--brand-primary)' }}
            />
            <span>Huruf Besar (UPPERCASE)</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer', color: 'var(--color-text-primary)' }}>
            <input 
              type="checkbox"
              checked={removeHyphens}
              onChange={(e) => setRemoveHyphens(e.target.checked)}
              style={{ accentColor: 'var(--brand-primary)' }}
            />
            <span>Tanpa Tanda Hubung (-)</span>
          </label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <button
            onClick={generateUuids}
            className="btn-secondary"
            style={{ padding: '8px 14px', fontSize: '12px' }}
          >
            <RefreshCw size={14} />
            <span>Generate Ulang</span>
          </button>

          <button
            onClick={copyAll}
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '12px' }}
          >
            {copiedAll ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
            <span>{copiedAll ? 'Semua Tersalin' : 'Salin Semua'}</span>
          </button>
        </div>

        {/* UUID List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {uuids.map((uuid, idx) => (
            <div
              key={uuid}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: 'var(--color-bg-base)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
              }}
            >
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                color: 'var(--color-text-primary)',
                wordBreak: 'break-all',
              }}>
                {uuid}
              </span>

              <button
                onClick={() => copySingle(uuid, idx)}
                style={{
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-bg-surface)',
                  color: 'var(--color-text-primary)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '11px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginLeft: '8px',
                }}
              >
                {copiedIndex === idx ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                <span>{copiedIndex === idx ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
