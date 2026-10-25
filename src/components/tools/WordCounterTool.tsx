import React, { useState } from 'react';
import { Copy, Check, Trash2, Clock, Volume2 } from 'lucide-react';
import { 
  countWords, countChars, countCharsNoSpaces, countSentences, countParagraphs, estimateReadingTime, estimateSpeakingTime 
} from '../../utils/tools-logic';

export const WordCounterTool: React.FC = () => {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const wordCount = countWords(text);
  const charWithSpaces = countChars(text);
  const charNoSpaces = countCharsNoSpaces(text);
  const sentenceCount = countSentences(text);
  const paragraphCount = countParagraphs(text);

  const readingTimeMin = estimateReadingTime(wordCount);
  const speakingTimeMin = estimateSpeakingTime(wordCount);

  const copyText = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '840px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px', fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
          Word Counter & Text Analyzer
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}>
          Hitung kata, karakter, paragraf, serta estimasi waktu membaca dan berbicara secara real-time.
        </p>
      </div>

      {/* Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '20px' }}>
        <div className="glass-card" style={{ padding: '16px', textAlign: 'center', background: 'var(--cat-img-light)', border: '1px solid var(--cat-img-border)' }}>
          <div style={{ fontSize: '12px', color: 'var(--cat-img-dark)', fontWeight: 600 }}>KATA</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-text-primary)', marginTop: '4px' }}>
            {wordCount}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px', textAlign: 'center', background: 'var(--color-bg-card)' }}>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>KARAKTER</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-text-primary)', marginTop: '4px' }}>
            {charWithSpaces}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px', textAlign: 'center', background: 'var(--color-bg-card)' }}>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>TANPA SPASI</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-text-primary)', marginTop: '4px' }}>
            {charNoSpaces}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px', textAlign: 'center', background: 'var(--color-bg-card)' }}>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>KALIMAT</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-text-primary)', marginTop: '4px' }}>
            {sentenceCount}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '16px', textAlign: 'center', background: 'var(--color-bg-card)' }}>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>PARAGRAF</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--color-text-primary)', marginTop: '4px' }}>
            {paragraphCount}
          </div>
        </div>
      </div>

      {/* Reading Time Pills */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 16px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--cat-conv-light)',
          color: 'var(--cat-conv-dark)',
          border: '1px solid var(--cat-conv-border)',
          fontSize: '13px',
          fontWeight: 600,
        }}>
          <Clock size={16} />
          <span>Waktu Baca: ~{readingTimeMin} menit</span>
        </div>

        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 16px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--cat-pdf-light)',
          color: 'var(--cat-pdf-dark)',
          border: '1px solid var(--cat-pdf-border)',
          fontSize: '13px',
          fontWeight: 600,
        }}>
          <Volume2 size={16} />
          <span>Waktu Bicara: ~{speakingTimeMin} menit</span>
        </div>
      </div>

      {/* Editor Box */}
      <div className="glass-card" style={{ padding: '16px', position: 'relative', background: 'var(--color-bg-card)' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginBottom: '8px' }}>
          <button
            onClick={copyText}
            disabled={!text}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg-surface)',
              color: 'var(--color-text-primary)',
              cursor: !text ? 'default' : 'pointer',
              fontSize: '12px',
              fontWeight: 500,
              opacity: !text ? 0.5 : 1,
            }}
          >
            {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
            <span>{copied ? 'Tersalin' : 'Salin'}</span>
          </button>

          <button
            onClick={() => setText('')}
            disabled={!text}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg-surface)',
              color: '#EF4444',
              cursor: !text ? 'default' : 'pointer',
              fontSize: '12px',
              fontWeight: 500,
              opacity: !text ? 0.5 : 1,
            }}
          >
            <Trash2 size={14} />
            <span>Kosongkan</span>
          </button>
        </div>

        <textarea
          rows={12}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Tuliskan atau tempel (paste) teks Anda di sini..."
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            background: 'var(--color-input-bg)',
            color: 'var(--color-text-primary)',
            outline: 'none',
            fontSize: '15px',
            lineHeight: 1.6,
            resize: 'vertical',
            fontFamily: 'var(--font-body)',
          }}
        />
      </div>
    </div>
  );
};
