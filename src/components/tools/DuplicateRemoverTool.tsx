import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { processDuplicateLines } from '../../utils/tools-logic';

export const DuplicateRemoverTool: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [trimWhitespace, setTrimWhitespace] = useState(true);
  const [sortAlphabetically, setSortAlphabetically] = useState(false);
  const [copied, setCopied] = useState(false);

  const { result, removedCount, initialCount, uniqueCount } = processDuplicateLines(inputText, {
    caseSensitive,
    trimWhitespace,
    sortAlphabetically,
  });

  const copyResult = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '840px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px', fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
          Duplicate Line Remover
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}>
          Bersihkan baris teks duplikat dan kosong dari daftar atau data teks Anda secara otomatis.
        </p>
      </div>

      {/* Options Bar */}
      <div className="glass-card" style={{ padding: '16px 20px', marginBottom: '20px', background: 'var(--color-bg-card)', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', color: 'var(--color-text-primary)' }}>
          <input 
            type="checkbox" 
            checked={trimWhitespace} 
            onChange={(e) => setTrimWhitespace(e.target.checked)} 
            style={{ accentColor: 'var(--brand-primary)' }}
          />
          <span>Hapus Spasi Depan/Belakang</span>
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', color: 'var(--color-text-primary)' }}>
          <input 
            type="checkbox" 
            checked={caseSensitive} 
            onChange={(e) => setCaseSensitive(e.target.checked)} 
            style={{ accentColor: 'var(--brand-primary)' }}
          />
          <span>Case Sensitive</span>
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer', color: 'var(--color-text-primary)' }}>
          <input 
            type="checkbox" 
            checked={sortAlphabetically} 
            onChange={(e) => setSortAlphabetically(e.target.checked)} 
            style={{ accentColor: 'var(--brand-primary)' }}
          />
          <span>Urutkan Abjad (A-Z)</span>
        </label>

        {inputText && (
          <div style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--brand-dark)', fontWeight: 600 }}>
            {removedCount} baris duplikat dibuang
          </div>
        )}
      </div>

      {/* Input and Output Split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div className="glass-card" style={{ padding: '16px', background: 'var(--color-bg-card)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-secondary)' }}>
              Teks Masukan ({initialCount || 0} baris)
            </span>
            <button
              onClick={() => setInputText('')}
              disabled={!inputText}
              style={{ border: 'none', background: 'none', color: '#EF4444', fontSize: '12px', cursor: 'pointer', opacity: !inputText ? 0.4 : 1 }}
            >
              Bersihkan
            </button>
          </div>
          <textarea
            rows={12}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Tempel baris teks di sini..."
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-input-bg)',
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              outline: 'none',
              resize: 'vertical',
            }}
          />
        </div>

        <div className="glass-card" style={{ padding: '16px', background: 'var(--color-bg-card)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--brand-dark)' }}>
              Hasil Bersih ({uniqueCount || 0} baris)
            </span>
            <button
              onClick={copyResult}
              disabled={!result}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg-surface)',
                color: 'var(--color-text-primary)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '11px',
                cursor: !result ? 'default' : 'pointer',
                opacity: !result ? 0.4 : 1,
              }}
            >
              {copied ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
              <span>{copied ? 'Tersalin' : 'Salin'}</span>
            </button>
          </div>
          <textarea
            rows={12}
            readOnly
            value={result}
            placeholder="Hasil tanpa duplikat akan tampil di sini..."
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-input-bg)',
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              outline: 'none',
              resize: 'vertical',
            }}
          />
        </div>
      </div>
    </div>
  );
};
