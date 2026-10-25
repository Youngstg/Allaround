import React, { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';

export const PasswordGeneratorTool: React.FC = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let charset = '';
    if (includeLower) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    if (!charset) {
      setPassword('');
      return;
    }

    let result = '';
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += charset[array[i] % charset.length];
    }
    setPassword(result);
  };

  useEffect(() => {
    generatePassword();
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols]);

  const copyPassword = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrength = () => {
    let score = 0;
    if (length >= 12) score += 1;
    if (length >= 16) score += 1;
    if (includeUpper && includeLower) score += 1;
    if (includeNumbers) score += 1;
    if (includeSymbols) score += 1;

    if (score <= 2) return { label: 'Lemah', color: '#EF4444', percent: 30 };
    if (score <= 4) return { label: 'Kuat', color: '#0284C7', percent: 70 };
    return { label: 'Sangat Kuat', color: '#10B981', percent: 100 };
  };

  const strength = getStrength();

  return (
    <div className="animate-fade-in" style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px', fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
          Password Generator
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}>
          Hasilkan kata sandi acak yang aman dan terenkripsi menggunakan Web Cryptography API.
        </p>
      </div>

      <div className="glass-card" style={{ padding: '28px', background: 'var(--color-bg-card)' }}>
        {/* Output Display */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          background: 'var(--color-bg-base)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          marginBottom: '16px',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '18px',
            letterSpacing: '0.04em',
            wordBreak: 'break-all',
            color: 'var(--color-text-primary)',
            fontWeight: 600,
          }}>
            {password || 'Pilih minimal satu opsi'}
          </span>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={generatePassword}
              title="Buat Ulang"
              style={{
                background: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px',
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={16} color="var(--color-text-secondary)" />
            </button>
            <button
              onClick={copyPassword}
              title="Salin"
              style={{
                background: copied ? '#10B981' : 'var(--brand-dark)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '13px',
              }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? 'Tersalin' : 'Salin'}</span>
            </button>
          </div>
        </div>

        {/* Strength Bar */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Tingkat Keamanan:</span>
            <span style={{ fontWeight: 700, color: strength.color }}>{strength.label}</span>
          </div>
          <div style={{ height: '6px', background: 'var(--color-border)', borderRadius: '100px', overflow: 'hidden' }}>
            <div style={{
              width: `${strength.percent}%`,
              height: '100%',
              background: strength.color,
              transition: 'all 0.3s ease',
            }} />
          </div>
        </div>

        {/* Length Slider */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, marginBottom: '8px', color: 'var(--color-text-primary)' }}>
            <span>Panjang Karakter:</span>
            <span style={{ fontSize: '16px', color: 'var(--brand-dark)' }}>{length}</span>
          </div>
          <input 
            type="range"
            min="6"
            max="40"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--brand-primary)' }}
          />
        </div>

        {/* Options */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {[
            { label: 'Huruf Besar (A-Z)', val: includeUpper, set: setIncludeUpper },
            { label: 'Huruf Kecil (a-z)', val: includeLower, set: setIncludeLower },
            { label: 'Angka (0-9)', val: includeNumbers, set: setIncludeNumbers },
            { label: 'Simbol (!@#$%)', val: includeSymbols, set: setIncludeSymbols },
          ].map((opt) => (
            <label 
              key={opt.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px',
                background: 'var(--color-bg-base)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--color-text-primary)',
              }}
            >
              <input 
                type="checkbox"
                checked={opt.val}
                onChange={(e) => opt.set(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--brand-primary)' }}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
