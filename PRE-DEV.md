# ⚙️ PRE-DEV.md — Persiapan Sebelum Development
> **AllAround Web App — Pre-Development Checklist**  
> Tanggal: 2026-10-09  

---

## 1. Prerequisites — Pastikan Sudah Terinstall

### 1.1 Software Wajib

```bash
# Cek versi yang dibutuhkan
node --version     # >= 20.x LTS
npm --version      # >= 10.x
git --version      # >= 2.40

# Jika belum ada:
# Node.js: https://nodejs.org (gunakan versi LTS)
# Git:     https://git-scm.com
```

### 1.2 Tools Opsional tapi Direkomendasikan

| Tool | Fungsi | Link |
|------|--------|------|
| **VS Code** | Editor utama | https://code.visualstudio.com |
| **pnpm** | Package manager lebih cepat dari npm | `npm i -g pnpm` |
| **Vercel CLI** | Deploy langsung dari terminal | `npm i -g vercel` |

### 1.3 VS Code Extensions Wajib

```
- ESLint
- Prettier - Code formatter
- Tailwind CSS IntelliSense
- PostCSS Language Support
- Auto Rename Tag
- Path Intellisense
- GitLens
```

---

## 2. Inisialisasi Project

### 2.1 Buat Project Next.js

```bash
# Di terminal, pergi ke folder project
cd "d:\2026 - Tugas Akhir dan Proyek Aktif\Allaround"

# Buat project Next.js baru
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-git

# Atau dengan pnpm (lebih cepat):
pnpm create next-app . \
  --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

### 2.2 Struktur Folder yang Direkomendasikan

```
allaround/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx              # Root layout (sidebar + topbar)
│   │   ├── page.tsx                # Dashboard/beranda
│   │   ├── (tools)/                # Route group untuk tools
│   │   │   ├── pdf/
│   │   │   │   ├── compressor/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── to-word/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── merge/
│   │   │   │       └── page.tsx
│   │   │   ├── image/
│   │   │   │   ├── compressor/
│   │   │   │   ├── resizer/
│   │   │   │   ├── converter/
│   │   │   │   ├── bg-changer/
│   │   │   │   └── cropper/
│   │   │   ├── text/
│   │   │   │   ├── word-counter/
│   │   │   │   ├── case-converter/
│   │   │   │   └── lorem-ipsum/
│   │   │   ├── converter/
│   │   │   │   ├── unit/
│   │   │   │   └── color/
│   │   │   ├── generator/
│   │   │   │   ├── qr-code/
│   │   │   │   ├── password/
│   │   │   │   └── uuid/
│   │   │   ├── utility/
│   │   │   │   ├── pomodoro/
│   │   │   │   ├── age-calculator/
│   │   │   │   └── bmi/
│   │   │   └── dev/
│   │   │       └── url-encoder/
│   │   └── settings/
│   │       └── page.tsx
│   │
│   ├── components/                 # Komponen UI
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx         # Sidebar navigasi
│   │   │   ├── Topbar.tsx          # Header atas
│   │   │   └── PageWrapper.tsx     # Wrapper tiap halaman
│   │   ├── ui/                     # Komponen UI primitif
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── ToolCard.tsx        # Card di dashboard
│   │   │   ├── UploadZone.tsx      # Drag & drop upload
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── Modal.tsx
│   │   └── tools/                  # Komponen spesifik tool
│   │       ├── pdf/
│   │       ├── image/
│   │       └── ...
│   │
│   ├── lib/                        # Utility & logic
│   │   ├── tools/                  # Logic tiap tool
│   │   │   ├── pdf-compressor.ts
│   │   │   ├── image-compressor.ts
│   │   │   └── ...
│   │   ├── utils.ts                # Helper functions
│   │   ├── constants.ts            # Konstanta (tools list, categories)
│   │   └── hooks/                  # Custom hooks
│   │       ├── useFileUpload.ts
│   │       ├── useFavorites.ts
│   │       └── useRecentTools.ts
│   │
│   ├── store/                      # State management (Zustand)
│   │   ├── settingsStore.ts        # Dark mode, preferences
│   │   └── toolStore.ts            # State tool aktif
│   │
│   ├── styles/
│   │   └── globals.css             # CSS variables + global styles
│   │
│   └── types/                      # TypeScript types
│       ├── tools.ts
│       └── index.ts
│
├── public/
│   ├── icons/                      # Favicon, app icons
│   └── og/                         # Open Graph images
│
├── .env.local                      # Environment variables
├── .eslintrc.json
├── .prettierrc
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── PRD.md
├── DESIGN.md
└── PRE-DEV.md
```

---

## 3. Instalasi Packages

### 3.1 Packages Utama

```bash
# UI & Styling
npm install lucide-react framer-motion clsx

# PDF Processing
npm install pdf-lib pdfjs-dist @pdf-lib/fontkit

# Word/DOCX
npm install mammoth docx

# Image Processing
npm install browser-image-compression

# File Download
npm install file-saver
npm install --save-dev @types/file-saver

# QR Code
npm install qrcode
npm install --save-dev @types/qrcode

# State Management
npm install zustand

# Utilities
npm install date-fns nanoid

# Google Fonts (via next/font)
# — sudah built-in di Next.js, tidak perlu install terpisah
```

### 3.2 Packages Dev

```bash
npm install --save-dev \
  prettier \
  eslint-config-prettier \
  @types/node
