# 🛠️ TECHSTACK.md — AllAround Web App
> **Final Tech Stack Decision**  
> Versi: 1.0.0 | Tanggal: 2026-10-09  

---

## 🔑 Keputusan Utama: Vite + React (bukan Next.js)

> **Kenapa bukan Next.js?**  
> AllAround adalah **100% client-side app** — semua pemrosesan terjadi di browser, tidak ada data yang dikirim ke server. Next.js membawa overhead SSR/RSC yang tidak kita butuhkan. Hasilnya bundle lebih berat, HMR lebih lambat, dan kompleksitas "use client" yang tidak perlu.

---

## 1. Framework & Build Tool

| Keputusan | Teknologi | Versi |
|-----------|-----------|-------|
| ✅ **DIPILIH** | **Vite** + **React** | Vite 6.x + React 19 |
| ❌ Tidak dipilih | Next.js | — |

### Mengapa Vite + React?

| Aspek | Vite + React | Next.js |
|-------|-------------|---------|
| Bundle size baseline | ~40KB (React only) | ~120KB+ (framework overhead) |
| Dev startup | Instan (native ESM) | 2–5 detik |
| Mental model | 1 environment (browser) | Split server/client |
| Hosting | Static files → CDN/GitHub Pages/Vercel | Perlu Node.js runtime |
| Kompleksitas | Rendah | Sedang–Tinggi |
| Cocok untuk tool app | ✅ Sempurna | ⚠️ Overkill |

```bash
# Inisialisasi project
npm create vite@latest . -- --template react-ts
```

---

## 2. Routing

| Keputusan | Teknologi | Versi |
|-----------|-----------|-------|
| ✅ **DIPILIH** | **React Router v7** | 7.x |

```bash
npm install react-router
```

**Kenapa React Router v7?**
- File-based routing yang ringan
- Tidak perlu server → cocok untuk static deploy
- API terbaru sudah stabil dan dokumentasi lengkap
- Bundle: ~12KB gzip

**Struktur Route:**
```
/                        → Dashboard
/pdf/compressor          → PDF Compressor
/pdf/merge               → Merge PDF
/pdf/to-word             → PDF to Word
/image/compressor        → Image Compressor
/image/resizer           → Image Resizer
/image/bg-changer        → Background Changer
/text/word-counter       → Word Counter
/text/case-converter     → Case Converter
/converter/unit          → Unit Converter
/converter/color         → Color Converter
/generator/qr-code       → QR Code Generator
/generator/password      → Password Generator
/utility/pomodoro        → Pomodoro Timer
/dev/url-encoder         → URL Encoder
```

---

## 3. Styling

| Keputusan | Teknologi | Versi |
|-----------|-----------|-------|
| ✅ **DIPILIH** | **Vanilla CSS** (CSS Variables + CSS Modules) | — |

**Kenapa Vanilla CSS?**
- **Zero bundle cost** — tidak ada JS untuk parsing utilities
- CSS Variables sudah defined di DESIGN.md → langsung pakai
- CSS Modules → scoping otomatis per komponen, no class conflicts
- Tidak ada build-time transform overhead (tidak seperti Tailwind yang perlu purge)
- Lebih mudah untuk tema pastel custom

**Struktur CSS:**
```
src/styles/
├── globals.css       ← CSS Variables (design tokens dari DESIGN.md)
├── animations.css    ← Keyframe animations
├── reset.css         ← CSS Reset modern
└── components/       ← CSS Modules per komponen
    ├── Sidebar.module.css
    ├── ToolCard.module.css
    ├── Button.module.css
    └── ...
```

> **Catatan:** Jika tim lebih nyaman dengan utility classes, bisa tambahkan **UnoCSS** (bukan Tailwind) — lebih ringan 3–5x dari Tailwind karena on-demand generation.

---

## 4. PDF Processing Libraries

Karena setiap library punya spesialisasi berbeda, kita gunakan **kombinasi dua library**:

| Library | Fungsi | Bundle Size | Wajib? |
|---------|--------|-------------|--------|
| **pdf-lib** | Merge, Split, Compress, Rotate, Lock PDF | ~300KB | ✅ Ya |
| **pdfjs-dist** | Render PDF → preview di browser, PDF to Image | ~1.5MB (lazy load) | ✅ Ya |

```bash
npm install pdf-lib
npm install pdfjs-dist
```

