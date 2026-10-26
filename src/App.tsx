import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { Dashboard } from './components/Dashboard';

// All 18 Interactive Tools
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

export const App: React.FC = () => {
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

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
        return <Dashboard onSelectTool={(id) => setActiveToolId(id)} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar 
        activeToolId={activeToolId}
        onSelectTool={(id) => setActiveToolId(id)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      <div className="main-wrapper">
        <Topbar 
          activeToolId={activeToolId}
          onSelectTool={(id) => setActiveToolId(id)}
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
