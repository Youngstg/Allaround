# 🎨 DESIGN.md — AllAround Web App
> **Design System & UI Guidelines**  
> Versi: 1.0.0 | Tanggal: 2026-10-09  

---

## 1. Design Philosophy

| Prinsip | Penjelasan |
|---------|-----------|
| **Soft & Welcoming** | Warna pastel yang lembut membuat pengguna merasa nyaman dan tidak overwhelmed |
| **Clean & Focused** | Setiap halaman tool fokus pada satu fungsi — tanpa gangguan |
| **Delightful** | Micro-animasi halus menambah kesan premium tanpa mengganggu workflow |
| **Accessible** | Kontras warna memenuhi WCAG AA, keyboard navigable |
| **Consistent** | Komponen yang digunakan konsisten di seluruh aplikasi |

---

## 2. Color System (Pastel Palette)

### 2.1 Primary Colors per Kategori

Setiap kategori tool memiliki warna pastel tersendiri untuk identitas visual yang kuat.

| Kategori | Primary Color | Hex | Light (bg) | Dark (text/icon) |
|----------|--------------|-----|------------|-----------------|
| **PDF Tools** | Blush Pink | `#FFB3C6` | `#FFF0F5` | `#C2185B` |
| **Image Tools** | Lavender | `#C5B3FF` | `#F3EFFF` | `#5E35B1` |
| **Text Tools** | Mint Green | `#A8E6CF` | `#EDFDF6` | `#2E7D32` |
| **Converter** | Baby Blue | `#A8D8EA` | `#EEF8FD` | `#0277BD` |
| **Generator** | Peach | `#FFCBA4` | `#FFF5EE` | `#E65100` |
| **Utilities** | Sunshine Yellow | `#FFEAA7` | `#FFFDE7` | `#F57F17` |
| **Dev Tools** | Sage Green | `#B5EAD7` | `#EDFAF4` | `#1B5E20` |

### 2.2 Neutral Colors

```css
--color-bg-base:        #FAFAFA;   /* Background utama halaman */
--color-bg-surface:     #FFFFFF;   /* Background card/panel */
--color-bg-sidebar:     #F7F5FF;   /* Background sidebar (lavender sangat tipis) */
--color-border:         #EDE9F8;   /* Border card dan separator */
--color-border-hover:   #C5B3FF;   /* Border saat hover */

--color-text-primary:   #2D2640;   /* Teks utama — ungu gelap */
--color-text-secondary: #6B6580;   /* Teks sekunder — abu ungu */
--color-text-muted:     #A89FC0;   /* Teks muted/placeholder */

--color-white:          #FFFFFF;
--color-black:          #1A1625;
```

### 2.3 Semantic Colors

```css
--color-success:  #A8E6CF;  /* Hijau pastel — success state */
--color-warning:  #FFEAA7;  /* Kuning pastel — warning state */
--color-error:    #FFB3C6;  /* Pink pastel — error state */
--color-info:     #A8D8EA;  /* Biru pastel — info state */
```

### 2.4 Dark Mode Colors

```css
/* Dark Mode */
--dark-bg-base:        #1A1625;
--dark-bg-surface:     #241D35;
--dark-bg-sidebar:     #1E1830;
--dark-bg-card:        #2D2445;
--dark-border:         #3D3160;
--dark-text-primary:   #F0ECFF;
--dark-text-secondary: #B8B0D8;
--dark-text-muted:     #7B6FA0;
```

---

## 3. Typography

### 3.1 Font Stack

```css
/* Heading Font */
font-family: 'Outfit', sans-serif;
/* Weights: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold) */

/* Body Font */
font-family: 'Inter', sans-serif;
/* Weights: 400 (Regular), 500 (Medium) */

/* Code/Mono Font */
font-family: 'JetBrains Mono', 'Fira Code', monospace;
```

### 3.2 Type Scale

| Token | Font | Size | Weight | Line Height | Usage |
|-------|------|------|--------|-------------|-------|
| `display-xl` | Outfit | 48px | 700 | 1.2 | Hero heading |
| `display-lg` | Outfit | 36px | 700 | 1.2 | Page title |
| `heading-xl` | Outfit | 28px | 600 | 1.3 | Section heading |
| `heading-lg` | Outfit | 22px | 600 | 1.35 | Card heading |
| `heading-md` | Outfit | 18px | 600 | 1.4 | Sub-heading |
| `heading-sm` | Outfit | 16px | 600 | 1.4 | Label heading |
| `body-lg` | Inter | 16px | 400 | 1.6 | Body text utama |
| `body-md` | Inter | 14px | 400 | 1.6 | Body teks sekunder |
| `body-sm` | Inter | 12px | 400 | 1.5 | Caption/helper text |
| `label` | Inter | 13px | 500 | 1.4 | Form label |
| `code` | JetBrains Mono | 14px | 400 | 1.5 | Kode/output teks |

