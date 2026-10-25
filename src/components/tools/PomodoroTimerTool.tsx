import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Timer, CheckCircle2 } from 'lucide-react';

export const PomodoroTimerTool: React.FC = () => {
  const [mode, setMode] = useState<'focus' | 'short' | 'long'>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  const getDuration = (m: 'focus' | 'short' | 'long') => {
    if (m === 'focus') return 25 * 60;
    if (m === 'short') return 5 * 60;
    return 15 * 60;
  };

  const switchMode = (newMode: 'focus' | 'short' | 'long') => {
    setMode(newMode);
    setTimeLeft(getDuration(newMode));
    setIsRunning(false);
  };

  useEffect(() => {
    let timer: any = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (mode === 'focus') {
        setCompletedSessions((prev) => prev + 1);
        switchMode('short');
      } else {
        switchMode('focus');
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode]);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(getDuration(mode));
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const totalDuration = getDuration(mode);
  const progressPercent = ((totalDuration - timeLeft) / totalDuration) * 100;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px', fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)' }}>
          Pomodoro Focus Timer
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}>
          Tingkatkan produktivitas kerja dan fokus dengan metode interval waktu 25 menit.
        </p>
      </div>

      <div className="glass-card" style={{ padding: '36px 24px', background: 'var(--color-bg-card)', textAlign: 'center' }}>
        {/* Mode Selector */}
        <div style={{ display: 'inline-flex', gap: '8px', padding: '6px', background: 'var(--color-bg-base)', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)', marginBottom: '32px' }}>
          {[
            { key: 'focus', label: 'Fokus (25m)' },
            { key: 'short', label: 'Istirahat Pendek (5m)' },
            { key: 'long', label: 'Istirahat Panjang (15m)' },
          ].map(m => (
            <button
              key={m.key}
              onClick={() => switchMode(m.key as any)}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: mode === m.key ? 'var(--brand-dark)' : 'transparent',
                color: mode === m.key ? '#FFFFFF' : 'var(--color-text-secondary)',
                fontWeight: mode === m.key ? 700 : 500,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Circular Progress & Time Display */}
        <div style={{
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          border: '8px solid var(--cat-img-border)',
          margin: '0 auto 32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--color-bg-surface)',
          boxShadow: 'var(--shadow-md)',
          position: 'relative',
        }}>
          <div style={{
            fontSize: '52px',
            fontWeight: 800,
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-text-primary)',
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}>
            {timeFormatted}
          </div>
          <div style={{
            fontSize: '13px',
            color: 'var(--color-text-muted)',
            marginTop: '8px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}>
            {mode === 'focus' ? 'Sesi Fokus' : 'Istirahat'}
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginBottom: '28px' }}>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="btn-primary"
            style={{ padding: '14px 36px', fontSize: '15px' }}
          >
            {isRunning ? <Pause size={18} /> : <Play size={18} />}
            <span>{isRunning ? 'Jeda' : 'Mulai'}</span>
          </button>

          <button
            onClick={resetTimer}
            className="btn-secondary"
            style={{ padding: '14px 20px' }}
          >
            <RotateCcw size={18} />
          </button>
        </div>

        {/* Sessions Counter */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '13px',
          fontWeight: 600,
          color: 'var(--cat-txt-dark)',
          background: 'var(--cat-txt-light)',
          padding: '8px 18px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--cat-txt-border)',
        }}>
          <CheckCircle2 size={16} />
          <span>{completedSessions} Sesi Fokus Selesai Hari Ini</span>
        </div>
      </div>
    </div>
  );
};
