import React, { useState } from 'react';
import { 
  FileText, Image, AlignLeft, RefreshCw, Sparkles, Clock, 
  ChevronDown, ChevronRight, Layers, Minimize2, Wand2, 
  Scaling, CaseSensitive, QrCode, KeyRound, Palette, Search,
  Home, Calculator, GitCompare, FileImage, FileEdit, ShieldCheck,
  FileCode
} from 'lucide-react';
import { CATEGORIES, TOOLS } from '../../data/tools';

interface SidebarProps {
  activeToolId: string | null;
  onSelectTool: (toolId: string | null) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  FileText: <FileText size={18} />,
  Image: <Image size={18} />,
  AlignLeft: <AlignLeft size={18} />,
  RefreshCw: <RefreshCw size={18} />,
  Sparkles: <Sparkles size={18} />,
  Clock: <Clock size={18} />,
  Minimize2: <Minimize2 size={16} />,
  Layers: <Layers size={16} />,
  Wand2: <Wand2 size={16} />,
  Scaling: <Scaling size={16} />,
  CaseSensitive: <CaseSensitive size={16} />,
  QrCode: <QrCode size={16} />,
  KeyRound: <KeyRound size={16} />,
  Palette: <Palette size={16} />,
  Calculator: <Calculator size={16} />,
  GitCompare: <GitCompare size={16} />,
  FileImage: <FileImage size={16} />,
  FileEdit: <FileEdit size={16} />,
  ShieldCheck: <ShieldCheck size={16} />,
  FileCode: <FileCode size={16} />,
};

export const Sidebar: React.FC<SidebarProps> = ({
  activeToolId,
  onSelectTool,
  isMobileOpen,
  onCloseMobile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    pdf: true,
    image: true,
    text: true,
    converter: false,
    generator: false,
    utility: false,
  });

  const toggleCategory = (catId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const filteredTools = TOOLS.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(11, 10, 18, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 40,
          }}
        />
      )}

      <aside style={{
        width: '270px',
        backgroundColor: 'var(--color-bg-sidebar)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '4px 0 24px rgba(0, 0, 0, 0.04)',
      }}>
        {/* Logo Header with Comma Hair Guy Face Icon */}
        <div style={{
          padding: '20px 20px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--color-border)',
        }}>
          <div 
            onClick={() => { onSelectTool(null); onCloseMobile(); }}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            {/* Minimalist Comma Hair Icon */}
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              border: '1.5px solid var(--color-border)',
              background: 'var(--color-bg-surface)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)',
            }}>
              <img 
                src="/logo.jpg" 
                alt="AllAround Logo" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'var(--logo-filter)',
                  mixBlendMode: 'luminosity',
                }}
              />
            </div>

            <div>
              <div style={{ 
                fontFamily: 'var(--font-heading)', 
                fontSize: '19px', 
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1
              }}>
                AllAround
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                Everyday Tools
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ padding: '14px 16px 8px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            background: 'var(--color-input-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
          }}>
            <Search size={15} color="var(--color-text-muted)" />
            <input 
              type="text"
              placeholder="Cari alat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                width: '100%',
                fontSize: '13px',
                color: 'var(--color-text-primary)',
              }}
            />
          </div>
        </div>

        {/* Navigation List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px 12px 24px',
        }}>
          {/* Beranda Link */}
          <div
            onClick={() => { onSelectTool(null); onCloseMobile(); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              marginBottom: '10px',
              fontWeight: activeToolId === null ? 600 : 500,
              fontSize: '13px',
              color: activeToolId === null ? 'var(--cat-img-dark)' : 'var(--color-text-secondary)',
              background: activeToolId === null ? 'var(--cat-img-light)' : 'transparent',
              border: activeToolId === null ? '1px solid var(--cat-img-border)' : '1px solid transparent',
              transition: 'all var(--transition-fast)',
            }}
          >
            <Home size={17} />
            <span>Dashboard</span>
          </div>

          {searchQuery ? (
            /* Search Results View */
            <div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600, padding: '8px 6px' }}>
                HASIL PENCARIAN ({filteredTools.length})
              </div>
              {filteredTools.map(tool => (
                <div
                  key={tool.id}
                  onClick={() => { onSelectTool(tool.id); onCloseMobile(); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: activeToolId === tool.id ? 600 : 400,
                    color: activeToolId === tool.id ? 'var(--cat-img-dark)' : 'var(--color-text-primary)',
                    background: activeToolId === tool.id ? 'var(--cat-img-light)' : 'transparent',
                    marginBottom: '2px',
                  }}
                >
                  {ICON_MAP[tool.icon] || <FileText size={16} />}
                  <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {tool.name}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            /* Category Accordion View */
            CATEGORIES.map(category => {
              const catTools = TOOLS.filter(t => t.category === category.id);
              const isExpanded = expandedCategories[category.id];

              return (
                <div key={category.id} style={{ marginBottom: '6px' }}>
                  {/* Category Header */}
                  <div
                    onClick={() => toggleCategory(category.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      cursor: 'pointer',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-text-primary)',
                      userSelect: 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        backgroundColor: category.primaryColor,
                        display: 'inline-block',
                      }} />
                      <span style={{ 
                        fontSize: '11px', 
                        fontWeight: 700, 
                        fontFamily: 'var(--font-heading)',
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        color: 'var(--color-text-secondary)',
                      }}>
                        {category.name}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        padding: '1px 6px',
                        borderRadius: '100px',
                        background: category.lightColor,
                        color: category.darkColor,
                      }}>
                        {catTools.length}
                      </span>
                      {isExpanded ? <ChevronDown size={13} color="var(--color-text-muted)" /> : <ChevronRight size={13} color="var(--color-text-muted)" />}
                    </div>
                  </div>

                  {/* Category Items */}
                  {isExpanded && (
                    <div style={{ paddingLeft: '8px', marginTop: '2px' }}>
                      {catTools.map(tool => {
                        const isActive = activeToolId === tool.id;
                        return (
                          <div
                            key={tool.id}
                            onClick={() => { onSelectTool(tool.id); onCloseMobile(); }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '8px 12px',
                              borderRadius: 'var(--radius-sm)',
                              cursor: 'pointer',
                              marginBottom: '2px',
                              fontSize: '13px',
                              fontWeight: isActive ? 600 : 400,
                              color: isActive ? category.darkColor : 'var(--color-text-secondary)',
                              background: isActive ? category.lightColor : 'transparent',
                              border: isActive ? `1px solid ${category.borderColor}` : '1px solid transparent',
                              transition: 'all var(--transition-fast)',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                              <span style={{ color: isActive ? category.darkColor : 'var(--color-text-muted)' }}>
                                {ICON_MAP[tool.icon] || <FileText size={15} />}
                              </span>
                              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {tool.name}
                              </span>
                            </div>

                            {tool.badge && (
                              <span style={{
                                fontSize: '10px',
                                fontWeight: 700,
                                padding: '1px 6px',
                                borderRadius: '100px',
                                background: 'var(--cat-pdf-light)',
                                color: 'var(--cat-pdf-dark)',
                                border: '1px solid var(--cat-pdf-border)',
                              }}>
                                {tool.badge}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </aside>
    </>
  );
};
