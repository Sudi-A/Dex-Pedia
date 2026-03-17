import { useState } from 'react';
import type { Pokemon } from '../types/pokemon';
import { getTypeColor, padId, formatName } from '../utils/typeColors';
import TypeBadge from './TypeBadge';
import { useFetch } from '../hooks/usePokeApi';

interface Props {
  name: string;
  url: string;
  onClick: (name: string) => void;
}

export default function PokemonCard({ url, onClick }: Props) {
  const { data: pokemon, loading } = useFetch<Pokemon>(url);
  const [hovered, setHovered] = useState(false);

  if (loading || !pokemon) {
    return (
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border-c)',
          borderRadius: '10px',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '180px',
        }}
      >
        <div className="pokeball-loader" />
      </div>
    );
  }

  const primaryType = pokemon.types[0].type.name;
  const { bg } = getTypeColor(primaryType);
  const sprite = pokemon.sprites.front_default;

  return (
    <div
      onClick={() => onClick(pokemon.name)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'var(--hover-bg)' : 'var(--surface)',
        border: '1px solid var(--border-c)',
        borderRadius: '10px',
        padding: '16px 14px 14px',
        cursor: 'pointer',
        transition: 'background 0.15s, border-color 0.15s',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* type color accent top bar */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '3px',
          background: bg,
        }}
      />

      <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text3)', letterSpacing: '0.05em', alignSelf: 'flex-start' }}>
        {padId(pokemon.id)}
      </span>

      {sprite && (
        <img
          src={sprite}
          alt={pokemon.name}
          style={{ width: '80px', height: '80px', objectFit: 'contain', imageRendering: 'pixelated' }}
        />
      )}

      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', textAlign: 'center' }}>
        {formatName(pokemon.name)}
      </span>

      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {pokemon.types.map(t => (
          <TypeBadge key={t.type.name} type={t.type.name} size="sm" />
        ))}
      </div>
    </div>
  );
}
