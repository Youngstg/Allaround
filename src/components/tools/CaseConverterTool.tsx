import React, { useState } from 'react';
import { Copy, Check, Trash2 } from 'lucide-react';
import { 
  toUpper, toLower, toTitle, toSentence, toCamel, toPascal, toSnake, toKebab 
} from '../../utils/tools-logic';

export const CaseConverterTool: React.FC = () => {
  const [text, setText] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyVal = (val: string, key: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const CONVERSIONS = [
    { label: 'UPPERCASE', fn: toUpper, key: 'upper' },
    { label: 'lowercase', fn: toLower, key: 'lower' },
    { label: 'Title Case', fn: toTitle, key: 'title' },
    { label: 'Sentence case', fn: toSentence, key: 'sentence' },
    { label: 'camelCase', fn: toCamel, key: 'camel' },
    { label: 'PascalCase', fn: toPascal, key: 'pascal' },
    { label: 'snake_case', fn: toSnake, key: 'snake' },
    { label: 'kebab-case', fn: toKebab, key: 'kebab' },
  ];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '840px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px', fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
          Case Converter
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}>
          Ubah format huruf teks ke UPPERCASE, lowercase, camelCase, snake_case, dan lainnya.
        </p>
      </div>

      <div className="glass-card" style={{ padding: '20px', marginBottom: '24px', background: 'var(--color-bg-card)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            Masukkan Teks Sumber:
          </span>
          <button
            onClick={() => setText('')}
            disabled={!text}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              border: 'none',
              background: 'transparent',
              color: '#EF4444',
              cursor: !text ? 'default' : 'pointer',
              fontSize: '12px',
              opacity: !text ? 0.4 : 1,
            }}
          >
            <Trash2 size={13} />
            <span>Bersihkan</span>
          </button>
        </div>

        <textarea
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ketik atau tempel teks di sini..."
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            background: 'var(--color-input-bg)',
            color: 'var(--color-text-primary)',
            fontSize: '14px',
            lineHeight: 1.6,
            outline: 'none',
            resize: 'vertical',
          }}
        />
      </div>

      {/* Conversion Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
        {CONVERSIONS.map((conv) => {
          const converted = text ? conv.fn(text) : '';
          return (
            <div
              key={conv.key}
              style={{
                padding: '14px 16px',
                background: 'var(--color-bg-card)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand-dark)' }}>
                  {conv.label}
                </span>
                <button
                  onClick={() => copyVal(converted, conv.key)}
                  disabled={!text}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-bg-surface)',
                    color: 'var(--color-text-primary)',
                    cursor: !text ? 'default' : 'pointer',
                    fontSize: '11px',
                    opacity: !text ? 0.4 : 1,
                  }}
                >
                  {copiedKey === conv.key ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                  <span>{copiedKey === conv.key ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>

              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                color: text ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                maxHeight: '70px',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
              }}>
                {converted || 'Hasil akan tampil di sini'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