**Strategi Loading:**
```ts
// pdf-lib → load saat user buka tool PDF
const pdfLib = await import('pdf-lib')

// pdfjs-dist → lazy load HANYA saat render/preview dibutuhkan
const pdfjsLib = await import('pdfjs-dist')
```

**Mapping Tool → Library:**
| Tool | Library |
|------|---------|
| PDF Compressor | pdf-lib |
| Merge PDF | pdf-lib |
| Split PDF | pdf-lib |
| PDF Rotator | pdf-lib |
| PDF Locker | pdf-lib |
| PDF to Image | pdfjs-dist |
| PDF Preview | pdfjs-dist |
| PDF to Word | pdfjs-dist (text extract) + konversi manual |

---

## 5. Image Processing Libraries

| Library | Fungsi | Bundle Size | Wajib? |
|---------|--------|-------------|--------|
| **browser-image-compression** | Kompres JPG/PNG/WebP | ~35KB | ✅ Ya |
| **Canvas API** (built-in browser) | Resize, flip, rotate, convert format, crop | 0KB | ✅ Ya (native) |
| **@img-lib/remove-bg** (via API) | Hapus background (server API) | ~5KB | ⚠️ Phase 2 |

```bash
npm install browser-image-compression
```

**Mapping Tool → Library:**
| Tool | Teknologi |
|------|-----------|
| Image Compressor | browser-image-compression |
| Image Resizer | Canvas API |
| Image Converter (format) | Canvas API → toDataURL() |
| Image Cropper | Canvas API + mouse events |
| Image Flipper/Rotator | Canvas API transform |
| Background Changer | remove.bg API (free tier 50/bulan) |

---

## 6. Dokumen Conversion

| Library | Fungsi | Bundle Size |
|---------|--------|-------------|
| **mammoth** | DOCX → HTML/teks (Word to PDF preview) | ~150KB |
| **docx** | Generate file .docx dari teks | ~200KB |
| **FileSaver.js** | Download file hasil | ~8KB |

```bash
npm install mammoth docx file-saver
npm install --save-dev @types/file-saver
```

---

## 7. Generator Libraries

| Library | Fungsi | Bundle Size |
|---------|--------|-------------|
| **qrcode** | Generate QR Code (canvas/SVG) | ~40KB |
| **jsbarcode** | Generate Barcode | ~55KB |
| **nanoid** | Generate UUID/random ID | ~1KB |
| **crypto** (built-in browser) | Password & Hash generation | 0KB (native) |

```bash
npm install qrcode jsbarcode nanoid
npm install --save-dev @types/qrcode
```

---

## 8. State Management

| Keputusan | Teknologi | Versi |
|-----------|-----------|-------|
| ✅ **DIPILIH** | **Zustand** | 5.x |

```bash
npm install zustand
```

**Kenapa Zustand?**
- Bundle size: hanya **~2KB gzip** (vs Redux ~40KB, Jotai ~3KB)
- API sangat sederhana, tidak perlu Provider/Context boilerplate
- Mendukung persistence ke localStorage out-of-the-box

**Store yang dibutuhkan:**
```ts
// stores/settingsStore.ts → dark mode, bahasa, preferensi
// stores/userStore.ts     → favorites[], recentTools[]
```

---

## 9. Animasi & Motion

| Keputusan | Teknologi |
|-----------|-----------|
| ✅ **DIPILIH** | **CSS Animations** (native) + **View Transitions API** |
| ❌ Tidak dipilih | Framer Motion |

**Kenapa bukan Framer Motion?**
- Framer Motion menambah ~80KB ke bundle
- Untuk animasi pastel yang halus, CSS keyframes + transitions sudah cukup
- View Transitions API (browser native) untuk page transitions

**Kapan pakai JS animation:**
- Loading spinner kompleks → gunakan `@keyframes` CSS
- Counter animasi (misal: progress number) → `requestAnimationFrame` native

---

## 10. Icons

| Keputusan | Teknologi | Versi |
|-----------|-----------|-------|
| ✅ **DIPILIH** | **Lucide React** | Latest |

```bash
npm install lucide-react
```

- Bundle: hanya import icon yang dipakai (tree-shakeable)
- 1 icon ≈ ~0.5KB
- 1500+ icon tersedia
- Stroke style → cocok dengan estetik pastel clean

---

## 11. Fonts

Gunakan **Google Fonts** via `<link>` di HTML (tidak perlu package):

```html
<!-- index.html -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Inter:wght@400;500&family=JetBrains+Mono&display=swap" rel="stylesheet">
```

