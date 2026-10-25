import React, { useState } from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { UNITS, convertUnit, UnitCategory } from '../../utils/tools-logic';

export const UnitConverterTool: React.FC = () => {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [value, setValue] = useState<number>(1);
  const [fromUnitIndex, setFromUnitIndex] = useState(0);
  const [toUnitIndex, setToUnitIndex] = useState(1);

  const unitsList = UNITS[category];
  const fromUnit = unitsList[fromUnitIndex] || unitsList[0];
  const toUnit = unitsList[toUnitIndex] || unitsList[1] || unitsList[0];

  const result = convertUnit(category, fromUnitIndex, toUnitIndex, value);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '720px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px', fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
          Unit Converter
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}>
          Konversi satuan panjang, berat, suhu, dan kapasitas penyimpanan digital.
        </p>
      </div>

      <div className="glass-card" style={{ padding: '24px', background: 'var(--color-bg-card)' }}>
        {/* Category Selector */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {[
            { key: 'length', label: 'Panjang' },
            { key: 'weight', label: 'Berat' },
            { key: 'temperature', label: 'Suhu' },
            { key: 'digital', label: 'Data Digital' },
          ].map(c => (
            <button
              key={c.key}
              onClick={() => { setCategory(c.key as UnitCategory); setFromUnitIndex(0); setToUnitIndex(1); }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: 'var(--radius-sm)',
                border: category === c.key ? '2px solid var(--brand-dark)' : '1px solid var(--color-border)',
                background: category === c.key ? 'var(--cat-img-light)' : 'var(--color-bg-surface)',
                color: category === c.key ? 'var(--brand-dark)' : 'var(--color-text-secondary)',
                fontWeight: category === c.key ? 700 : 500,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px', color: 'var(--color-text-secondary)' }}>
              Dari:
            </label>
            <input 
              type="number"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-input-bg)',
                color: 'var(--color-text-primary)',
                fontSize: '16px',
                fontWeight: 700,
                marginBottom: '8px',
              }}
            />
            <select
              value={fromUnitIndex}
              onChange={(e) => setFromUnitIndex(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-input-bg)',
                color: 'var(--color-text-primary)',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              {unitsList.map((u, i) => (
                <option key={u.name} value={i}>{u.name}</option>
              ))}
            </select>
          </div>

          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--cat-img-light)',
            color: 'var(--brand-dark)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '20px',
          }}>
            <ArrowRightLeft size={16} />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px', color: 'var(--color-text-secondary)' }}>
              Ke:
            </label>
            <div style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg-base)',
              color: 'var(--brand-dark)',
              fontSize: '16px',
              fontWeight: 800,
              marginBottom: '8px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {result.toLocaleString(undefined, { maximumFractionDigits: 6 })}
            </div>
            <select
              value={toUnitIndex}
              onChange={(e) => setToUnitIndex(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-input-bg)',
                color: 'var(--color-text-primary)',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              {unitsList.map((u, i) => (
                <option key={u.name} value={i}>{u.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Result Summary */}
        <div style={{
          textAlign: 'center',
          padding: '14px',
          background: 'var(--cat-img-light)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--cat-img-border)',
          color: 'var(--brand-dark)',
          fontSize: '14px',
          fontWeight: 600,
        }}>
          {value} {fromUnit.name} = {result.toLocaleString(undefined, { maximumFractionDigits: 6 })} {toUnit.name}
        </div>
      </div>
    </div>
  );
};
