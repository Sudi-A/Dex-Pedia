import type { ReactNode } from 'react';
import type { ChainLink, Pokemon } from '../types/pokemon';
import { useFetch } from '../hooks/usePokeApi';
import { formatName, getTypeColor } from '../utils/typeColors';
import TypeBadge from './TypeBadge';

interface NodeProps {
  link: ChainLink;
  onSelect: (name: string) => void;
  currentName: string;
}

function EvolutionNode({ link, onSelect, currentName }: NodeProps) {
  const { data: poke } = useFetch<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${link.species.name}`);

  const artwork = poke?.sprites.front_default;
  const primaryType = poke?.types[0]?.type.name ?? 'normal';
  const { bg } = getTypeColor(primaryType);
  const isCurrent = link.species.name === currentName;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      {link.evolution_details.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--text2)', fontSize: '11px', fontWeight: 600, gap: '3px', minWidth: '48px', textAlign: 'center' }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          <span style={{ letterSpacing: '0.03em' }}>{getEvoTrigger(link.evolution_details[0])}</span>
        </div>
      )}
      <div
        onClick={() => onSelect(link.species.name)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          cursor: 'pointer',
          padding: '12px',
          borderRadius: '8px',
          border: `1px solid ${isCurrent ? bg : 'var(--border-c)'}`,
          background: isCurrent ? `${bg}20` : 'var(--surface)',
          transition: 'all 0.15s',
          minWidth: '96px',
        }}
        onMouseEnter={e => { if (!isCurrent) { e.currentTarget.style.background = 'var(--hover-bg)'; e.currentTarget.style.borderColor = 'var(--text3)'; } }}
        onMouseLeave={e => { if (!isCurrent) { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.borderColor = 'var(--border-c)'; } }}
      >
        {artwork && <img src={artwork} alt={link.species.name} style={{ width: '64px', height: '64px', objectFit: 'contain', imageRendering: 'pixelated' }} />}
        <span style={{ fontSize: '12px', fontWeight: 600, color: isCurrent ? bg : 'var(--text)', textAlign: 'center' }}>
          {formatName(link.species.name)}
        </span>
        {poke && (
          <div style={{ display: 'flex', gap: '4px' }}>
            {poke.types.map(t => <TypeBadge key={t.type.name} type={t.type.name} size="sm" />)}
          </div>
        )}
      </div>
    </div>
  );
}

function getEvoTrigger(detail: ChainLink['evolution_details'][0]): string {
  if (detail.min_level) return `Lv. ${detail.min_level}`;
  if (detail.item) return formatName(detail.item.name);
  if (detail.held_item) return `Hold\n${formatName(detail.held_item.name)}`;
  if (detail.min_happiness) return `Happiness\n${detail.min_happiness}`;
  if (detail.trigger.name === 'trade') return 'Trade';
  return formatName(detail.trigger.name);
}

function renderChain(chain: ChainLink, onSelect: (n: string) => void, currentName: string): ReactNode {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px', flexWrap: 'wrap' }}>
      <EvolutionNode link={chain} onSelect={onSelect} currentName={currentName} />
      {chain.evolves_to.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {chain.evolves_to.map(next => (
            <div key={next.species.name} style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
              <EvolutionNode link={next} onSelect={onSelect} currentName={currentName} />
              {next.evolves_to.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {next.evolves_to.map(final => (
                    <EvolutionNode key={final.species.name} link={final} onSelect={onSelect} currentName={currentName} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface Props {
  chain: ChainLink;
  onSelect: (name: string) => void;
  currentName: string;
}

export default function EvolutionChainView({ chain, onSelect, currentName }: Props) {
  return <div style={{ overflowX: 'auto', paddingBottom: '8px' }}>{renderChain(chain, onSelect, currentName)}</div>;
}