| Font | Usage | Weights |
|------|-------|---------|
| **Outfit** | Heading, branding, sidebar | 400, 500, 600, 700 |
| **Inter** | Body text, labels, forms | 400, 500 |
| **JetBrains Mono** | Code output, hash, URL | 400 |

---

## 12. Utilities Lainnya

| Library | Fungsi | Size |
|---------|--------|------|
| **date-fns** | Kalkulasi tanggal (Age Calculator, Pomodoro) | ~15KB (tree-shakeable) |
| **marked** | Parse Markdown → HTML (Markdown Previewer) | ~23KB |
| **DOMPurify** | Sanitasi HTML output (keamanan XSS) | ~22KB |

```bash
npm install date-fns marked dompurify
npm install --save-dev @types/dompurify
```

---

## 13. Development Tools

| Tool | Fungsi |
|------|--------|
| **TypeScript** | Type safety |
| **ESLint** + `@typescript-eslint` | Linting |
| **Prettier** | Code formatting |
| **Vite** built-in HMR | Hot reload instan |

```bash
# Sudah include di template react-ts Vite
npm install --save-dev eslint @typescript-eslint/eslint-plugin prettier eslint-config-prettier
```

---

## 14. Hosting & Deployment

| Opsi | Keuntungan | Cocok untuk |
|------|-----------|-------------|
| ✅ **Vercel** | Free, CI/CD otomatis dari GitHub, CDN global | Production |
| **Netlify** | Alternatif Vercel, sama baiknya | Production |
| **GitHub Pages** | Gratis permanent, cocok untuk project tugas | Development/Portfolio |
| **Cloudflare Pages** | CDN tercepat, free | Production |

**Rekomendasi: Vercel** (free tier, deploy cukup `git push`)

---

## 15. Final Dependency Tree

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router": "^7.0.0",
    "zustand": "^5.0.0",
    "lucide-react": "latest",
    "pdf-lib": "^1.17.1",
    "pdfjs-dist": "^4.x",
    "browser-image-compression": "^2.0.2",
    "mammoth": "^1.8.0",
    "docx": "^9.x",
    "file-saver": "^2.0.5",
    "qrcode": "^1.5.4",
    "jsbarcode": "^3.11.6",
    "nanoid": "^5.0.0",
    "date-fns": "^4.x",
    "marked": "^14.x",
    "dompurify": "^3.x"
  },
  "devDependencies": {
    "vite": "^6.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.x",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@types/file-saver": "^2.0.7",
    "@types/qrcode": "^1.5.5",
    "@types/dompurify": "^3.x",
    "eslint": "^9.x",
    "@typescript-eslint/eslint-plugin": "^8.x",
    "prettier": "^3.x",
    "eslint-config-prettier": "^9.x"
  }
}
```

---

## 16. Estimasi Bundle Size (Production)

| Chunk | Library | Ukuran (gzip) |
|-------|---------|---------------|
| React + React DOM | Core | ~42KB |
| React Router | Routing | ~12KB |
| Zustand | State | ~2KB |
| Lucide React | Icons (partial) | ~10KB |
| date-fns | Utilities | ~15KB |
| App code | Components + Pages | ~50–80KB |
| **Total Initial Load** | | **~131–161KB** |
| pdf-lib | Lazy (PDF tools) | ~300KB |
| pdfjs-dist | Lazy (PDF preview) | ~1.5MB |
| mammoth + docx | Lazy (Doc tools) | ~350KB |
| browser-image-compression | Lazy (Image tools) | ~35KB |
| qrcode + jsbarcode | Lazy (Generator) | ~95KB |

> ✅ Strategi **lazy loading** memastikan initial load tetap ringan.  
> Library berat hanya dimuat saat pengguna membuka tool yang membutuhkannya.

---

## 17. Perintah Setup Cepat (All-in-One)

```bash
# 1. Buat project
npm create vite@latest . -- --template react-ts

# 2. Install semua dependencies sekaligus
npm install react-router zustand lucide-react pdf-lib pdfjs-dist browser-image-compression mammoth docx file-saver qrcode jsbarcode nanoid date-fns marked dompurify

# 3. Install dev dependencies
npm install --save-dev @types/file-saver @types/qrcode @types/dompurify prettier eslint-config-prettier

# 4. Jalankan dev server
npm run dev
```

---

*Tech stack ini dirancang untuk: **ringan saat load pertama**, **performant saat digunakan**, dan **mudah di-maintain** jangka panjang.*
