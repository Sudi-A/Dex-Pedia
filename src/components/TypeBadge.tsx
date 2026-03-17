import { getTypeColor, formatName } from '../utils/typeColors';

interface Props {
  type: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function TypeBadge({ type, size = 'md' }: Props) {
  const { bg, text } = getTypeColor(type);

  const styles = {
    sm: { fontSize: '0.6rem',  padding: '1px 7px',  borderRadius: '4px', letterSpacing: '0.07em' },
    md: { fontSize: '0.65rem', padding: '2px 9px',  borderRadius: '4px', letterSpacing: '0.07em' },
    lg: { fontSize: '0.72rem', padding: '3px 12px', borderRadius: '5px', letterSpacing: '0.07em' },
  }[size];

  return (
    <span
      style={{
        background: bg,
        color: text,
        fontWeight: 600,
        textTransform: 'uppercase',
        display: 'inline-block',
        whiteSpace: 'nowrap',
        ...styles,
      }}
    >
      {formatName(type)}
    </span>
  );
}