---

## 4. Spacing & Grid System

### 4.1 Spacing Scale

```css
--space-1:   4px
--space-2:   8px
--space-3:   12px
--space-4:   16px
--space-5:   20px
--space-6:   24px
--space-8:   32px
--space-10:  40px
--space-12:  48px
--space-16:  64px
--space-20:  80px
```

### 4.2 Layout Grid

```
┌──────────────────────────────────────────────────────┐
│  Sidebar (260px)  │  Main Content Area (flex: 1)     │
│                   │                                  │
│  [Logo]           │  [Topbar: Search + Actions]      │
│                   │  ──────────────────────────────  │
│  [Nav Category]   │                                  │
│    > Tool 1       │     [Content Area]               │
│    > Tool 2       │     Padding: 32px                │
│                   │                                  │
│  [Nav Category]   │                                  │
│  ...              │                                  │
└──────────────────────────────────────────────────────┘
```

### 4.3 Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 640px | Single column, sidebar jadi bottom sheet |
| Tablet | 640px–1024px | Sidebar collapsed (icon only, 72px) |
| Desktop | 1024px–1440px | Sidebar full (260px) |
| Wide | > 1440px | Sidebar full, konten max-width 1280px |

---

## 5. Component Library

### 5.1 Sidebar

```
Width: 260px (desktop) / 72px (tablet) / drawer (mobile)
Background: var(--color-bg-sidebar) = #F7F5FF
Border-right: 1px solid var(--color-border)
Box-shadow: 4px 0 20px rgba(197, 179, 255, 0.08)

[Logo Area]
  Height: 72px
  Padding: 0 20px
  Logo font: Outfit Bold 22px, color: #2D2640

[Nav Item]
  Height: 44px
  Padding: 0 16px
  Border-radius: 12px
  Margin: 2px 8px
  
  States:
    Default:  bg transparent, text #6B6580
    Hover:    bg #EDE9F8, text #2D2640
    Active:   bg linear-gradient(135deg, kategori-color 0%, kategori-light 100%)
              text: kategori-dark, font-weight: 600

[Category Header]
  Font: Outfit 11px UPPERCASE 600
  Color: var(--color-text-muted)
  Padding: 16px 20px 4px
  Letter-spacing: 0.08em

[Sub-item (tool)]
  Height: 36px
  Padding: 0 16px 0 44px
  Border-radius: 8px
  Font: Inter 13px 400
```

### 5.2 Tool Card (Dashboard Grid)

```
Layout: CSS Grid, 3 kolom desktop / 2 tablet / 1 mobile
Gap: 20px

[Card]
  Background: #FFFFFF
  Border: 1px solid var(--color-border)
  Border-radius: 20px
  Padding: 24px
  Box-shadow: 0 2px 12px rgba(45, 38, 64, 0.04)
  Transition: all 0.25s ease

  Hover:
    Border-color: kategori-primary
    Box-shadow: 0 8px 32px rgba(kategori-primary, 0.15)
    Transform: translateY(-4px)

[Card Icon Area]
  Width: 52px, Height: 52px
  Border-radius: 14px
  Background: kategori-light-color
  Display: flex center
  Icon: 24px, color: kategori-dark

[Card Title]
  Font: Outfit 16px 600
  Color: #2D2640
  Margin-top: 16px

[Card Description]
  Font: Inter 13px
  Color: #6B6580
  Margin-top: 6px
  Line-height: 1.5

[Card Badge]
  Background: kategori-light-color
  Color: kategori-dark
  Border-radius: 100px
  Padding: 2px 10px
  Font: Inter 11px 500

[Card CTA]
  Margin-top: 20px
  Button: "Buka Tool →"
```

### 5.3 Buttons

```css
/* Primary Button */
.btn-primary {
  background: linear-gradient(135deg, #C5B3FF, #A8B4FF);
  color: #2D2640;
  border-radius: 12px;
  padding: 10px 24px;
  font: 500 14px 'Inter';
  border: none;
  box-shadow: 0 4px 16px rgba(197, 179, 255, 0.4);
  transition: all 0.2s ease;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(197, 179, 255, 0.5);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  border: 1.5px solid var(--color-border);
  color: var(--color-text-secondary);
  border-radius: 12px;
  padding: 10px 24px;
}

/* Danger Button */
.btn-danger {
  background: linear-gradient(135deg, #FFB3C6, #FFAAB8);
  color: #C2185B;
}

/* Icon Button */
.btn-icon {
  width: 40px; height: 40px;
  border-radius: 10px;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
}
```

