import React, { useState } from 'react';
import { GitCompare, ArrowRightLeft, Copy, Check, Trash2 } from 'lucide-react';
import { computeTextDiff, DiffLine } from '../../utils/tools-logic';

export const TextDiffTool: React.FC = () => {
  const [textA, setTextA] = useState(
    `function greeting(name) {\n  console.log("Halo, " + name);\n  return true;\n}`
  );
  const [textB, setTextB] = useState(
    `function greeting(name, title) {\n  const message = \`Halo, \${title ? title + " " : ""}\${name}\`;\n  console.log(message);\n  return true;\n}`
  );
  const [copied, setCopied] = useState(false);

  const { lines, stats } = computeTextDiff(textA, textB);

  const swapTexts = () => {
    const temp = textA;
    setTextA(textB);
    setTextB(temp);
  };

  const copyDiffReport = () => {
    const report = lines.map(l => {
      const prefix = l.type === 'added' ? '+ ' : l.type === 'removed' ? '- ' : '  ';
      return prefix + l.text;
    }).join('\n');

    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '960px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px', fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
          Text Diff Checker
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}>
          Bandingkan perbedaan baris antara dua versi teks atau kode secara real-time.
        </p>
      </div>

      {/* Input Panes */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '14px', alignItems: 'center', marginBottom: '20px' }}>
        <div className="glass-card" style={{ padding: '16px', background: 'var(--color-bg-card)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', fontWeight: 700, color: 'var(--color-text-secondary)' }}>
            <span>Versi Asli (Teks A):</span>
            <button
              onClick={() => setTextA('')}
              style={{ border: 'none', background: 'none', color: '#EF4444', fontSize: '11px', cursor: 'pointer' }}
            >
              Bersihkan
            </button>
          </div>
          <textarea
            rows={7}
            value={textA}
            onChange={(e) => setTextA(e.target.value)}
            placeholder="Ketik teks asli..."
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-input-bg)',
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              lineHeight: 1.5,
              outline: 'none',
              resize: 'vertical',
            }}
          />
        </div>

        <button
          onClick={swapTexts}
          title="Tukar Posisi Teks"
          style={{
            padding: '10px',
            borderRadius: '50%',
            border: '1px solid var(--color-border)',
            background: 'var(--cat-img-light)',
            color: 'var(--brand-dark)',
            cursor: 'pointer',
          }}
        >
          <ArrowRightLeft size={16} />
        </button>

        <div className="glass-card" style={{ padding: '16px', background: 'var(--color-bg-card)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', fontWeight: 700, color: 'var(--brand-dark)' }}>
            <span>Versi Baru (Teks B):</span>
            <button
              onClick={() => setTextB('')}
              style={{ border: 'none', background: 'none', color: '#EF4444', fontSize: '11px', cursor: 'pointer' }}
            >
              Bersihkan
            </button>
          </div>
          <textarea
            rows={7}
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
            placeholder="Ketik teks yang dimodifikasi..."
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-input-bg)',
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              lineHeight: 1.5,
              outline: 'none',
              resize: 'vertical',
            }}
          />
        </div>
      </div>

      {/* Stats & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '12px', fontSize: '12px', fontWeight: 600 }}>
          <span style={{ color: '#059669', background: 'var(--cat-txt-light)', padding: '4px 10px', borderRadius: '100px', border: '1px solid var(--cat-txt-border)' }}>
            +{stats.added} Baris Ditambah
          </span>
          <span style={{ color: '#DC2626', background: 'rgba(239, 68, 68, 0.1)', padding: '4px 10px', borderRadius: '100px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            -{stats.removed} Baris Dihapus
          </span>
          <span style={{ color: 'var(--color-text-muted)', padding: '4px 8px' }}>
            {stats.unchanged} Baris Sama
          </span>
        </div>

        <button
          onClick={copyDiffReport}
          className="btn-secondary"
          style={{ padding: '6px 12px', fontSize: '12px' }}
        >
          {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
          <span>{copied ? 'Tersalin' : 'Salin Laporan Diff'}</span>
        </button>
      </div>

      {/* Diff Output Viewer */}
      <div className="glass-card" style={{ padding: '0', background: 'var(--color-bg-card)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
        <div style={{
          maxHeight: '420px',
          overflowY: 'auto',
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          lineHeight: '22px',
        }}>
          {lines.map((l, idx) => {
            let bg = 'transparent';
            let color = 'var(--color-text-primary)';
            let sign = ' ';

            if (l.type === 'added') {
              bg = 'rgba(16, 185, 129, 0.12)';
              color = '#059669';
              sign = '+';
            } else if (l.type === 'removed') {
              bg = 'rgba(239, 68, 68, 0.12)';
              color = '#DC2626';
              sign = '-';
            }

            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  backgroundColor: bg,
                  padding: '2px 14px',
                  borderBottom: '1px solid rgba(0,0,0,0.02)',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                }}
              >
                <span style={{ width: '28px', color: 'var(--color-text-muted)', userSelect: 'none', textAlign: 'right', marginRight: '10px', fontSize: '11px' }}>
                  {l.lineNumA || ''}
                </span>
                <span style={{ width: '28px', color: 'var(--color-text-muted)', userSelect: 'none', textAlign: 'right', marginRight: '14px', fontSize: '11px' }}>
                  {l.lineNumB || ''}
                </span>
                <span style={{ width: '16px', fontWeight: 800, color, userSelect: 'none' }}>
                  {sign}
                </span>
                <span style={{ flex: 1, color }}>
                  {l.text || ' '}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
