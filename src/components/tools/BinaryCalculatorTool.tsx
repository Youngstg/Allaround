import React, { useState } from 'react';
import { Copy, Check, Calculator, ArrowRightLeft, RefreshCw } from 'lucide-react';
import { parseToDec, formatBinary, calculateBinary } from '../../utils/tools-logic';

export const BinaryCalculatorTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'converter' | 'calc'>('converter');

  // Converter state
  const [inputVal, setInputVal] = useState('42');
  const [inputBase, setInputBase] = useState<'dec' | 'bin' | 'hex' | 'oct'>('dec');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Calculator state
  const [calcBinA, setCalcBinA] = useState('101010');
  const [calcBinB, setCalcBinB] = useState('001100');
  const [operator, setOperator] = useState<'+' | '-' | '*' | '/' | 'AND' | 'OR' | 'XOR'>('+');

  const decVal = parseToDec(inputVal, inputBase);

  const getBinaryString = (n: bigint | null) => {
    return formatBinary(n);
  };

  const getAscii = (n: bigint | null) => {
    if (n === null || n < 0n || n > 255n) return '-';
    const charCode = Number(n);
    if (charCode >= 32 && charCode <= 126) return `'${String.fromCharCode(charCode)}'`;
    return `ASCII ${charCode}`;
  };

  const copyVal = (val: string, key: string) => {
    if (val === '-') return;
    navigator.clipboard.writeText(val.replace(/\s+/g, ''));
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const calcResult = calculateBinary(calcBinA, calcBinB, operator);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px', fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
          Kalkulator & Konverter Biner
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}>
          Konversi real-time antar basis biner, desimal, heksadesimal, oktal, serta kalkulasi aritmatika dan bitwise.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
        <div style={{
          display: 'inline-flex',
          gap: '6px',
          padding: '6px',
          background: 'var(--color-bg-surface)',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--color-border)',
        }}>
          <button
            onClick={() => setActiveTab('converter')}
            style={{
              padding: '8px 20px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: activeTab === 'converter' ? 'var(--brand-dark)' : 'transparent',
              color: activeTab === 'converter' ? '#FFFFFF' : 'var(--color-text-secondary)',
              fontWeight: activeTab === 'converter' ? 700 : 500,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ArrowRightLeft size={15} />
            <span>Konverter Basis Bilangan</span>
          </button>

          <button
            onClick={() => setActiveTab('calc')}
            style={{
              padding: '8px 20px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: activeTab === 'calc' ? 'var(--brand-dark)' : 'transparent',
              color: activeTab === 'calc' ? '#FFFFFF' : 'var(--color-text-secondary)',
              fontWeight: activeTab === 'calc' ? 700 : 500,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Calculator size={15} />
            <span>Kalkulator Operasi Biner</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Converter */}
      {activeTab === 'converter' && (
        <div className="glass-card animate-fade-in" style={{ padding: '24px', background: 'var(--color-bg-card)' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '8px', color: 'var(--color-text-primary)' }}>
              Masukkan Nilai & Pilih Basis:
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Masukkan angka..."
                style={{
                  flex: 1,
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-input-bg)',
                  color: 'var(--color-text-primary)',
                  fontSize: '16px',
                  fontFamily: 'var(--font-mono)',
                  outline: 'none',
                  fontWeight: 600,
                }}
              />
              <select
                value={inputBase}
                onChange={(e) => setInputBase(e.target.value as any)}
                style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-input-bg)',
                  color: 'var(--color-text-primary)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <option value="dec">Desimal (Base 10)</option>
                <option value="bin">Biner (Base 2)</option>
                <option value="hex">Heksadesimal (Base 16)</option>
                <option value="oct">Oktal (Base 8)</option>
              </select>
            </div>
          </div>

          {/* Results Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'Biner (Base 2)', val: getBinaryString(decVal), key: 'bin' },
              { label: 'Desimal (Base 10)', val: decVal !== null ? decVal.toString(10) : '-', key: 'dec' },
              { label: 'Heksadesimal (Base 16)', val: decVal !== null ? '0x' + decVal.toString(16).toUpperCase() : '-', key: 'hex' },
              { label: 'Oktal (Base 8)', val: decVal !== null ? '0o' + decVal.toString(8) : '-', key: 'oct' },
              { label: 'Karakter ASCII (0-255)', val: getAscii(decVal), key: 'ascii' },
            ].map(item => (
              <div
                key={item.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: 'var(--color-bg-base)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 700 }}>
                    {item.label}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '15px',
                    color: item.val === '-' ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
                    fontWeight: 700,
                    marginTop: '2px',
                    letterSpacing: item.key === 'bin' ? '0.05em' : 'normal',
                  }}>
                    {item.val}
                  </div>
                </div>

                <button
                  onClick={() => copyVal(item.val, item.key)}
                  disabled={item.val === '-'}
                  style={{
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-bg-surface)',
                    color: 'var(--color-text-primary)',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: item.val === '-' ? 'default' : 'pointer',
                    opacity: item.val === '-' ? 0.3 : 1,
                  }}
                >
                  {copiedKey === item.key ? <Check size={13} color="#10B981" /> : <Copy size={13} />}
                  <span>{copiedKey === item.key ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mode 2: Calculator */}
      {activeTab === 'calc' && (
        <div className="glass-card animate-fade-in" style={{ padding: '24px', background: 'var(--color-bg-card)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px', color: 'var(--color-text-secondary)' }}>
                Biner A:
              </label>
              <input 
                type="text"
                value={calcBinA}
                onChange={(e) => setCalcBinA(e.target.value.replace(/[^01]/g, ''))}
                placeholder="cth: 1010"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-input-bg)',
                  color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '15px',
                  fontWeight: 700,
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px', color: 'var(--color-text-secondary)', textAlign: 'center' }}>
                Operasi:
              </label>
              <select
                value={operator}
                onChange={(e) => setOperator(e.target.value as any)}
                style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  background: 'var(--cat-img-light)',
                  color: 'var(--brand-dark)',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <option value="+">+ (Tambah)</option>
                <option value="-">- (Kurang)</option>
                <option value="*">× (Kali)</option>
                <option value="/">÷ (Bagi)</option>
                <option value="AND">AND (Bitwise)</option>
                <option value="OR">OR (Bitwise)</option>
                <option value="XOR">XOR (Bitwise)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px', color: 'var(--color-text-secondary)' }}>
                Biner B:
              </label>
              <input 
                type="text"
                value={calcBinB}
                onChange={(e) => setCalcBinB(e.target.value.replace(/[^01]/g, ''))}
                placeholder="cth: 0101"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-input-bg)',
                  color: 'var(--color-text-primary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '15px',
                  fontWeight: 700,
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Result Box */}
          <div style={{
            padding: '20px',
            background: 'var(--color-bg-base)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
          }}>
            {calcResult.error ? (
              <div style={{ color: '#EF4444', fontSize: '13px', fontWeight: 600 }}>
                {calcResult.error}
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand-dark)' }}>
                    HASIL OPERASI:
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                    {calcResult.numA} {operator} {calcResult.numB} = {calcResult.dec} (Desimal)
                  </span>
                </div>

                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '22px',
                  fontWeight: 800,
                  color: 'var(--brand-dark)',
                  letterSpacing: '0.04em',
                  marginBottom: '14px',
                  wordBreak: 'break-all',
                }}>
                  {calcResult.bin}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  <div style={{ background: 'var(--color-bg-surface)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Desimal</div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>
                      {calcResult.dec}
                    </div>
                  </div>

                  <div style={{ background: 'var(--color-bg-surface)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Heksadesimal</div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>
                      0x{calcResult.hex}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