### 5.4 Upload Zone (Drag & Drop)

```
Border: 2px dashed var(--color-border)
Border-radius: 20px
Background: var(--color-bg-base)
Padding: 48px 32px
Text-align: center
Transition: all 0.2s ease

Drag-over state:
  Border-color: kategori-primary
  Background: kategori-light-color
  
Icon: Upload cloud icon, 48px, kategori-dark color
Title: "Drag & drop file di sini" — Outfit 16px 500
Subtitle: "atau klik untuk browse" — Inter 13px, muted
Supported formats badge
Max file size indicator
```

### 5.5 Progress Bar

```
Height: 8px
Border-radius: 100px
Background: var(--color-border)

Fill:
  Background: linear-gradient(90deg, kategori-primary, kategori-secondary)
  Border-radius: 100px
  Transition: width 0.3s ease

Label: "Memproses... 67%" — Inter 13px, di atas progress bar
```

### 5.6 Toast / Notification

```
Position: fixed bottom-right, 24px margin
Border-radius: 16px
Padding: 16px 20px
Box-shadow: 0 8px 32px rgba(0,0,0,0.12)
Min-width: 280px

Success: bg #EDFDF6, border-left 4px solid #A8E6CF, icon ✓ hijau
Error:   bg #FFF0F5, border-left 4px solid #FFB3C6, icon ✗ merah
Warning: bg #FFFDE7, border-left 4px solid #FFEAA7, icon ⚠ kuning
Info:    bg #EEF8FD, border-left 4px solid #A8D8EA, icon ℹ biru
```

---

## 6. Iconography

| Library | Lucide React |
|---------|-------------|
| Icon size default | 20px |
| Icon size large | 24px |
| Icon size small | 16px |
| Stroke width | 1.75px |

### Mapping Icon per Kategori

| Kategori | Icon |
|----------|------|
| Dashboard | `LayoutDashboard` |
| PDF Tools | `FileText` |
| Image Tools | `Image` |
| Text Tools | `Type` |
| Converter | `ArrowLeftRight` |
| Generator | `Wand2` |
| Utilities | `Wrench` |
| Dev Tools | `Code2` |
| Settings | `Settings2` |
| Favorit | `Heart` |
| Riwayat | `Clock` |

---

## 7. Animasi & Motion

### 7.1 Prinsip Animasi

- **Purposeful**: Setiap animasi punya tujuan (feedback, fokus, transisi)
- **Subtle**: Tidak berlebihan, tidak mengganggu
- **Fast**: Durasi pendek (150ms–350ms)
- **Eased**: Gunakan easing alami, bukan linear

### 7.2 Token Animasi

```css
--ease-out:    cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* Spring/bounce kecil */

--duration-fast:   150ms;
--duration-base:   250ms;
--duration-slow:   350ms;
```

### 7.3 Daftar Animasi

| Element | Animasi | Durasi |
|---------|---------|--------|
| Sidebar nav item hover | bg fade + icon scale(1.1) | 150ms |
| Card hover | translateY(-4px) + shadow | 250ms |
| Page transition | fade + slideUp (8px → 0) | 300ms |
| Toast masuk | slideInRight | 300ms |
| Toast keluar | fadeOut + slideRight | 250ms |
| Progress bar | width ease | 300ms |
| Modal buka | scaleIn (0.95 → 1) + fade | 250ms |
| Dropdown | slideDown + fade | 200ms |
| Sidebar collapse | width transition | 300ms |
| Upload zone drag | border pulse + bg flash | 150ms |
| Button click | scale(0.97) | 100ms |

---

## 8. Layout Detail — Tool Page

```
┌─────────────────────────────────────────────────────┐
│ Breadcrumb: Dashboard > PDF Tools > PDF Compressor  │
│                                                     │
│ [Icon 48px]  PDF Compressor                         │
│              Kompres file PDF tanpa kehilangan...   │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │                                             │   │
│  │          DROP ZONE / UPLOAD AREA            │   │
│  │                                             │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  [Compression Level]: Low | Medium | High           │
│                                                     │
│  [⚡ Kompres Sekarang]                              │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  HASIL                                              │
│  ┌──────────────────┐  ┌──────────────────┐        │
│  │  Preview Before  │  │  Preview After   │        │
│  │  Size: 4.2 MB    │  │  Size: 1.1 MB   │        │
│  └──────────────────┘  └──────────────────┘        │
│                                                     │
│  Pengurangan: 73.8%  [⬇ Download Hasil]            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 9. Topbar Design

```
Height: 72px
Background: rgba(255, 255, 255, 0.85)
Backdrop-filter: blur(12px)
Border-bottom: 1px solid var(--color-border)
Position: sticky top
Z-index: 100

