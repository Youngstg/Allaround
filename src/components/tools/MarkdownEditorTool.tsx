import React, { useState } from 'react';
import { Copy, Check, Download, Printer, Eye } from 'lucide-react';
import { parseMarkdownToHtml } from '../../utils/tools-logic';

const DEFAULT_MARKDOWN = `# Dokumentasi Proyek AllAround
 
Selamat datang di **Markdown Live Editor**. Anda dapat mengetik sintaks Markdown di sisi kiri dan melihat hasil render secara langsung di sisi kanan.

## Fitur Utama
- **100% Client-Side:** Semua data Anda tersimpan lokal di peramban.
- **Dukungan Sintaks Lengkap:** Judul, tebal, miring, daftar, kutipan, dan blok kode.
- **Ekspor Fleksibel:** Unduh file \`.md\`, salin HTML, atau cetak ke PDF.

### Contoh Format Kode
\`\`\`javascript
function hitungTotal(a, b) {
  return a + b;
}
\`\`\`

> *"Kesederhanaan adalah kunci kecanggihan tertinggi."* — Leonardo da Vinci

---
*Dibuat dengan cinta untuk produktivitas Anda.*
`;

export const MarkdownEditorTool: React.FC = () => {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [copied, setCopied] = useState(false);

  const copyHtml = () => {
    navigator.clipboard.writeText(parseMarkdownToHtml(markdown));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadMd = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const printDocument = () => {
    window.print();
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1080px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px', fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
          Markdown Live Editor
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}>
          Tulis dan pratinjau dokumen Markdown secara real-time dengan opsi ekspor HTML dan cetak PDF.
        </p>
      </div>

      {/* Toolbar Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginBottom: '14px' }}>
        <button
          onClick={copyHtml}
          className="btn-secondary"
          style={{ padding: '7px 12px', fontSize: '12px' }}
        >
          {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
          <span>{copied ? 'HTML Tersalin' : 'Salin HTML'}</span>
        </button>

        <button
          onClick={downloadMd}
          className="btn-secondary"
          style={{ padding: '7px 12px', fontSize: '12px' }}
        >
          <Download size={14} />
          <span>Unduh .md</span>
        </button>

        <button
          onClick={printDocument}
          className="btn-primary"
          style={{ padding: '7px 14px', fontSize: '12px' }}
        >
          <Printer size={14} />
          <span>Cetak / PDF</span>
        </button>
      </div>

      {/* Split Panes */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Editor Pane */}
        <div className="glass-card" style={{ padding: '16px', background: 'var(--color-bg-card)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
            Markdown Input
          </div>
          <textarea
            rows={18}
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Ketik sintaks markdown di sini..."
            style={{
              flex: 1,
              width: '100%',
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-input-bg)',
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              lineHeight: 1.6,
              outline: 'none',
              resize: 'vertical',
            }}
          />
        </div>

        {/* Live Preview Pane */}
        <div className="glass-card" style={{ padding: '16px', background: 'var(--color-bg-card)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--brand-dark)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Eye size={15} />
            <span>Live Rendered Preview</span>
          </div>
          <div 
            style={{
              flex: 1,
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg-surface)',
              color: 'var(--color-text-primary)',
              lineHeight: 1.6,
              overflowY: 'auto',
              maxHeight: '440px',
            }}
            dangerouslySetInnerHTML={{ __html: parseMarkdownToHtml(markdown) }}
          />
        </div>
      </div>
    </div>
  );
};
