interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = 'Name or Pokédex number...' }: Props) {
  return (
    <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
      <svg
        style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: 'var(--text3)', pointerEvents: 'none' }}
        fill="none" stroke="currentColor" viewBox="0 0 24 24"
      >
        <circle cx="11" cy="11" r="8" strokeWidth="2" />
        <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '6px 12px 6px 32px',
          background: 'var(--surface3)',
          border: '1px solid var(--border-c)',
          borderRadius: '6px',
          color: 'var(--text)',
          fontSize: '13px',
          outline: 'none',
          transition: 'border-color 0.15s, box-shadow 0.15s',
          boxSizing: 'border-box',
          height: '34px',
        }}
        onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 2px var(--accent-glow)'; }}
        onBlur={e => { e.target.style.borderColor = 'var(--border-c)'; e.target.style.boxShadow = 'none'; }}
      />
    </div>
  );
}