Content (left → right):
  [Hamburger — mobile only] [Page Title]  ...  
  [Search Bar: 320px wide] [Dark Mode Toggle] [Favorit] [?]

[Search Bar]
  Background: var(--color-bg-base)
  Border: 1px solid var(--color-border)
  Border-radius: 12px
  Padding: 10px 16px
  Placeholder: "Cari tool... (Ctrl+K)"
  Icon: Search 16px di kiri
```

---

## 10. Dashboard (Beranda) Layout

```
Section 1: Hero/Greeting
  "Selamat datang di AllAround 👋"
  "Pilih tool yang kamu butuhkan hari ini"

Section 2: Pencarian Cepat (jika ada query)

Section 3: Tools Favorit (jika ada)
  Grid 4 kolom → card mini

Section 4: Terakhir Digunakan (dari riwayat)
  Horizontal scroll → card mini

Section 5: Semua Tools — per Kategori
  Heading kategori + warna identitas
  Grid 3 kolom → tool card lengkap
```

---

## 11. Aksesibilitas

| Aspek | Implementasi |
|-------|-------------|
| Focus ring | 2px outline offset, warna lavender `#C5B3FF` |
| Color contrast | Semua teks ≥ 4.5:1 terhadap background |
| Screen reader | Aria-label, aria-describedby, role attributes |
| Keyboard nav | Tab order logis, Escape menutup modal/dropdown |
| Skip link | "Skip to main content" tersembunyi, muncul saat Tab pertama |
| Reduced motion | `@media (prefers-reduced-motion)` menonaktifkan animasi |

---

## 12. Contoh Tema Pastel — CSS Variables Lengkap

```css
:root {
  /* === BACKGROUNDS === */
  --bg-base:      #FAFAFA;
  --bg-surface:   #FFFFFF;
  --bg-sidebar:   #F7F5FF;
  --bg-overlay:   rgba(45, 38, 64, 0.5);

  /* === BORDERS === */
  --border:       #EDE9F8;
  --border-focus: #C5B3FF;

  /* === TEXT === */
  --text-primary:   #2D2640;
  --text-secondary: #6B6580;
  --text-muted:     #A89FC0;
  --text-inverse:   #FFFFFF;

  /* === BRAND COLORS === */
  --brand-primary:  #C5B3FF;
  --brand-gradient: linear-gradient(135deg, #C5B3FF 0%, #A8B4FF 100%);

  /* === CATEGORY COLORS === */
  --pdf-primary:   #FFB3C6; --pdf-light:   #FFF0F5; --pdf-dark:   #C2185B;
  --img-primary:   #C5B3FF; --img-light:   #F3EFFF; --img-dark:   #5E35B1;
  --txt-primary:   #A8E6CF; --txt-light:   #EDFDF6; --txt-dark:   #2E7D32;
  --cvt-primary:   #A8D8EA; --cvt-light:   #EEF8FD; --cvt-dark:   #0277BD;
  --gen-primary:   #FFCBA4; --gen-light:   #FFF5EE; --gen-dark:   #E65100;
  --utl-primary:   #FFEAA7; --utl-light:   #FFFDE7; --utl-dark:   #F57F17;
  --dev-primary:   #B5EAD7; --dev-light:   #EDFAF4; --dev-dark:   #1B5E20;

  /* === SHADOWS === */
  --shadow-sm:  0 1px 4px rgba(45, 38, 64, 0.06);
  --shadow-md:  0 4px 16px rgba(45, 38, 64, 0.08);
  --shadow-lg:  0 8px 32px rgba(45, 38, 64, 0.10);
  --shadow-xl:  0 16px 64px rgba(45, 38, 64, 0.12);

  /* === BORDER RADIUS === */
  --radius-sm:   8px;
  --radius-md:   12px;
  --radius-lg:   16px;
  --radius-xl:   20px;
  --radius-2xl:  24px;
  --radius-pill: 100px;
}
```

---

*Design system ini akan terus berkembang. Selalu refer ke file ini untuk konsistensi visual.*
