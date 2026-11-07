import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { Dashboard } from './components/Dashboard';
import { TOOLS } from './data/tools';

// All 24 Interactive Tools
import { PdfCompressorTool } from './components/tools/PdfCompressorTool';
import { PdfMergeTool } from './components/tools/PdfMergeTool';
import { PdfToTextTool } from './components/tools/PdfToTextTool';
import { ImageToPdfTool } from './components/tools/ImageToPdfTool';
import { BgChangerTool } from './components/tools/BgChangerTool';
import { ImageCompressorTool } from './components/tools/ImageCompressorTool';
import { ImageResizerTool } from './components/tools/ImageResizerTool';
import { ImageConverterTool } from './components/tools/ImageConverterTool';
import { WordCounterTool } from './components/tools/WordCounterTool';
import { CaseConverterTool } from './components/tools/CaseConverterTool';
import { LoremGeneratorTool } from './components/tools/LoremGeneratorTool';
import { DuplicateRemoverTool } from './components/tools/DuplicateRemoverTool';
import { UnitConverterTool } from './components/tools/UnitConverterTool';
import { ColorConverterTool } from './components/tools/ColorConverterTool';
import { BinaryCalculatorTool } from './components/tools/BinaryCalculatorTool';
import { QrGeneratorTool } from './components/tools/QrGeneratorTool';
import { PasswordGeneratorTool } from './components/tools/PasswordGeneratorTool';
import { UuidGeneratorTool } from './components/tools/UuidGeneratorTool';
import { PomodoroTimerTool } from './components/tools/PomodoroTimerTool';
import { JfifConverterTool } from './components/tools/JfifConverterTool';
import { ExifRemoverTool } from './components/tools/ExifRemoverTool';
import { TextDiffTool } from './components/tools/TextDiffTool';
import { MarkdownEditorTool } from './components/tools/MarkdownEditorTool';
import { HtmlViewerTool } from './components/tools/HtmlViewerTool';

const DEFAULT_TITLE = 'Allaround — Alat Produktivitas Cepat, Aman dan Estetik';

const getToolIdFromUrl = (): string | null => {
  if (typeof window === 'undefined') return null;

  // 1. Check pathname (e.g. /pdf-compressor or /pdf-compressor/)
  const path = window.location.pathname.replace(/^\/|\/$/g, '').trim();
  if (path) {
    return path;
  }

  // 2. Fallback check hash (e.g. #/pdf-compressor or #pdf-compressor)
  if (window.location.hash) {
    const hash = window.location.hash.replace(/^#\/?/, '').trim();
    if (hash) {
      return hash;
    }
  }

  return null;
};

export const App: React.FC = () => {
  const [activeToolId, setActiveToolId] = useState<string | null>(getToolIdFromUrl);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Synchronize document.title with active tool
  const updatePageTitle = useCallback((toolId: string | null) => {
    if (toolId) {
      const tool = TOOLS.find(t => t.id === toolId);
      document.title = tool ? `${tool.name} — Allaround` : `Halaman Tidak Ditemukan (404) — Allaround`;
    } else {
      document.title = DEFAULT_TITLE;
    }
  }, []);

  // Handle URL change when user selects a tool
  const handleSelectTool = useCallback((toolId: string | null) => {
    setActiveToolId(toolId);
    updatePageTitle(toolId);

    const targetPath = toolId ? `/${toolId}` : '/';
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ toolId }, '', targetPath);
    }
  }, [updatePageTitle]);

  // Listen to popstate (browser Back and Forward buttons)
  useEffect(() => {
    const onPopState = (e: PopStateEvent) => {
      const toolIdFromState = e.state?.toolId ?? getToolIdFromUrl();
      setActiveToolId(toolIdFromState);
      updatePageTitle(toolIdFromState);
    };

    window.addEventListener('popstate', onPopState);

    // Initial title update on mount
    const initialToolId = getToolIdFromUrl();
    updatePageTitle(initialToolId);

    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, [updatePageTitle]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const renderActiveTool = () => {
    switch (activeToolId) {
      // PDF Tools
      case 'pdf-compressor':
        return <PdfCompressorTool />;
      case 'pdf-merge':
        return <PdfMergeTool />;
      case 'pdf-to-text':
        return <PdfToTextTool />;
      case 'image-to-pdf':
        return <ImageToPdfTool />;

      // Image Tools
      case 'image-bg-changer':
        return <BgChangerTool />;
      case 'image-compressor':
        return <ImageCompressorTool />;
      case 'image-resizer':
        return <ImageResizerTool />;
      case 'image-converter':
        return <ImageConverterTool />;
      case 'jfif-converter':
        return <JfifConverterTool />;
      case 'exif-remover':
        return <ExifRemoverTool />;

      // Text Tools
      case 'word-counter':
        return <WordCounterTool />;
      case 'case-converter':
        return <CaseConverterTool />;
      case 'text-diff':
        return <TextDiffTool />;
      case 'markdown-editor':
        return <MarkdownEditorTool />;
      case 'html-viewer':
        return <HtmlViewerTool />;
      case 'lorem-generator':
        return <LoremGeneratorTool />;
      case 'duplicate-remover':
        return <DuplicateRemoverTool />;

      // Converter Tools
      case 'unit-converter':
        return <UnitConverterTool />;
      case 'color-converter':
        return <ColorConverterTool />;
      case 'binary-calculator':
        return <BinaryCalculatorTool />;

      // Generator Tools
      case 'qr-generator':
        return <QrGeneratorTool />;
      case 'password-generator':
        return <PasswordGeneratorTool />;
      case 'uuid-generator':
        return <UuidGeneratorTool />;

      // Utility Tools
      case 'pomodoro-timer':
        return <PomodoroTimerTool />;

      default:
        // Render 404 page if unknown tool route is accessed
        if (activeToolId && !TOOLS.some(t => t.id === activeToolId)) {
          return (
            <div className="animate-fade-in" style={{ textAlign: 'center', padding: '60px 20px', maxWidth: '520px', margin: '0 auto' }}>
              <div style={{ fontSize: '72px', fontWeight: 900, color: 'var(--brand-primary)', marginBottom: '8px', lineHeight: 1 }}>
                404
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px', color: 'var(--color-text-primary)' }}>
                Alat Tidak Ditemukan
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px', fontSize: '15px', lineHeight: 1.6 }}>
                Alat dengan ID <code>"{activeToolId}"</code> tidak tersedia atau telah dipindahkan.
              </p>
              <button
                onClick={() => handleSelectTool(null)}
                className="btn-primary"
                style={{ padding: '12px 28px', margin: '0 auto', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                Kembali ke Beranda
              </button>
            </div>
          );
        }
        return <Dashboard onSelectTool={handleSelectTool} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar 
        activeToolId={activeToolId}
        onSelectTool={handleSelectTool}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      <div className="main-wrapper">
        <Topbar 
          activeToolId={activeToolId}
          onSelectTool={handleSelectTool}
          isDark={isDark}
          onToggleTheme={() => setIsDark(prev => !prev)}
          onOpenMobile={() => setIsMobileOpen(true)}
        />

        <main className="content-area">
          {renderActiveTool()}
        </main>
      </div>
    </div>
  );
};

export default App;
