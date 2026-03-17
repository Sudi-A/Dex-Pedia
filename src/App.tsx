import { useEffect } from 'react';
import { useState } from 'react';
import PokedexPage from './pages/PokedexPage';
import DetailPage from './pages/DetailPage';

export default function App() {
  const [selected, setSelected] = useState<string | null>(null);

  // Close modal on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelected(null); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div style={{ height: '100%', background: 'var(--page-bg)', color: 'var(--text)', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <header style={{
        background: 'var(--header-bg)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--header-bdr)',
        padding: '0 28px',
        display: 'flex',
        alignItems: 'center',
        height: '56px',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="24" height="24" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="4" />
            <path d="M4 50 Q4 4 50 4 Q96 4 96 50" fill="#ef4444" />
            <path d="M4 50 Q4 96 50 96 Q96 96 96 50" fill="#f8fafc" />
            <line x1="4" y1="50" x2="96" y2="50" stroke="rgba(255,255,255,0.25)" strokeWidth="4" />
            <circle cx="50" cy="50" r="11" fill="var(--accent)" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
            <circle cx="50" cy="50" r="4" fill="#fff" />
          </svg>
          <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--header-title)', letterSpacing: '-0.2px' }}>
            Dex Pedia
          </span>
        </div>

        <div style={{ flex: 1 }} />

        <span style={{ fontSize: '12px', color: 'var(--header-sub)', fontWeight: 400 }}>
          Gen I – IX &nbsp;·&nbsp; 1,302 Pokémon
        </span>
      </header>

      {/* Main content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', height: 'calc(100vh - 56px)' }}>
        <PokedexPage onSelect={setSelected} />
      </main>

      {/* Modal overlay */}
      {selected && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'var(--modal-bg)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '24px 16px',
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              background: 'var(--modal-surface)',
              border: '1px solid var(--modal-bdr)',
              borderRadius: '10px',
              width: '100%',
              maxWidth: '960px',
              minHeight: '500px',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setSelected(null)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                zIndex: 10,
                background: 'var(--close-bg)',
                border: '1px solid var(--border-c)',
                borderRadius: '6px',
                color: 'var(--close-text)',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                transition: 'background 0.15s, color 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--close-hover)'; e.currentTarget.style.color = 'var(--text)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--close-bg)'; e.currentTarget.style.color = 'var(--close-text)'; }}
              title="Close (Esc)"
            >
              ✕
            </button>

            <DetailPage
              name={selected}
              onBack={() => setSelected(null)}
              onSelect={name => setSelected(name)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