```

### 3.3 Konfigurasi Tailwind untuk Custom Colors

Edit `tailwind.config.ts`:
```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Sidebar & backgrounds
        'bg-base':    '#FAFAFA',
        'bg-surface': '#FFFFFF',
        'bg-sidebar': '#F7F5FF',
        'border-default': '#EDE9F8',
        // Text
        'text-primary':   '#2D2640',
        'text-secondary': '#6B6580',
        'text-muted':     '#A89FC0',
        // Category colors
        pdf:  { primary: '#FFB3C6', light: '#FFF0F5', dark: '#C2185B' },
        img:  { primary: '#C5B3FF', light: '#F3EFFF', dark: '#5E35B1' },
        txt:  { primary: '#A8E6CF', light: '#EDFDF6', dark: '#2E7D32' },
        cvt:  { primary: '#A8D8EA', light: '#EEF8FD', dark: '#0277BD' },
        gen:  { primary: '#FFCBA4', light: '#FFF5EE', dark: '#E65100' },
        utl:  { primary: '#FFEAA7', light: '#FFFDE7', dark: '#F57F17' },
        dev:  { primary: '#B5EAD7', light: '#EDFAF4', dark: '#1B5E20' },
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'xl':  '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      boxShadow: {
        'card':       '0 2px 12px rgba(45, 38, 64, 0.06)',
        'card-hover': '0 8px 32px rgba(45, 38, 64, 0.12)',
        'sidebar':    '4px 0 20px rgba(197, 179, 255, 0.08)',
      },
      animation: {
        'fade-in':    'fadeIn 0.3s ease',
        'slide-up':   'slideUp 0.3s ease',
        'slide-in-r': 'slideInRight 0.3s ease',
        'scale-in':   'scaleIn 0.25s ease',
      },
      keyframes: {
        fadeIn:      { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:     { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideInRight: { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(0)' } },
        scaleIn:     { from: { opacity: '0', transform: 'scale(0.95)' }, to: { opacity: '1', transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
}
export default config
```

---

## 4. Konfigurasi File Penting

### 4.1 `.env.local`

```env
NEXT_PUBLIC_APP_NAME=AllAround
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 4.2 `next.config.js`

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Untuk penggunaan pdf.js worker
  },
  webpack: (config) => {
    // Konfigurasi untuk pdf.js
    config.resolve.alias.canvas = false;
    return config;
  },
}
module.exports = nextConfig
```

### 4.3 `.prettierrc`

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

---

## 5. Setup Git & Repository

```bash
# Inisialisasi git
git init

# Buat .gitignore
cat > .gitignore << EOF
# Dependencies
node_modules/
.pnp
.pnp.js

# Next.js
.next/
out/

# Production
build/

# Misc
.DS_Store
*.pem
.env*.local

# Debug
npm-debug.log*
EOF

# Commit pertama
git add .
git commit -m "feat: initial project setup - AllAround web app"

# Hubungkan ke GitHub (ganti dengan repo kamu)
git remote add origin https://github.com/username/allaround.git
git push -u origin main
```

---

## 6. Urutan Development

Ikuti urutan ini agar tidak ada ketergantungan yang hilang:

```
Phase 0 — Foundation
  [1] Setup project & install packages
  [2] Buat CSS variables (globals.css) — design tokens
  [3] Konfigurasi Tailwind
  [4] Setup Zustand stores

Phase 1 — Layout & Shell
  [5] Buat komponen Sidebar (dengan semua tool terdaftar)
  [6] Buat komponen Topbar (dengan search)
  [7] Buat PageWrapper / root layout
  [8] Buat Dashboard/beranda (grid tool cards)

Phase 2 — Tool Cards & Navigation
  [9]  Buat data tools (constants.ts) — list semua tool + kategori
  [10] Buat komponen ToolCard
  [11] Setup routing untuk semua tool pages (shell kosong dulu)
  [12] Implementasi search functionality

Phase 3 — Tools MVP (satu per satu)
  [13] Word Counter (termudah — pure JS)
  [14] Case Converter
  [15] Lorem Ipsum Generator
  [16] Password Generator
  [17] UUID Generator
  [18] QR Code Generator
  [19] Unit Converter
  [20] Color Converter
  [21] URL Encoder/Decoder
  [22] Age Calculator
  [23] BMI Calculator
  [24] Pomodoro Timer
  [25] Image Compressor
  [26] Image Resizer
  [27] Image Converter
  [28] Image Cropper & Flipper
  [29] Background Changer
  [30] PDF Compressor
  [31] Merge PDF
  [32] PDF to Word
  [33] Image to PDF

Phase 4 — Polish
  [34] Dark mode
  [35] Favorit (localStorage)
  [36] Riwayat tools
  [37] Animasi Framer Motion
  [38] Toast notifications
  [39] Responsiveness (mobile/tablet)
  [40] SEO meta tags tiap halaman
```

---

## 7. Checklist Sebelum Mulai Code

- [ ] Node.js v20+ terinstall
- [ ] Git terinstall dan dikonfigurasi (`git config --global user.name` & `user.email`)
- [ ] VS Code + extensions terpasang
- [ ] Project Next.js berhasil di-init (`npm run dev` berjalan di localhost:3000)
- [ ] Semua packages terinstall tanpa error
- [ ] Baca ulang PRD.md dan DESIGN.md
- [ ] Folder struktur sesuai spesifikasi di atas
- [ ] `.env.local` sudah dibuat
- [ ] Git repository sudah diinisialisasi
- [ ] Buat GitHub repository dan push initial commit

---

## 8. Perintah Development Sehari-hari

```bash
# Jalankan dev server
npm run dev
# → Buka http://localhost:3000

# Build production (untuk test)
npm run build
npm run start

# Linting
npm run lint

# Format code
npx prettier --write .

# Deploy ke Vercel
vercel deploy
```

---

*Setelah semua checklist di atas selesai, kamu siap memulai development!*
