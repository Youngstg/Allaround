import React, { useState } from 'react';
import { 
  ShieldCheck, Zap, ArrowRight, FileText, Image, 
  AlignLeft, RefreshCw, Clock, Layers, Minimize2, Wand2, 
  Scaling, CaseSensitive, QrCode, KeyRound, Palette, Compass,
  FileType, Pilcrow, ListFilter, ArrowRightLeft, Hash, Timer, FilePlus, FileSpreadsheet, Sparkles, Calculator,
  GitCompare, FileImage, FileEdit, FileCode
} from 'lucide-react';
import { CATEGORIES, TOOLS } from '../data/tools';
import { CategoryId } from '../types';

interface DashboardProps {
  onSelectTool: (id: string) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  FileText: <FileText size={22} />,
  Image: <Image size={22} />,
  AlignLeft: <AlignLeft size={22} />,
  RefreshCw: <RefreshCw size={22} />,
  Sparkles: <Sparkles size={22} />,
  Clock: <Clock size={22} />,
  Minimize2: <Minimize2 size={22} />,
  Layers: <Layers size={22} />,
  Wand2: <Wand2 size={22} />,
  Scaling: <Scaling size={22} />,
  CaseSensitive: <CaseSensitive size={22} />,
  QrCode: <QrCode size={22} />,
  KeyRound: <KeyRound size={22} />,
  Palette: <Palette size={22} />,
  Compass: <Compass size={22} />,
  FileType: <FileType size={22} />,
  Pilcrow: <Pilcrow size={22} />,
  ListFilter: <ListFilter size={22} />,
  ArrowRightLeft: <ArrowRightLeft size={22} />,
  Hash: <Hash size={22} />,
  Calculator: <Calculator size={22} />,
  Timer: <Timer size={22} />,
  FilePlus: <FilePlus size={22} />,
  FileSpreadsheet: <FileSpreadsheet size={22} />,
  GitCompare: <GitCompare size={22} />,
  FileImage: <FileImage size={22} />,
  FileEdit: <FileEdit size={22} />,
  ShieldCheck: <ShieldCheck size={22} />,
  FileCode: <FileCode size={22} />,
};

export const Dashboard: React.FC<DashboardProps> = ({ onSelectTool }) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');

  const filteredTools = TOOLS.filter(tool => {
    return selectedCategory === 'all' || tool.category === selectedCategory;
  });

  return (
    <div className="animate-fade-in">
      {/* Hero Banner */}
      <div style={{
        background: 'var(--hero-gradient)',
        borderRadius: 'var(--radius-lg)',
        padding: 'clamp(20px, 4vw, 36px) clamp(16px, 4vw, 32px)',
        border: '1px solid var(--color-border)',
        marginBottom: '32px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div style={{ maxWidth: '640px', position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--hero-badge-bg)',
            padding: '5px 12px',
            borderRadius: '100px',
            fontSize: '12px',
            fontWeight: 700,
            color: 'var(--cat-img-dark)',
            marginBottom: '14px',
            border: '1px solid var(--cat-img-border)',
          }}>
            <Sparkles size={14} />
            <span>Multi-Tool Produktivitas Harian</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
            fontWeight: 800,
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.02em',
            marginBottom: '10px',
            lineHeight: 1.25,
          }}>
            Alat Produktivitas Cepat, Aman dan Estetik
          </h1>

          <p style={{
            fontSize: 'clamp(13px, 1.5vw, 15px)',
            color: 'var(--color-text-secondary)',
            marginBottom: '20px',
            lineHeight: 1.6,
          }}>
            Kompres PDF ke bawah 1 MB tanpa merusak teks, ubah latar foto ke warna pastel, generate kode QR, dan puluhan utilitas instan yang berjalan langsung di peramban Anda.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--cat-txt-dark)',
              background: 'var(--cat-txt-light)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--cat-txt-border)',
            }}>
              <ShieldCheck size={15} />
              <span>100% Client-Side Privacy</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--cat-img-dark)',
              background: 'var(--cat-img-light)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--cat-img-border)',
            }}>
              <Zap size={15} />
              <span>Tanpa Akun & Bebas Iklan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '16px',
        marginBottom: '24px',
        WebkitOverflowScrolling: 'touch',
      }}>
        <button
          onClick={() => setSelectedCategory('all')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '44px',
            padding: '8px 18px',
            borderRadius: 'var(--radius-full)',
            border: selectedCategory === 'all' ? '2px solid var(--cat-img-dark)' : '1px solid var(--color-border)',
            background: selectedCategory === 'all' ? 'var(--cat-img-light)' : 'var(--color-bg-surface)',
            color: selectedCategory === 'all' ? 'var(--cat-img-dark)' : 'var(--color-text-secondary)',
            fontWeight: selectedCategory === 'all' ? 700 : 500,
            fontSize: '13px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all var(--transition-fast)',
          }}
        >
          Semua ({TOOLS.length})
        </button>

        {CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                minHeight: '44px',
                padding: '8px 18px',
                borderRadius: 'var(--radius-full)',
                border: isSelected ? `2px solid ${cat.darkColor}` : '1px solid var(--color-border)',
                background: isSelected ? cat.lightColor : 'var(--color-bg-surface)',
                color: isSelected ? cat.darkColor : 'var(--color-text-secondary)',
                fontWeight: isSelected ? 700 : 500,
                fontSize: '13px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all var(--transition-fast)',
              }}
            >
              <span style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: cat.primaryColor,
              }} />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Tool Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
        gap: '20px',
      }}>
        {filteredTools.map(tool => {
          const categoryInfo = CATEGORIES.find(c => c.id === tool.category);

          return (
            <div
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              className="glass-card"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                position: 'relative',
                background: 'var(--color-bg-card)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  {/* Category Styled Icon */}
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: categoryInfo?.lightColor || 'var(--cat-img-light)',
                    color: categoryInfo?.darkColor || 'var(--cat-img-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${categoryInfo?.borderColor || 'var(--color-border)'}`,
                  }}>
                    {ICON_MAP[tool.icon] || <FileText size={22} />}
                  </div>
                </div>

                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  marginBottom: '6px',
                  color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-heading)',
                }}>
                  {tool.name}
                </h3>

                <p style={{
                  fontSize: '13px',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.5,
                  marginBottom: '20px',
                }}>
                  {tool.description}
                </p>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: 600,
                color: categoryInfo?.darkColor || 'var(--cat-img-dark)',
              }}>
                <span>Buka Alat</span>
                <ArrowRight size={14} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
