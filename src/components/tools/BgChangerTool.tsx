import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  UploadCloud, Wand2, Download, RefreshCw, Pipette, 
  MousePointerClick, Globe, Sparkles, Check, Undo2, 
  ShieldCheck, RotateCcw, Camera
} from 'lucide-react';
import { 
  parseTargetColor, rgbToHex, detectCornerColor, 
  processBackgroundRemoval, RGB, RemovalMode 
} from '../../utils/tools-logic';

const PASTEL_PRESETS = [
  { name: 'Transparan (PNG)', hex: 'transparent' },
  { name: 'Baby Sky Blue', hex: '#EFF6FF' },
  { name: 'Glacier Blue', hex: '#E0F2FE' },
  { name: 'Powder Blue', hex: '#BAE6FD' },
  { name: 'Ice Teal', hex: '#ECFDF5' },
  { name: 'Soft Denim', hex: '#DBEAFE' },
  { name: 'Periwinkle Ice', hex: '#EEF2FF' },
  { name: 'Putih Bersih', hex: '#FFFFFF' },
  { name: 'Hitam Pekat', hex: '#0F172A' },
];

type TargetMode = 'white' | 'corner' | 'black' | 'eyedropper' | 'custom';

export const BgChangerTool: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  
  // Target color to remove / make transparent (default pure white #FFFFFF)
  const [targetMode, setTargetMode] = useState<TargetMode>('white');
  const [targetColorRgb, setTargetColorRgb] = useState<RGB>({ r: 255, g: 255, b: 255 });
  const [targetColorHex, setTargetColorHex] = useState<string>('#FFFFFF');
  
  // Scope of removal: 'photoboothFrames' isolates strictly the top 3 photo boxes using morphology!
  const [removalMode, setRemovalMode] = useState<RemovalMode>('photoboothFrames');
  const [targetFrameCount, setTargetFrameCount] = useState<number>(3);
  const [clickPoints, setClickPoints] = useState<Array<{ x: number; y: number }>>([]);

  // Replacement background color (default transparent)
  const [selectedBg, setSelectedBg] = useState<string>('transparent');
  const [customBgHex, setCustomBgHex] = useState<string>('#EFF6FF');

  // Sliders
  const [tolerance, setTolerance] = useState<number>(28);
  const [feather, setFeather] = useState<number>(6);

  // Processing state & preview URL
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Canvas refs
  const originalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const rawImageRef = useRef<HTMLImageElement | null>(null);

  // Load image onto internal canvas
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        rawImageRef.current = img;
        setImageDimensions({ width: img.width, height: img.height });
        setImageSrc(url);
        setProcessedUrl(null);
        setClickPoints([]);
      };
      img.src = url;
    }
  };

  // Draw original image on canvas when image loads or changes
  const redrawOriginalCanvas = useCallback((pointsToDraw: Array<{ x: number; y: number }>) => {
    if (!rawImageRef.current || !originalCanvasRef.current) return;
    const canvas = originalCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = rawImageRef.current;
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    // Draw click points markers if in floodFill mode
    if (removalMode === 'floodFill' && pointsToDraw.length > 0) {
      pointsToDraw.forEach((pt, idx) => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 16, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#3B82F6';
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        ctx.font = 'bold 12px sans-serif';
        ctx.fillStyle = '#1E3A8A';
        ctx.fillText(`${idx + 1}`, pt.x + 18, pt.y + 4);
      });
    }
  }, [removalMode]);

  // Main processing pipeline
  const triggerProcess = useCallback((params: {
    targetRgb: RGB;
    tol: number;
    fth: number;
    bg: string;
    mode: RemovalMode;
    frameCount: number;
    points: Array<{ x: number; y: number }>;
  }) => {
    if (!rawImageRef.current) return;
    setIsProcessing(true);

    const img = rawImageRef.current;
    const offscreen = document.createElement('canvas');
    offscreen.width = img.width;
    offscreen.height = img.height;
    const ctx = offscreen.getContext('2d');
    if (!ctx) {
      setIsProcessing(false);
      return;
    }

    ctx.drawImage(img, 0, 0);
    const imgData = ctx.getImageData(0, 0, offscreen.width, offscreen.height);

    // Replacement color config
    const replacement = parseTargetColor(params.bg === 'custom' ? customBgHex : params.bg);

    // Execute background removal pure algorithm
    processBackgroundRemoval(imgData.data, offscreen.width, offscreen.height, {
      targetColor: params.targetRgb,
      tolerance: params.tol,
      feather: params.fth,
      replacementColor: replacement,
      mode: params.mode,
      targetFrameCount: params.frameCount,
      clickPoints: params.points,
    });

    ctx.putImageData(imgData, 0, 0);

    // Export to Data URL (PNG for transparent, JPEG if solid)
    const isTrans = params.bg === 'transparent';
    const resultUrl = offscreen.toDataURL(isTrans ? 'image/png' : 'image/jpeg', 0.95);
    setProcessedUrl(resultUrl);
    setIsProcessing(false);
  }, [customBgHex]);

  // Initial trigger when imageSrc changes
  useEffect(() => {
    if (!imageSrc) return;
    redrawOriginalCanvas(clickPoints);
    triggerProcess({
      targetRgb: targetColorRgb,
      tol: tolerance,
      fth: feather,
      bg: selectedBg,
      mode: removalMode,
      frameCount: targetFrameCount,
      points: clickPoints,
    });
  }, [imageSrc]);

  // Preset selection handler for Target Color
  const handleTargetPreset = (mode: TargetMode) => {
    setTargetMode(mode);
    if (!originalCanvasRef.current) return;
    const canvas = originalCanvasRef.current;
    const ctx = canvas.getContext('2d');

    let newRgb: RGB = { r: 255, g: 255, b: 255 };
    let newHex = '#FFFFFF';

    if (mode === 'white') {
      newRgb = { r: 255, g: 255, b: 255 };
      newHex = '#FFFFFF';
    } else if (mode === 'black') {
      newRgb = { r: 0, g: 0, b: 0 };
      newHex = '#000000';
    } else if (mode === 'corner' && ctx) {
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      newRgb = detectCornerColor(data, canvas.width, canvas.height);
      newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    }

    setTargetColorRgb(newRgb);
    setTargetColorHex(newHex);

    triggerProcess({
      targetRgb: newRgb,
      tol: tolerance,
      fth: feather,
      bg: selectedBg,
      mode: removalMode,
      frameCount: targetFrameCount,
      points: clickPoints,
    });
  };

  // Custom color input handler
  const handleCustomTargetColor = (hex: string) => {
    setTargetMode('custom');
    setTargetColorHex(hex);
    const parsed = parseTargetColor(hex);
    const rgb = { r: parsed.r, g: parsed.g, b: parsed.b };
    setTargetColorRgb(rgb);

    triggerProcess({
      targetRgb: rgb,
      tol: tolerance,
      fth: feather,
      bg: selectedBg,
      mode: removalMode,
      frameCount: targetFrameCount,
      points: clickPoints,
    });
  };

  // Canvas click: handles eyedropper and multi-click cutout
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = originalCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const sampledRgb: RGB = { r: pixel[0], g: pixel[1], b: pixel[2] };
    const sampledHex = rgbToHex(pixel[0], pixel[1], pixel[2]);

    let newPoints = clickPoints;
    if (removalMode === 'floodFill') {
      newPoints = [...clickPoints, { x, y }];
      setClickPoints(newPoints);
      redrawOriginalCanvas(newPoints);
    }

    setTargetMode('eyedropper');
    setTargetColorRgb(sampledRgb);
    setTargetColorHex(sampledHex);

    triggerProcess({
      targetRgb: sampledRgb,
      tol: tolerance,
      fth: feather,
      bg: selectedBg,
      mode: removalMode,
      frameCount: targetFrameCount,
      points: newPoints,
    });
  };

  const handleResetPoints = () => {
    setClickPoints([]);
    redrawOriginalCanvas([]);
    triggerProcess({
      targetRgb: targetColorRgb,
      tol: tolerance,
      fth: feather,
      bg: selectedBg,
      mode: removalMode,
      frameCount: targetFrameCount,
      points: [],
    });
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '980px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--cat-img-light)',
          color: 'var(--cat-img-dark)',
          padding: '4px 12px',
          borderRadius: '100px',
          fontSize: '12px',
          fontWeight: 700,
          marginBottom: '10px',
          border: '1px solid var(--cat-img-border)',
        }}>
          <Sparkles size={14} />
          <span>Algoritma Ekstraksi Bingkai Photobooth</span>
        </div>
        <h1 style={{ 
          fontSize: 'clamp(24px, 3.5vw, 32px)', 
          fontWeight: 800, 
          marginBottom: '8px', 
          fontFamily: 'var(--font-heading)', 
          color: 'var(--color-text-primary)' 
        }}>
          Photobooth Frame Cutout & BG Changer
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', maxWidth: '680px', margin: '0 auto' }}>
          Algoritma morfologi pintar yang memutus jembatan warna stiker secara otomatis. <strong>Hanya tepat 3 kotak foto yang dilubangi</strong>, sementara garis grid retro dan stiker terlindungi 100%.
        </p>
      </div>

      {!imageSrc ? (
        /* Upload Area */
        <div style={{
          border: '2px dashed var(--cat-img-primary)',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--cat-img-light)',
          padding: '48px 24px',
          textAlign: 'center',
          position: 'relative',
          cursor: 'pointer',
          transition: 'all var(--transition-normal)',
        }}>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleImageUpload}
            style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
            aria-label="Upload Foto"
          />
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <UploadCloud size={32} color="var(--cat-img-dark)" />
          </div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            Tarik Foto / Template ke Sini atau Klik untuk Memilih
          </div>
          <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            Mendukung file PNG, JPG, JPEG, dan WebP
          </div>
        </div>
      ) : (
        /* Main Controls & Canvas Workspace */
        <div className="glass-card" style={{ padding: '24px', background: 'var(--color-bg-card)' }}>
          
          {/* STEP 1: Target Color Selection */}
          <div style={{ marginBottom: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                1. Warna Kotak yang Ingin Dilubangi (Dibuat Transparan):
              </label>

              {/* Active Color Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 10px',
                background: 'var(--color-bg-base)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                fontSize: '12px',
                fontWeight: 600,
              }}>
                <span style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '4px',
                  background: targetColorHex,
                  border: '1px solid #94A3B8',
                  display: 'inline-block',
                }} />
                <span>Target: {targetColorHex}</span>
                {targetMode === 'white' && <span style={{ color: 'var(--color-text-muted)' }}>(Putih Bersih)</span>}
                {targetMode === 'eyedropper' && <span style={{ color: 'var(--cat-img-dark)' }}>(Dari Foto)</span>}
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleTargetPreset('white')}
                style={{
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: targetMode === 'white' ? '2px solid var(--cat-img-dark)' : '1px solid var(--color-border)',
                  background: targetMode === 'white' ? 'var(--cat-img-light)' : 'var(--color-bg-surface)',
                  color: targetMode === 'white' ? 'var(--cat-img-dark)' : 'var(--color-text-primary)',
                  fontSize: '12px',
                  fontWeight: targetMode === 'white' ? 700 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FFFFFF', border: '1px solid #CBD5E1' }} />
                <span>Hapus Putih (#FFFFFF)</span>
              </button>

              <button
                type="button"
                onClick={() => handleTargetPreset('corner')}
                style={{
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: targetMode === 'corner' ? '2px solid var(--cat-img-dark)' : '1px solid var(--color-border)',
                  background: targetMode === 'corner' ? 'var(--cat-img-light)' : 'var(--color-bg-surface)',
                  color: targetMode === 'corner' ? 'var(--cat-img-dark)' : 'var(--color-text-primary)',
                  fontSize: '12px',
                  fontWeight: targetMode === 'corner' ? 700 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Wand2 size={13} />
                <span>Deteksi Sudut Gambar</span>
              </button>

              <button
                type="button"
                onClick={() => handleTargetPreset('black')}
                style={{
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: targetMode === 'black' ? '2px solid var(--cat-img-dark)' : '1px solid var(--color-border)',
                  background: targetMode === 'black' ? 'var(--cat-img-light)' : 'var(--color-bg-surface)',
                  color: targetMode === 'black' ? 'var(--cat-img-dark)' : 'var(--color-text-primary)',
                  fontSize: '12px',
                  fontWeight: targetMode === 'black' ? 700 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#000000', border: '1px solid #475569' }} />
                <span>Hapus Hitam (#000000)</span>
              </button>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                border: targetMode === 'custom' ? '2px solid var(--cat-img-dark)' : '1px solid var(--color-border)',
                background: 'var(--color-bg-surface)',
              }}>
                <label htmlFor="custom-target-color" style={{ fontSize: '12px', fontWeight: 500, cursor: 'pointer', color: 'var(--color-text-primary)' }}>
                  Pilih Hex:
                </label>
                <input 
                  id="custom-target-color"
                  type="color" 
                  value={targetColorHex}
                  onChange={(e) => handleCustomTargetColor(e.target.value)}
                  style={{
                    width: '24px',
                    height: '24px',
                    padding: 0,
                    border: 'none',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    background: 'transparent',
                  }}
                  title="Pilih warna kustom untuk dihapus"
                />
              </div>
            </div>
          </div>

          {/* STEP 2: Strict Algorithm Selection */}
          <div style={{ marginBottom: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                2. Algoritma Pemilihan Area:
              </label>
              {removalMode === 'photoboothFrames' && (
                <span style={{ 
                  fontSize: '11px', 
                  color: '#059669', 
                  background: '#ECFDF5', 
                  padding: '2px 8px', 
                  borderRadius: '100px', 
                  fontWeight: 600,
                  border: '1px solid #A7F3D0',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <ShieldCheck size={13} />
                  Hanya Tepat {targetFrameCount} Kotak Foto Dihapus
                </span>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
              
              {/* Option A: Strict Photobooth Frames (Default) */}
              <div 
                onClick={() => {
                  setRemovalMode('photoboothFrames');
                  redrawOriginalCanvas(clickPoints);
                  triggerProcess({
                    targetRgb: targetColorRgb,
                    tol: tolerance,
                    fth: feather,
                    bg: selectedBg,
                    mode: 'photoboothFrames',
                    frameCount: targetFrameCount,
                    points: clickPoints,
                  });
                }}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  border: removalMode === 'photoboothFrames' ? '2px solid #059669' : '1px solid var(--color-border)',
                  background: removalMode === 'photoboothFrames' ? '#F0FDF4' : 'var(--color-bg-surface)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <Camera size={20} color="#059669" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#065F46', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>Ekstraksi Kotak Foto (Morfologi)</span>
                    <span style={{ fontSize: '10px', background: '#D1FAE5', color: '#047857', padding: '1px 6px', borderRadius: '4px' }}>Tepat {targetFrameCount} Kotak</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#047857', marginTop: '3px', lineHeight: 1.4 }}>
                    Memutus jembatan warna stiker secara matematis. <strong>HANYA {targetFrameCount} KOTAK FOTO</strong> yang berlubang! Stiker dan garis grid dijamin 100% utuh.
                  </div>
                </div>
              </div>

              {/* Option B: Magic Wand (Multi-Click) */}
              <div 
                onClick={() => {
                  setRemovalMode('floodFill');
                  redrawOriginalCanvas(clickPoints);
                  triggerProcess({
                    targetRgb: targetColorRgb,
                    tol: tolerance,
                    fth: feather,
                    bg: selectedBg,
                    mode: 'floodFill',
                    frameCount: targetFrameCount,
                    points: clickPoints,
                  });
                }}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  border: removalMode === 'floodFill' ? '2px solid var(--brand-primary)' : '1px solid var(--color-border)',
                  background: removalMode === 'floodFill' ? 'var(--brand-light)' : 'var(--color-bg-surface)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <MousePointerClick size={20} color="var(--brand-primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    Klik Kotak Foto (Magic Wand)
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '3px', lineHeight: 1.4 }}>
                    Klik kotak 1, 2, 3 secara manual di kanvas Foto Asli untuk melubanginya satu per satu.
                  </div>
                </div>
              </div>

              {/* Option C: Global */}
              <div 
                onClick={() => {
                  setRemovalMode('global');
                  redrawOriginalCanvas(clickPoints);
                  triggerProcess({
                    targetRgb: targetColorRgb,
                    tol: tolerance,
                    fth: feather,
                    bg: selectedBg,
                    mode: 'global',
                    frameCount: targetFrameCount,
                    points: clickPoints,
                  });
                }}
                style={{
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  border: removalMode === 'global' ? '2px solid var(--color-border-hover)' : '1px solid var(--color-border)',
                  background: removalMode === 'global' ? 'var(--color-bg-base)' : 'var(--color-bg-surface)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <Globe size={20} color="var(--color-text-secondary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    Semua Warna Putih (Global)
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '3px', lineHeight: 1.4 }}>
                    Menghapus seluruh warna putih tanpa batasan area geometris.
                  </div>
                </div>
              </div>

            </div>

            {/* Sub-controls for Photobooth Frame Count */}
            {removalMode === 'photoboothFrames' && (
              <div style={{ 
                marginTop: '12px', 
                padding: '12px 14px', 
                background: 'var(--color-bg-base)', 
                borderRadius: 'var(--radius-sm)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  🎯 Jumlah Kotak Foto yang Dihapus:
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[1, 2, 3, 4, 6].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => {
                        setTargetFrameCount(count);
                        triggerProcess({
                          targetRgb: targetColorRgb,
                          tol: tolerance,
                          fth: feather,
                          bg: selectedBg,
                          mode: 'photoboothFrames',
                          frameCount: count,
                          points: clickPoints,
                        });
                      }}
                      style={{
                        padding: '4px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: targetFrameCount === count ? '2px solid #059669' : '1px solid var(--color-border)',
                        background: targetFrameCount === count ? '#ECFDF5' : 'var(--color-bg-surface)',
                        color: targetFrameCount === count ? '#065F46' : 'var(--color-text-secondary)',
                        fontSize: '12px',
                        fontWeight: targetFrameCount === count ? 700 : 500,
                        cursor: 'pointer',
                      }}
                    >
                      {count} Kotak {count === 3 && '(Strip)'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-controls for Magic Wand */}
            {removalMode === 'floodFill' && (
              <div style={{ 
                marginTop: '10px', 
                padding: '10px 14px', 
                background: 'var(--color-bg-base)', 
                borderRadius: 'var(--radius-sm)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                  🎯 <strong>{clickPoints.length} Kotak/Area Terpilih</strong> — Klik langsung pada kotak foto di pratinjau Foto Asli untuk melubanginya.
                </div>
                {clickPoints.length > 0 && (
                  <button
                    type="button"
                    onClick={handleResetPoints}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '4px 10px',
                      fontSize: '11px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    <RotateCcw size={12} />
                    <span>Reset Pilihan Kotak</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* STEP 3: Replacement Background Color */}
          <div style={{ marginBottom: '22px' }}>
            <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '8px', color: 'var(--color-text-primary)' }}>
              3. Ganti Background Menjadi:
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {PASTEL_PRESETS.map((preset) => {
                const isSelected = selectedBg === preset.hex;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setSelectedBg(preset.hex);
                      triggerProcess({
                        targetRgb: targetColorRgb,
                        tol: tolerance,
                        fth: feather,
                        bg: preset.hex,
                        mode: removalMode,
                        frameCount: targetFrameCount,
                        points: clickPoints,
                      });
                    }}
                    style={{
                      padding: '7px 12px',
                      borderRadius: 'var(--radius-full)',
                      border: isSelected ? '2px solid var(--cat-img-dark)' : '1px solid var(--color-border)',
                      background: preset.hex === 'transparent' ? 'var(--color-bg-surface)' : preset.hex,
                      color: '#0F172A',
                      fontSize: '12px',
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: preset.hex === 'transparent' 
                        ? 'repeating-conic-gradient(#cbd5e1 0% 25%, white 0% 50%) 50% / 6px 6px' 
                        : preset.hex,
                      border: '1px solid #CBD5E1',
                    }} />
                    <span>{preset.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 4: Tolerance & Edge Smoothing Sliders */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
            gap: '16px', 
            marginBottom: '24px',
            background: 'var(--color-bg-base)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px', color: 'var(--color-text-secondary)' }}>
                <span style={{ fontWeight: 600 }}>Toleransi Warna Putih:</span>
                <span style={{ fontWeight: 700, color: 'var(--cat-img-dark)' }}>{tolerance}%</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="75" 
                value={tolerance} 
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setTolerance(val);
                  triggerProcess({
                    targetRgb: targetColorRgb,
                    tol: val,
                    fth: feather,
                    bg: selectedBg,
                    mode: removalMode,
                    frameCount: targetFrameCount,
                    points: clickPoints,
                  });
                }}
                style={{ width: '100%', accentColor: 'var(--brand-primary)', cursor: 'pointer' }}
              />
              <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                Nilai 25-30% optimal untuk memisahkan kotak dan bingkai warna.
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px', color: 'var(--color-text-secondary)' }}>
                <span style={{ fontWeight: 600 }}>Kelembutan Pinggiran (Feather):</span>
                <span style={{ fontWeight: 700, color: 'var(--cat-img-dark)' }}>{feather}px</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="20" 
                value={feather} 
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setFeather(val);
                  triggerProcess({
                    targetRgb: targetColorRgb,
                    tol: tolerance,
                    fth: val,
                    bg: selectedBg,
                    mode: removalMode,
                    frameCount: targetFrameCount,
                    points: clickPoints,
                  });
                }}
                style={{ width: '100%', accentColor: 'var(--brand-primary)', cursor: 'pointer' }}
              />
              <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                Menghaluskan garis lengkung sudut 3 kotak foto.
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <button
              type="button"
              onClick={() => {
                triggerProcess({
                  targetRgb: targetColorRgb,
                  tol: tolerance,
                  fth: feather,
                  bg: selectedBg,
                  mode: removalMode,
                  frameCount: targetFrameCount,
                  points: clickPoints,
                });
              }}
              disabled={isProcessing}
              className="btn-primary"
              style={{ flex: 1, padding: '12px' }}
            >
              {isProcessing ? <RefreshCw size={17} className="animate-spin" /> : <Wand2 size={17} />}
              <span>Terapkan & Perbarui Hasil</span>
            </button>
            <button
              type="button"
              onClick={() => { setImageSrc(null); setProcessedUrl(null); setClickPoints([]); }}
              className="btn-secondary"
            >
              <Undo2 size={16} />
              <span>Ganti Foto</span>
            </button>
          </div>

          {/* Side-by-Side Interactive Canvas Preview */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            
            {/* Left: Original Interactive Canvas */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--color-text-secondary)' }}>
                <Pipette size={14} color="var(--cat-img-dark)" />
                <span>Foto Asli {removalMode === 'floodFill' ? '(Klik Kotak untuk Melubangi)' : '(Klik untuk Ambil Warna)'}</span>
              </div>
              <div style={{
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                background: 'var(--color-bg-base)',
                border: '1px solid var(--color-border)',
                minHeight: '260px',
                maxHeight: '460px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}>
                <canvas 
                  ref={originalCanvasRef}
                  onClick={handleCanvasClick}
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '460px', 
                    objectFit: 'contain',
                    cursor: 'crosshair',
                    display: 'block',
                  }}
                  title={removalMode === 'floodFill' 
                    ? "Klik kotak foto 1, 2, 3 untuk melubanginya satu per satu" 
                    : "Klik bagian mana saja pada foto untuk mengambil warna"}
                />
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '6px' }}>
                💡 Algoritma Morfologi otomatis mendeteksi tepat 3 kotak foto tanpa merusak stiker & grid.
              </div>
            </div>

            {/* Right: Processed Result Preview */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--color-text-secondary)' }}>
                <Check size={14} color="#10B981" />
                <span>Hasil Transparan (Hanya Tepat 3 Kotak)</span>
              </div>
              <div style={{
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                background: selectedBg === 'transparent' 
                  ? 'repeating-conic-gradient(#cbd5e1 0% 25%, #f8fafc 0% 50%) 50% / 16px 16px' 
                  : selectedBg,
                minHeight: '260px',
                maxHeight: '460px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--color-border)',
              }}>
                {processedUrl ? (
                  <img 
                    src={processedUrl} 
                    alt="Hasil Background Baru" 
                    style={{ maxWidth: '100%', maxHeight: '460px', objectFit: 'contain' }} 
                  />
                ) : (
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                    Memproses gambar...
                  </div>
                )}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '6px' }}>
                {selectedBg === 'transparent' 
                  ? '🏁 Pola catur adalah lubang transparan tempat foto akan dimasukkan.' 
                  : `Warna latar belakang diubah ke ${selectedBg}.`}
              </div>
            </div>

          </div>

          {/* Download Action */}
          {processedUrl && (
            <div style={{ marginTop: '28px', textAlign: 'center' }}>
              <a
                href={processedUrl}
                download={selectedBg === 'transparent' ? 'photobooth_3_kotak_transparan.png' : 'photobooth_bg_change.jpg'}
                className="btn-primary"
                style={{
                  textDecoration: 'none',
                  padding: '12px 32px',
                  fontSize: '15px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Download size={18} />
                <span>Unduh Gambar {selectedBg === 'transparent' ? 'PNG Transparan (3 Kotak)' : 'Hasil'}</span>
              </a>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
export default BgChangerTool;
