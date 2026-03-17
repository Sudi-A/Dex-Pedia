import { TYPE_COLORS, formatName } from '../utils/typeColors';

const ALL_TYPES = Object.keys(TYPE_COLORS).filter(t => t !== 'stellar' && t !== 'unknown');

interface Props {
  selected: string | null;
  onChange: (type: string | null) => void;
}

export default function TypeFilter({ selected, onChange }: Props) {
  return (
    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', alignItems: 'center' }}>
      <button
        onClick={() => onChange(null)}
        style={{
          padding: '4px 12px',
          borderRadius: '6px',
          border: '1px solid var(--border-c)',
          background: selected === null ? 'var(--accent-dim)' : 'var(--surface3)',
          color: selected === null ? 'var(--accent-light)' : 'var(--text2)',
          fontSize: '12px',
          fontWeight: 600,
          transition: 'all 0.15s',
          height: '28px',
        }}
      >
        All
      </button>
      {ALL_TYPES.map(type => {
        const { bg, text } = TYPE_COLORS[type];
        const isSelected = selected === type;
        return (
          <button
            key={type}
            onClick={() => onChange(isSelected ? null : type)}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              border: '1px solid var(--border-c)',
              background: isSelected ? bg : 'var(--surface3)',
              color: isSelected ? text : 'var(--text2)',
              fontSize: '12px',
              fontWeight: 600,
              transition: 'all 0.15s',
              height: '28px',
            }}
          >
            {formatName(type)}
          </button>
        );
      })}
    </div>
  );
}
