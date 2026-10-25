import React, { useState } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation',
  'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat',
  'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 'velit', 'esse',
  'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat',
  'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt',
  'mollit', 'anim', 'id', 'est', 'laborum'
];

export const LoremGeneratorTool: React.FC = () => {
  const [count, setCount] = useState(3);
  const [unit, setUnit] = useState<'paragraphs' | 'words' | 'sentences'>('paragraphs');
  const [generatedText, setGeneratedText] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    if (unit === 'words') {
      const words = [];
      for (let i = 0; i < count; i++) {
        words.push(LOREM_WORDS[i % LOREM_WORDS.length]);
      }
      setGeneratedText(words.join(' ') + '.');
    } else if (unit === 'sentences') {
      const sentences = [];
      for (let s = 0; s < count; s++) {
        const sentenceLen = Math.floor(Math.random() * 8) + 8;
        const words = [];
        for (let i = 0; i < sentenceLen; i++) {
          words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
        }
        const text = words.join(' ');
        sentences.push(text.charAt(0).toUpperCase() + text.slice(1) + '.');
      }
      setGeneratedText(sentences.join(' '));
    } else {
      // paragraphs
      const paragraphs = [];
      for (let p = 0; p < count; p++) {
        const sentences = [];
        for (let s = 0; s < 5; s++) {
          const sentenceLen = Math.floor(Math.random() * 8) + 8;
          const words = [];
          for (let i = 0; i < sentenceLen; i++) {
            words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
          }
          const text = words.join(' ');
          sentences.push(text.charAt(0).toUpperCase() + text.slice(1) + '.');
        }
        paragraphs.push(sentences.join(' '));
      }
      setGeneratedText(paragraphs.join('\n\n'));
    }
  };

  React.useEffect(() => {
    generate();
  }, [count, unit]);

  const copyText = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px', fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
          Lorem Ipsum Generator
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}>
          Hasilkan teks dummy placeholder untuk desain mock-up dan prototyping.
        </p>
      </div>

      <div className="glass-card" style={{ padding: '24px', background: 'var(--color-bg-card)', marginBottom: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '16px', alignItems: 'flex-end', marginBottom: '20px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px', color: 'var(--color-text-secondary)' }}>
              Jumlah:
            </label>
            <input 
              type="number"
              min="1"
              max="50"
              value={count}
              onChange={(e) => setCount(Math.max(1, Number(e.target.value)))}
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

          <div>
            <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px', color: 'var(--color-text-secondary)' }}>
              Satuan:
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[
                { label: 'Paragraf', val: 'paragraphs' },
                { label: 'Kalimat', val: 'sentences' },
                { label: 'Kata', val: 'words' },
              ].map(u => (
                <button
                  key={u.val}
                  onClick={() => setUnit(u.val as any)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: 'var(--radius-sm)',
                    border: unit === u.val ? '2px solid var(--brand-dark)' : '1px solid var(--color-border)',
                    background: unit === u.val ? 'var(--cat-img-light)' : 'var(--color-bg-surface)',
                    color: unit === u.val ? 'var(--brand-dark)' : 'var(--color-text-secondary)',
                    fontWeight: unit === u.val ? 700 : 500,
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  {u.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generate}
            className="btn-primary"
            style={{ padding: '11px 20px', fontSize: '13px' }}
          >
            <RefreshCw size={15} />
            <span>Generate</span>
          </button>
        </div>

        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
            <button
              onClick={copyText}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg-surface)',
                color: 'var(--color-text-primary)',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
              <span>{copied ? 'Tersalin' : 'Salin Semua'}</span>
            </button>
          </div>

          <textarea
            rows={10}
            readOnly
            value={generatedText}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-input-bg)',
              color: 'var(--color-text-primary)',
              fontSize: '14px',
              lineHeight: 1.6,
              resize: 'vertical',
            }}
          />
        </div>
      </div>
    </div>
  );
};
