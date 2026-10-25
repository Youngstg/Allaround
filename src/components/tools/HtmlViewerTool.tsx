import React, { useState, useRef, useEffect } from 'react';
import { 
  FileCode, Eye, Code, Download, Upload, Copy, Check, 
  RotateCcw, RefreshCw, ExternalLink, Monitor, Tablet, 
  Smartphone, Maximize2, Trash2, Sparkles, Shield, 
  Sun, Moon, Grid, Layers
} from 'lucide-react';
import { 
  formatHtml, 
  minifyHtml, 
  countHtmlTags, 
  extractHtmlTitle, 
  countWords, 
  countChars 
} from '../../utils/tools-logic';

// ==========================================
// SAMPLE HTML PRESETS
// ==========================================
interface PresetTemplate {
  id: string;
  name: string;
  description: string;
  html: string;
}

const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    id: 'modern-card',
    name: 'Kartu Profil Modern',
    description: 'Desain kartu modern dengan gradasi warna pastel dan tombol aksi.',
    html: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kartu Profil Modern</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: linear-gradient(135deg, #e0f2fe 0%, #eff6ff 50%, #f0fdf4 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      color: #0f172a;
    }
    .profile-card {
      background: #ffffff;
      border-radius: 24px;
      padding: 32px;
      max-width: 440px;
      width: 100%;
      box-shadow: 0 16px 36px rgba(56, 189, 248, 0.16);
      border: 1px solid #e2e8f0;
      text-align: center;
      transition: all 0.3s ease;
    }
    .profile-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px rgba(56, 189, 248, 0.22);
    }
    .avatar-wrapper {
      width: 96px;
      height: 96px;
      margin: 0 auto 16px;
      border-radius: 50%;
      background: linear-gradient(135deg, #38bdf8, #818cf8);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 38px;
      color: white;
      box-shadow: 0 6px 16px rgba(56, 189, 248, 0.4);
    }
    .badge {
      display: inline-block;
      padding: 4px 14px;
      background: #e0f2fe;
      color: #0284c7;
      font-size: 12px;
      font-weight: 700;
      border-radius: 9999px;
      margin-bottom: 12px;
      letter-spacing: 0.5px;
    }
    h1 {
      font-size: 24px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 6px;
    }
    .role {
      font-size: 14px;
      color: #0284c7;
      font-weight: 600;
      margin-bottom: 16px;
    }
    p {
      color: #64748b;
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .skills-container {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: center;
      margin-bottom: 24px;
    }
    .skill-tag {
      background: #f1f5f9;
      color: #475569;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
    }
    .action-btn {
      width: 100%;
      padding: 12px 24px;
      background: linear-gradient(135deg, #0284c7, #38bdf8);
      color: #ffffff;
      border: none;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(2, 132, 199, 0.35);
      transition: all 0.2s ease;
    }
    .action-btn:hover {
      opacity: 0.92;
      transform: scale(0.99);
    }
  </style>
</head>
<body>
  <div class="profile-card">
    <div class="avatar-wrapper">✨</div>
    <span class="badge">PROFIL TERVERIFIKASI</span>
    <h1>Arya Pratama</h1>
    <div class="role">Frontend Developer & UI Specialist</div>
    <p>Pengembang web dengan antusiasme tinggi pada desain bersih, aksesibilitas modern, dan performa tinggi di peramban.</p>
    <div class="skills-container">
      <span class="skill-tag">HTML5 & CSS3</span>
      <span class="skill-tag">JavaScript ES6</span>
      <span class="skill-tag">TypeScript</span>
      <span class="skill-tag">React</span>
    </div>
    <button class="action-btn" onclick="alert('Halo! Terima kasih telah melihat profil ini.')">Hubungi Arya</button>
  </div>
</body>
</html>`
  },
  {
    id: 'landing-hero',
    name: 'Landing Page Hero',
    description: 'Header landing page lengkap dengan navigasi, headline, dan kartu fitur.',
    html: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Solusi Cerdas untuk Bisnis Anda</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #fafafa;
      color: #1e293b;
      line-height: 1.5;
    }
    nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 18px 32px;
      background: #ffffff;
      border-bottom: 1px solid #e2e8f0;
    }
    .logo {
      font-weight: 900;
      font-size: 20px;
      background: linear-gradient(135deg, #2563eb, #38bdf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero {
      text-align: center;
      padding: 56px 20px 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    .pill {
      display: inline-block;
      padding: 6px 14px;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      color: #1d4ed8;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 18px;
    }
    h1 {
      font-size: 36px;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin-bottom: 16px;
      color: #0f172a;
    }
    p.lead {
      font-size: 17px;
      color: #64748b;
      margin-bottom: 28px;
    }
    .btn-group {
      display: flex;
      gap: 12px;
      justify-content: center;
      margin-bottom: 48px;
    }
    .btn-primary {
      background: #2563eb;
      color: white;
      padding: 12px 24px;
      border-radius: 10px;
      font-weight: 600;
      text-decoration: none;
      border: none;
      cursor: pointer;
    }
    .btn-secondary {
      background: #ffffff;
      color: #334155;
      padding: 12px 24px;
      border-radius: 10px;
      font-weight: 600;
      border: 1px solid #cbd5e1;
      cursor: pointer;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 18px;
      padding: 0 24px 60px;
      max-width: 900px;
      margin: 0 auto;
    }
    .feature {
      background: white;
      padding: 24px;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    .feature h3 {
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 8px;
      color: #1e293b;
    }
    .feature p {
      font-size: 13px;
      color: #64748b;
    }
  </style>
</head>
<body>
  <nav>
    <div class="logo">⚡ ALLAROUND</div>
    <button class="btn-primary" style="padding: 8px 16px; font-size: 13px;">Masuk</button>
  </nav>

  <section class="hero">
    <div class="pill">🚀 Versi 2.0 Sekarang Tersedia</div>
    <h1>Alat Produktivitas Terlengkap Dalam Satu Peramban</h1>
    <p class="lead">Kelola dokumen, kompresi gambar, manipulasi teks, dan pratinjau kode HTML Anda tanpa memerlukan instalasi aplikasi tambahan.</p>
    <div class="btn-group">
      <button class="btn-primary" onclick="alert('Selamat datang!')">Mulai Gratis</button>
      <button class="btn-secondary" onclick="alert('Dokumentasi lengkap dapat diakses di menu.')">Pelajari Fitur</button>
    </div>
  </section>

  <div class="grid">
    <div class="feature">
      <h3>🔒 100% Client-Side</h3>
      <p>Data Anda diproses lokal tanpa meninggalkan peramban untuk menjaga privasi.</p>
    </div>
    <div class="feature">
      <h3>⚡ Cepat & Ringan</h3>
      <p>Dioptimalkan tanpa dependensi berat dengan latensi render mendekati 0 milidetik.</p>
    </div>
    <div class="feature">
      <h3>📱 Responsif</h3>
      <p>Tampilan fleksibel untuk berbagai format gawai dari ponsel hingga desktop.</p>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: 'interactive-counter',
    name: 'Kalkulator / Counter Interaktif',
    description: 'Contoh aplikasi interaktif dengan script JavaScript terintegrasi.',
    html: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Counter Interaktif</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0f172a;
      color: #f8fafc;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .box {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 20px;
      padding: 36px 32px;
      max-width: 400px;
      width: 100%;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    }
    .counter-val {
      font-size: 64px;
      font-weight: 800;
      color: #38bdf8;
      margin: 20px 0;
      font-variant-numeric: tabular-nums;
    }
    .btn-row {
      display: flex;
      gap: 12px;
      justify-content: center;
      margin-bottom: 20px;
    }
    button {
      padding: 12px 20px;
      font-size: 16px;
      font-weight: bold;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      transition: transform 0.1s ease;
    }
    button:active { transform: scale(0.95); }
    .btn-minus { background: #ef4444; color: white; }
    .btn-reset { background: #475569; color: white; }
    .btn-plus { background: #10b981; color: white; }
    .color-btn {
      width: 100%;
      padding: 10px;
      background: #38bdf8;
      color: #0f172a;
      border-radius: 10px;
      font-weight: 700;
      margin-top: 10px;
    }
    .log-box {
      font-family: monospace;
      font-size: 12px;
      color: #94a3b8;
      margin-top: 16px;
      background: #0f172a;
      padding: 8px;
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <div class="box">
    <h2>Interaktif Demo JS</h2>
    <p style="color: #94a3b8; font-size: 13px;">Uji coba eksekusi JavaScript di sandbox iframe</p>
    <div id="counter" class="counter-val">0</div>
    <div class="btn-row">
      <button class="btn-minus" onclick="ubah(-1)">-1</button>
      <button class="btn-reset" onclick="reset()">Reset</button>
      <button class="btn-plus" onclick="ubah(1)">+1</button>
    </div>
    <button class="color-btn" onclick="acakWarna()">Acak Warna Tema</button>
    <div id="log" class="log-box">Status: Siap berinteraksi</div>
  </div>

  <script>
    let hitungan = 0;
    const counterEl = document.getElementById('counter');
    const logEl = document.getElementById('log');

    function ubah(n) {
      hitungan += n;
      counterEl.textContent = hitungan;
      logEl.textContent = 'Nilai diubah menjadi: ' + hitungan + ' (' + new Date().toLocaleTimeString() + ')';
    }

    function reset() {
      hitungan = 0;
      counterEl.textContent = hitungan;
      logEl.textContent = 'Counter di-reset ke 0';
    }

    function acakWarna() {
      const warna = ['#38bdf8', '#a855f7', '#ec4899', '#f59e0b', '#10b981'];
      const pilih = warna[Math.floor(Math.random() * warna.length)];
      counterEl.style.color = pilih;
      logEl.textContent = 'Warna angka diubah ke ' + pilih;
    }
  </script>
</body>
</html>`
  },
  {
    id: 'contact-form',
    name: 'Formulir Kontak',
    description: 'Desain form input dengan validasi visual, checkbox, dan tombol submit.',
    html: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Formulir Kontak</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f1f5f9;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 24px;
      color: #1e293b;
    }
    .form-card {
      background: white;
      padding: 32px;
      border-radius: 16px;
      width: 100%;
      max-width: 480px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
    }
    h2 { margin-bottom: 6px; font-size: 22px; font-weight: 700; }
    p { color: #64748b; font-size: 14px; margin-bottom: 20px; }
    .form-group { margin-bottom: 16px; }
    label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; color: #334155; }
    input, textarea, select {
      width: 100%;
      padding: 10px 14px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
    }
    input:focus, textarea:focus, select:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
    }
    button {
      width: 100%;
      padding: 12px;
      background: #2563eb;
      color: white;
      font-weight: 600;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      margin-top: 10px;
    }
    button:hover { background: #1d4ed8; }
  </style>
</head>
<body>
  <div class="form-card">
    <h2>Hubungi Tim Kami</h2>
    <p>Silakan isi informasi di bawah ini untuk memulai percakapan.</p>
    <form onsubmit="event.preventDefault(); alert('Pesan berhasil dikirim!');">
      <div class="form-group">
        <label>Nama Lengkap</label>
        <input type="text" placeholder="Budi Santoso" required>
      </div>
      <div class="form-group">
        <label>Alamat Email</label>
        <input type="email" placeholder="budi@example.com" required>
      </div>
      <div class="form-group">
        <label>Topik Pertanyaan</label>
        <select>
          <option>Bantuan Teknis</option>
          <option>Kerja Sama Bisnis</option>
          <option>Umpan Balik Fitur</option>
        </select>
      </div>
      <div class="form-group">
        <label>Isi Pesan</label>
        <textarea rows="4" placeholder="Tuliskan pesan Anda di sini..." required></textarea>
      </div>
      <button type="submit">Kirim Pesan Sekarang</button>
    </form>
  </div>
</body>
</html>`
  },
  {
    id: 'starter-blank',
    name: 'Starter Minimal HTML5',
    description: 'Kerangka standar HTML5 bersih untuk memulai dari nol.',
    html: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dokumen Baru</title>
  <style>
    body {
      font-family: sans-serif;
      padding: 40px;
      line-height: 1.6;
      color: #333;
    }
    h1 { color: #0284c7; }
  </style>
</head>
<body>
  <h1>Halo Dunia!</h1>
  <p>Selamat datang di halaman HTML baru Anda. Ketikkan konten dan gaya CSS Anda di sini.</p>
</body>
</html>`
  }
];

type ViewMode = 'split' | 'code' | 'preview';
type DeviceMode = 'fluid' | 'desktop' | 'tablet' | 'mobile';
type CanvasBg = 'light' | 'dark' | 'grid';

export const HtmlViewerTool: React.FC = () => {
  const [html, setHtml] = useState<string>(PRESET_TEMPLATES[0].html);
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('fluid');
  const [canvasBg, setCanvasBg] = useState<CanvasBg>('light');
  const [allowScripts, setAllowScripts] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Stats calculation
  const totalChars = countChars(html);
  const totalWords = countWords(html);
  const totalTags = countHtmlTags(html);
  const lineCount = html ? html.split('\n').length : 0;
  const docTitle = extractHtmlTitle(html);
  const sizeInBytes = new Blob([html]).size;
  const formattedSize = sizeInBytes < 1024 
    ? `${sizeInBytes} B` 
    : `${(sizeInBytes / 1024).toFixed(1)} KB`;

  // Reload iframe preview
  const refreshPreview = () => {
    setIframeKey(prev => prev + 1);
  };

  // Open in new tab
  const openInNewTab = () => {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 15000);
  };

  // Copy HTML
  const copyHtmlCode = () => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download HTML file
  const downloadHtmlFile = () => {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeTitle = (docTitle || 'dokumen')
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, '-')
      .replace(/^-|-$/g, '') || 'dokumen';
    a.download = `${safeTitle}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Format HTML
  const handleFormat = () => {
    const formatted = formatHtml(html);
    setHtml(formatted);
  };

  // Minify HTML
  const handleMinify = () => {
    const minified = minifyHtml(html);
    setHtml(minified);
  };

  // Clear code
  const handleClear = () => {
    if (window.confirm('Bersihkan isi editor HTML?')) {
      setHtml('');
      setFileName(null);
    }
  };

  // Handle Preset Selection
  const handleSelectPreset = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const preset = PRESET_TEMPLATES.find(p => p.id === e.target.value);
    if (preset) {
      setHtml(preset.html);
      setFileName(null);
      setIframeKey(prev => prev + 1);
    }
  };

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    loadLocalFile(file);
    e.target.value = '';
  };

  const loadLocalFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (typeof content === 'string') {
        setHtml(content);
        setFileName(file.name);
        setIframeKey(prev => prev + 1);
      }
    };
    reader.readAsText(file);
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      loadLocalFile(file);
    }
  };

  // Handle Tab key indentation inside textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      setHtml(newValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  // Device width settings
  const getDeviceStyle = () => {
    switch (deviceMode) {
      case 'mobile':
        return {
          width: '375px',
          height: '667px',
          maxHeight: '667px',
          borderRadius: '24px',
          boxShadow: '0 12px 36px rgba(0,0,0,0.25)',
          border: '10px solid #1e293b',
          margin: '0 auto',
        };
      case 'tablet':
        return {
          width: '768px',
          height: '680px',
          maxHeight: '680px',
          borderRadius: '18px',
          boxShadow: '0 12px 36px rgba(0,0,0,0.2)',
          border: '12px solid #1e293b',
          margin: '0 auto',
        };
      case 'desktop':
        return {
          width: '100%',
          maxWidth: '1200px',
          height: '680px',
          borderRadius: '12px',
          border: '1px solid var(--color-border)',
          margin: '0 auto',
        };
      default:
        return {
          width: '100%',
          height: '680px',
          borderRadius: '8px',
          border: 'none',
        };
    }
  };

  const getCanvasBackground = () => {
    if (canvasBg === 'dark') return '#0f172a';
    if (canvasBg === 'grid') {
      return `repeating-conic-gradient(#f1f5f9 0% 25%, #ffffff 0% 50%) 50% / 20px 20px`;
    }
    return '#f8fafc';
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1440px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--cat-txt-light)',
          color: 'var(--cat-txt-dark)',
          border: '1px solid var(--cat-txt-border)',
          padding: '4px 14px',
          borderRadius: 'var(--radius-full)',
          fontSize: '13px',
          fontWeight: 600,
          marginBottom: '12px',
        }}>
          <FileCode size={16} />
          <span>Alat Olah Teks & Kode Web</span>
        </div>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 800, 
          marginBottom: '8px', 
          fontFamily: 'var(--font-heading)', 
          color: 'var(--color-text-primary)' 
        }}>
          HTML Reader & Live Preview
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px', maxWidth: '680px', margin: '0 auto' }}>
          Buka, edit, dan pratinjau tampilan kode atau file HTML secara instan dengan emulasi perangkat responsive dan eksekusi aman di peramban.
        </p>
      </div>

      {/* Main Control Strip */}
      <div className="glass-card" style={{
        padding: '12px 18px',
        marginBottom: '16px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        background: 'var(--color-bg-surface)'
      }}>
        {/* Left: Templates & Upload */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Preset Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} color="var(--brand-primary)" />
            <select
              onChange={handleSelectPreset}
              defaultValue="modern-card"
              style={{
                padding: '7px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-input-bg)',
                color: 'var(--color-text-primary)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option disabled>── Pilih Contoh Template ──</option>
              {PRESET_TEMPLATES.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Upload Button */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".html,.htm,text/html" 
            style={{ display: 'none' }} 
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-secondary"
            style={{ padding: '7px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
            title="Buka file .html dari komputer"
          >
            <Upload size={14} />
            <span>Unggah .html</span>
          </button>

          {fileName && (
            <span style={{
              fontSize: '12px',
              padding: '4px 10px',
              background: 'var(--cat-pdf-light)',
              color: 'var(--cat-pdf-dark)',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 500,
              maxWidth: '180px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              📄 {fileName}
            </span>
          )}
        </div>

        {/* Center: View Mode (Split, Code, Preview) */}
        <div style={{
          display: 'inline-flex',
          background: 'var(--color-bg-base)',
          padding: '3px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)'
        }}>
          <button
            onClick={() => setViewMode('split')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: viewMode === 'split' ? 'var(--brand-primary)' : 'transparent',
              color: viewMode === 'split' ? '#fff' : 'var(--color-text-secondary)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Layers size={14} />
            <span>Split View</span>
          </button>
          <button
            onClick={() => setViewMode('code')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: viewMode === 'code' ? 'var(--brand-primary)' : 'transparent',
              color: viewMode === 'code' ? '#fff' : 'var(--color-text-secondary)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Code size={14} />
            <span>Hanya Kode</span>
          </button>
          <button
            onClick={() => setViewMode('preview')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: viewMode === 'preview' ? 'var(--brand-primary)' : 'transparent',
              color: viewMode === 'preview' ? '#fff' : 'var(--color-text-secondary)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Eye size={14} />
            <span>Hanya Render</span>
          </button>
        </div>

        {/* Right: Device Viewport Emulation */}
        {viewMode !== 'code' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Layar:</span>
            <div style={{
              display: 'inline-flex',
              background: 'var(--color-bg-base)',
              padding: '3px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)'
            }}>
              <button
                onClick={() => setDeviceMode('fluid')}
                title="Responsif Penuh"
                style={{
                  padding: '5px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: deviceMode === 'fluid' ? 'var(--brand-primary)' : 'transparent',
                  color: deviceMode === 'fluid' ? '#fff' : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Maximize2 size={14} />
              </button>
              <button
                onClick={() => setDeviceMode('desktop')}
                title="Desktop (1200px)"
                style={{
                  padding: '5px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: deviceMode === 'desktop' ? 'var(--brand-primary)' : 'transparent',
                  color: deviceMode === 'desktop' ? '#fff' : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Monitor size={14} />
              </button>
              <button
                onClick={() => setDeviceMode('tablet')}
                title="Tablet iPad (768px)"
                style={{
                  padding: '5px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: deviceMode === 'tablet' ? 'var(--brand-primary)' : 'transparent',
                  color: deviceMode === 'tablet' ? '#fff' : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Tablet size={14} />
              </button>
              <button
                onClick={() => setDeviceMode('mobile')}
                title="Ponsel Mobile (375px)"
                style={{
                  padding: '5px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: deviceMode === 'mobile' ? 'var(--brand-primary)' : 'transparent',
                  color: deviceMode === 'mobile' ? '#fff' : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Smartphone size={14} />
              </button>
            </div>

            {/* Background Canvas Mode */}
            <div style={{
              display: 'inline-flex',
              background: 'var(--color-bg-base)',
              padding: '3px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)'
            }}>
              <button
                onClick={() => setCanvasBg('light')}
                title="Background Terang"
                style={{
                  padding: '5px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: canvasBg === 'light' ? 'var(--brand-primary)' : 'transparent',
                  color: canvasBg === 'light' ? '#fff' : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Sun size={14} />
              </button>
              <button
                onClick={() => setCanvasBg('dark')}
                title="Background Gelap"
                style={{
                  padding: '5px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: canvasBg === 'dark' ? 'var(--brand-primary)' : 'transparent',
                  color: canvasBg === 'dark' ? '#fff' : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Moon size={14} />
              </button>
              <button
                onClick={() => setCanvasBg('grid')}
                title="Background Motif Grid Transparan"
                style={{
                  padding: '5px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: canvasBg === 'grid' ? 'var(--brand-primary)' : 'transparent',
                  color: canvasBg === 'grid' ? '#fff' : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Grid size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Editor & Preview Panes Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: viewMode === 'split' ? '1fr 1fr' : '1fr',
        gap: '16px',
        alignItems: 'start',
      }}>
        {/* PANE 1: HTML EDITOR */}
        {(viewMode === 'split' || viewMode === 'code') && (
          <div 
            className="glass-card" 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--color-bg-card)',
              position: 'relative',
              borderColor: isDragging ? 'var(--brand-primary)' : undefined,
            }}
          >
            {/* Drag Overlay feedback */}
            {isDragging && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                backdropFilter: 'blur(2px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 20,
                borderRadius: 'var(--radius-lg)',
                border: '2px dashed var(--brand-primary)',
                color: 'var(--brand-dark)',
                fontWeight: 700,
                gap: '8px'
              }}>
                <Upload size={32} />
                <span>Lepaskan file .html untuk langsung dibaca</span>
              </div>
            )}

            {/* Editor Pane Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-secondary)' }}>
                  Kode Sumber HTML
                </span>
                <span style={{
                  fontSize: '11px',
                  background: 'var(--color-bg-base)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--color-text-muted)',
                  border: '1px solid var(--color-border)',
                }}>
                  {lineCount} baris
                </span>
              </div>

              {/* Editor Actions Toolbar */}
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={handleFormat}
                  className="btn-secondary"
                  style={{ padding: '5px 10px', fontSize: '11px' }}
                  title="Format Indentasi Kode HTML"
                >
                  Rapikan
                </button>
                <button
                  onClick={handleMinify}
                  className="btn-secondary"
                  style={{ padding: '5px 10px', fontSize: '11px' }}
                  title="Hapus komentar dan spasi berlebih"
                >
                  Minify
                </button>
                <button
                  onClick={copyHtmlCode}
                  className="btn-secondary"
                  style={{ padding: '5px 10px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  title="Salin seluruh kode ke clipboard"
                >
                  {copied ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                  <span>{copied ? 'Tersalin' : 'Salin'}</span>
                </button>
                <button
                  onClick={downloadHtmlFile}
                  className="btn-secondary"
                  style={{ padding: '5px 10px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  title="Unduh file .html"
                >
                  <Download size={12} />
                  <span>Unduh</span>
                </button>
                <button
                  onClick={handleClear}
                  className="btn-secondary"
                  style={{ padding: '5px 8px', fontSize: '11px', color: '#EF4444' }}
                  title="Bersihkan editor"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>

            {/* Code Textarea */}
            <textarea
              ref={textareaRef}
              rows={28}
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ketik atau tempel kode HTML di sini (atau seret & lepaskan file .html)..."
              style={{
                width: '100%',
                height: '680px',
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-input-bg)',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                lineHeight: 1.6,
                outline: 'none',
                resize: 'none',
                whiteSpace: 'pre',
                overflowWrap: 'normal',
                overflowX: 'auto',
              }}
              spellCheck={false}
            />
          </div>
        )}

        {/* PANE 2: LIVE HTML PREVIEW */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <div 
            className="glass-card" 
            style={{
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--color-bg-card)',
            }}
          >
            {/* Preview Pane Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ 
                  fontSize: '13px', 
                  fontWeight: 700, 
                  color: 'var(--brand-dark)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px' 
                }}>
                  <Eye size={15} />
                  <span>Pratinjau Tampilan (Live Render)</span>
                </span>
                <span style={{
                  fontSize: '11px',
                  background: 'var(--cat-gen-light)',
                  color: 'var(--cat-gen-dark)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 600,
                  border: '1px solid var(--cat-gen-border)',
                }}>
                  {deviceMode === 'mobile' && '375 × 667 (Mobile)'}
                  {deviceMode === 'tablet' && '768 × 1024 (Tablet)'}
                  {deviceMode === 'desktop' && '1200px (Desktop)'}
                  {deviceMode === 'fluid' && '100% Fluid'}
                </span>
              </div>

              {/* Preview Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Script Execution Toggle */}
                <label 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '5px', 
                    fontSize: '11px', 
                    color: 'var(--color-text-secondary)',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                  title="Izinkan atau matikan eksekusi JavaScript di sandbox"
                >
                  <input
                    type="checkbox"
                    checked={allowScripts}
                    onChange={(e) => {
                      setAllowScripts(e.target.checked);
                      setIframeKey(prev => prev + 1);
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                  <span>Script JS</span>
                </label>

                {/* Refresh Iframe */}
                <button
                  onClick={refreshPreview}
                  className="btn-secondary"
                  style={{ padding: '5px 8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  title="Muat Ulang Tampilan Pratinjau"
                >
                  <RefreshCw size={12} />
                  <span>Refresh</span>
                </button>

                {/* Open in New Window */}
                <button
                  onClick={openInNewTab}
                  className="btn-primary"
                  style={{ padding: '5px 10px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  title="Buka pratinjau penuh di tab baru browser"
                >
                  <ExternalLink size={12} />
                  <span>Tab Baru</span>
                </button>
              </div>
            </div>

            {/* Preview Frame Wrapper */}
            <div style={{
              background: getCanvasBackground(),
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              padding: deviceMode === 'mobile' || deviceMode === 'tablet' ? '20px' : '0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              height: '680px',
              position: 'relative',
              transition: 'all 0.3s ease',
            }}>
              <iframe
                key={iframeKey}
                title="Pratinjau HTML"
                srcDoc={html}
                sandbox={allowScripts ? 'allow-scripts allow-modals allow-same-origin' : 'allow-same-origin'}
                style={{
                  ...getDeviceStyle(),
                  background: '#ffffff',
                  display: 'block',
                  transition: 'all 0.25s ease',
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Live Statistics & Metadata Footer */}
      <div className="glass-card" style={{
        marginTop: '16px',
        padding: '12px 20px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        fontSize: '13px',
        color: 'var(--color-text-secondary)',
        background: 'var(--color-bg-surface)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div>
            <strong>Judul Dokumen:</strong> <span style={{ color: 'var(--color-text-primary)' }}>{docTitle}</span>
          </div>
          <div>
            <strong>Ukuran File:</strong> <span style={{ color: 'var(--color-text-primary)' }}>{formattedSize}</span>
          </div>
          <div>
            <strong>Karakter:</strong> <span style={{ color: 'var(--color-text-primary)' }}>{totalChars.toLocaleString()}</span>
          </div>
          <div>
            <strong>Kata:</strong> <span style={{ color: 'var(--color-text-primary)' }}>{totalWords.toLocaleString()}</span>
          </div>
          <div>
            <strong>Tag HTML:</strong> <span style={{ color: 'var(--color-text-primary)' }}>{totalTags}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#10B981' }}>
          <Shield size={14} />
          <span>Diproses 100% di browser Anda (Aman & Pribadi)</span>
        </div>
      </div>
    </div>
  );
};
export default HtmlViewerTool;
