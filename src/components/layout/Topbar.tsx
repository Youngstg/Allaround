import React, { useState } from 'react';
import { Shield, Moon, Sun, ArrowLeft, Info } from 'lucide-react';
import { TOOLS } from '../../data/tools';

interface TopbarProps {
  activeToolId: string | null;
  onSelectTool: (id: string | null) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  activeToolId,
  onSelectTool,
  isDark,
  onToggleTheme,
}) => {
  const [showPrivacyTooltip, setShowPrivacyTooltip] = useState(false);
  const currentTool = TOOLS.find(t => t.id === activeToolId);

  return (
    <header style={{
      height: '64px',
      borderBottom: '1px solid var(--color-border)',
      backgroundColor: 'var(--color-bg-surface)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      position: 'sticky',
      top: 0,
      zIndex: 30,
      backdropFilter: 'blur(10px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Back / Breadcrumb */}
        {currentTool ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => onSelectTool(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg-base)',
                color: 'var(--color-text-secondary)',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              <ArrowLeft size={14} />
              <span>Dashboard</span>
            </button>
            <span style={{ color: 'var(--color-text-muted)' }}>/</span>
            <span style={{ 
              fontFamily: 'var(--font-heading)',
              fontSize: '16px', 
              fontWeight: 700, 
              color: 'var(--color-text-primary)' 
            }}>
              {currentTool.name}
            </span>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '17px',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
            }}>
              Koleksi Alat
            </span>
            <span style={{
              fontSize: '11px',
              background: 'var(--cat-img-light)',
              color: 'var(--cat-img-dark)',
              padding: '2px 8px',
              borderRadius: '100px',
              fontWeight: 600,
              border: '1px solid var(--cat-img-border)',
            }}>
              {TOOLS.length} Alat Aktif
            </span>
          </div>
        )}
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Privacy Shield with Interactive Hover Tooltip */}
        <div 
          style={{ position: 'relative' }}
          onMouseEnter={() => setShowPrivacyTooltip(true)}
          onMouseLeave={() => setShowPrivacyTooltip(false)}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--cat-conv-light)',
            color: 'var(--cat-conv-dark)',
            border: '1px solid var(--cat-conv-border)',
            fontWeight: 600,
            cursor: 'pointer',
            userSelect: 'none',
          }}>
            <Shield size={14} />
            <span>Client-Side</span>
            <Info size={12} style={{ opacity: 0.7 }} />
          </div>

          {/* Floating Tooltip */}
          {showPrivacyTooltip && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '8px',
              width: '280px',
              padding: '12px 14px',
              background: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 100,
              animation: 'fadeIn 0.2s ease forwards',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--cat-conv-dark)',
                marginBottom: '4px',
              }}>
                <Shield size={14} />
                <span>Jaminan Privasi 100%</span>
              </div>
              <p style={{
                fontSize: '12px',
                lineHeight: 1.5,
                color: 'var(--color-text-secondary)',
                margin: 0,
              }}>
                Semua file dan data diproses langsung di peramban web komputer Anda. Tidak ada data yang dikirim atau diunggah ke server manapun.
              </p>
            </div>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          title={isDark ? "Beralih ke Mode Terang" : "Beralih ke Mode Gelap"}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: '1px solid var(--color-border)',
            background: 'var(--color-bg-surface)',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
          }}
        >
          {isDark ? <Sun size={16} color="#FBBF24" /> : <Moon size={16} color="var(--color-text-secondary)" />}
        </button>
      </div>
    </header>
  );
};
