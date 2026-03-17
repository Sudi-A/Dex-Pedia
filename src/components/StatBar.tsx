import { STAT_COLORS, STAT_LABELS } from '../utils/typeColors';

interface Props {
  statName: string;
  value: number;
  maxValue?: number;
}

export default function StatBar({ statName, value, maxValue = 255 }: Props) {
  const pct = Math.min((value / maxValue) * 100, 100);
  const color = STAT_COLORS[statName] ?? '#6b7280';
  const label = STAT_LABELS[statName] ?? statName.toUpperCase();

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
      <span style={{ width: '56px', fontSize: '11px', fontWeight: 600, color: 'var(--text2)', textAlign: 'right', flexShrink: 0 }}>
        {label}
      </span>
      <span style={{ width: '28px', fontSize: '13px', fontWeight: 700, color: 'var(--text)', textAlign: 'right', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </span>
      <div style={{ flex: 1, height: '6px', background: 'var(--surface4)', borderRadius: '3px', overflow: 'hidden' }}>
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: color,
            borderRadius: '3px',
            transition: 'width 0.6s ease',
          }}
        />
      </div>
    </div>
  );
}
