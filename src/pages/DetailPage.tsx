import { useState } from 'react';
import type { Pokemon, PokemonSpecies, EvolutionChain, AbilityDetail } from '../types/pokemon';
import { useFetch } from '../hooks/usePokeApi';
import { formatName, getTypeColor, padId, STAT_COLORS } from '../utils/typeColors';
import TypeBadge from '../components/TypeBadge';
import StatBar from '../components/StatBar';
import EvolutionChainView from '../components/EvolutionChainView';

interface Props {
  name: string;
  onBack?: () => void;
  onSelect: (name: string) => void;
}

type Tab = 'about' | 'stats' | 'moves' | 'evolutions';

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: 'var(--surface3)', border: '1px solid var(--border-c)', borderRadius: '8px', padding: '10px 14px' }}>
      <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{value}</div>
    </div>
  );
}

export default function DetailPage({ name, onSelect }: Props) {
  const { data: pokemon, loading } = useFetch<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${name}`);
  const { data: species } = useFetch<PokemonSpecies>(pokemon ? pokemon.species.url : null);
  const { data: evoChain } = useFetch<EvolutionChain>(species ? species.evolution_chain.url : null);
  const [tab, setTab] = useState<Tab>('about');
  const [shiny, setShiny] = useState(false);
  const [selectedAbility, setSelectedAbility] = useState<string | null>(null);
  const { data: abilityData } = useFetch<AbilityDetail>(
    selectedAbility ? `https://pokeapi.co/api/v2/ability/${selectedAbility}` : null
  );

  if (loading || !pokemon) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px', color: 'var(--text2)' }}>
        <div className="pokeball-loader" style={{ width: '32px', height: '32px', borderWidth: '3px' }} />
        <span style={{ fontSize: '13px' }}>Loading Pokémon...</span>
      </div>
    );
  }

  const primaryType = pokemon.types[0].type.name;
  const { bg: accentColor } = getTypeColor(primaryType);
  const artwork = shiny ? pokemon.sprites.front_shiny : pokemon.sprites.front_default;

  const flavorText = species?.flavor_text_entries
    .filter(e => e.language.name === 'en').at(-1)
    ?.flavor_text.replace(/\f/g, ' ') ?? '';

  const genus = species?.genera.find(g => g.language.name === 'en')?.genus ?? '';
  const totalStats = pokemon.stats.reduce((s, x) => s + x.base_stat, 0);

  const TABS: { id: Tab; label: string }[] = [
    { id: 'about',      label: 'About'     },
    { id: 'stats',      label: 'Base Stats' },
    { id: 'moves',      label: `Moves (${pokemon.moves.length})` },
    { id: 'evolutions', label: 'Evolution'  },
  ];

  const sectionHead: React.CSSProperties = {
    fontSize: '11px', fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase',
    letterSpacing: '0.05em', margin: '0 0 12px',
    borderBottom: '1px solid var(--border-c)', paddingBottom: '8px',
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      {/* Hero row */}
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {/* Sprite panel */}
        <div style={{ width: '260px', flexShrink: 0, background: 'var(--surface3)', borderRight: '1px solid var(--border-c)', borderBottom: '1px solid var(--border-c)', padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: accentColor }} />

          {artwork && <img src={artwork} alt={pokemon.name} style={{ width: '160px', height: '160px', objectFit: 'contain', imageRendering: 'pixelated' }} />}

          <button
            onClick={() => setShiny(s => !s)}
            style={{
              padding: '5px 14px',
              border: `1px solid ${shiny ? accentColor : 'var(--border-c)'}`,
              borderRadius: '6px',
              background: shiny ? accentColor : 'var(--surface4)',
              color: shiny ? '#fff' : 'var(--text2)',
              fontSize: '12px',
              fontWeight: 600,
              transition: 'all 0.15s',
            }}
          >
            {shiny ? 'Shiny' : 'Shiny?'}
          </button>

        </div>

        {/* Info panel */}
        <div style={{ flex: 1, minWidth: '280px', padding: '24px 28px', borderBottom: '1px solid var(--border-c)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text3)', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '4px' }}>{padId(pokemon.id)}</div>
          <h1 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.9rem)', fontWeight: 700, color: 'var(--text)', margin: '0 0 3px' }}>
            {formatName(pokemon.name)}
          </h1>
          {genus && <p style={{ color: 'var(--text2)', fontSize: '13px', margin: '0 0 12px' }}>{genus}</p>}

          <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
            {pokemon.types.map(t => <TypeBadge key={t.type.name} type={t.type.name} size="lg" />)}
          </div>

          {flavorText && (
            <p style={{ color: 'var(--text2)', fontSize: '13px', lineHeight: 1.7, margin: '0 0 16px', padding: '10px 14px', background: 'var(--surface3)', border: '1px solid var(--border-c)', borderLeft: `3px solid ${accentColor}`, borderRadius: '0 6px 6px 0' }}>
              {flavorText}
            </p>
          )}

          {species && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
              <InfoCard label="Height" value={`${(pokemon.height / 10).toFixed(1)} m`} />
              <InfoCard label="Weight" value={`${(pokemon.weight / 10).toFixed(1)} kg`} />
              <InfoCard label="Capture Rate" value={`${species.capture_rate}/255`} />
              <InfoCard label="Base Happiness" value={`${species.base_happiness}`} />
              <InfoCard label="Growth Rate" value={formatName(species.growth_rate.name)} />
              <InfoCard label="Egg Groups" value={species.egg_groups.map(e => formatName(e.name)).join(', ')} />
              {species.is_legendary && <InfoCard label="Status" value="Legendary" />}
              {species.is_mythical  && <InfoCard label="Status" value="Mythical"  />}
              {species.is_baby      && <InfoCard label="Status" value="Baby"      />}
            </div>
          )}
        </div>
      </div>

      {/* Tabs nav */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-c)', padding: '0 20px', background: 'var(--surface)', gap: '2px', paddingTop: '4px' }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '8px 16px',
              background: 'none',
              border: 'none',
              borderBottom: tab === t.id ? `2px solid var(--accent)` : '2px solid transparent',
              color: tab === t.id ? 'var(--accent)' : 'var(--text2)',
              fontSize: '13px',
              fontWeight: 500,
              transition: 'all 0.15s',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ padding: '20px 28px 48px', background: 'var(--surface2)' }}>

        {tab === 'about' && (
          <div style={{ maxWidth: '680px' }}>
            <h3 style={sectionHead}>Abilities</h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: selectedAbility && abilityData ? '0' : '20px' }}>
              {pokemon.abilities.map(a => (
                <button
                  key={a.ability.name}
                  onClick={() => setSelectedAbility(prev => prev === a.ability.name ? null : a.ability.name)}
                  style={{
                    padding: '6px 14px',
                    background: selectedAbility === a.ability.name ? accentColor : 'var(--surface3)',
                    border: `1px solid ${selectedAbility === a.ability.name ? accentColor : 'var(--border-c)'}`,
                    borderRadius: '6px',
                    color: selectedAbility === a.ability.name ? '#fff' : 'var(--text)',
                    fontSize: '13px',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    transition: 'all 0.15s',
                  }}
                >
                  {formatName(a.ability.name)}
                  {a.is_hidden && (
                    <span style={{ fontSize: '10px', fontWeight: 600, color: '#a78bfa', background: 'rgba(124,58,237,0.15)', padding: '1px 6px', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '4px' }}>
                      HIDDEN
                    </span>
                  )}
                </button>
              ))}
            </div>

            {selectedAbility && abilityData && (
              <div style={{ background: 'var(--surface3)', border: '1px solid var(--border-c)', borderLeft: `3px solid ${accentColor}`, borderRadius: '0 6px 6px 0', padding: '12px 16px', margin: '10px 0 20px', fontSize: '13px', color: 'var(--text)', lineHeight: 1.7 }}>
                <strong style={{ color: 'var(--text)', display: 'block', marginBottom: '4px' }}>{formatName(selectedAbility)}</strong>
                {abilityData.effect_entries.find(e => e.language.name === 'en')?.short_effect ?? ''}
              </div>
            )}

            {species && (
              <>
                <h3 style={{ ...sectionHead, marginTop: '20px' }}>Breeding</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '8px' }}>
                  <InfoCard label="Gender Rate" value={species.gender_rate === -1 ? 'Genderless' : `M ${((8 - species.gender_rate) / 8 * 100).toFixed(0)}%  F ${(species.gender_rate / 8 * 100).toFixed(0)}%`} />
                  <InfoCard label="Egg Groups" value={species.egg_groups.map(e => formatName(e.name)).join(', ')} />
                  <InfoCard label="Hatch Counter" value={`${species.hatch_counter} Cycles`} />
                  <InfoCard label="Color" value={formatName(species.color.name)} />
                  <InfoCard label="Shape" value={formatName(species.shape?.name ?? '')} />
                </div>
              </>
            )}
          </div>
        )}

        {tab === 'stats' && (
          <div style={{ maxWidth: '520px' }}>
            <h3 style={sectionHead}>Base Stats</h3>
            {pokemon.stats.map(s => <StatBar key={s.stat.name} statName={s.stat.name} value={s.base_stat} />)}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-c)' }}>
              <span style={{ width: '56px', fontSize: '11px', fontWeight: 700, color: 'var(--text2)', textAlign: 'right' }}>TOTAL</span>
              <span style={{ width: '36px', fontSize: '16px', fontWeight: 700, color: 'var(--text)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{totalStats}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '16px' }}>
              {pokemon.stats.map(s => {
                const color = STAT_COLORS[s.stat.name] ?? '#6b7280';
                const grade = s.base_stat >= 150 ? 'S' : s.base_stat >= 110 ? 'A' : s.base_stat >= 80 ? 'B' : s.base_stat >= 50 ? 'C' : 'D';
                return (
                  <div key={s.stat.name} style={{ background: 'var(--surface)', border: '1px solid var(--border-c)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 700, color, fontVariantNumeric: 'tabular-nums' }}>{s.base_stat}</div>
                    <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '3px' }}>{s.stat.name.replace('special-', 'sp. ')}</div>
                    <div style={{ display: 'inline-block', marginTop: '6px', padding: '1px 8px', border: `1px solid ${color}`, borderRadius: '4px', background: `${color}20`, color, fontSize: '11px', fontWeight: 700 }}>{grade}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === 'moves' && (
          <div>
            <h3 style={sectionHead}>Learnable Moves</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))', gap: '6px', maxHeight: '440px', overflowY: 'auto', paddingRight: '4px' }}>
              {pokemon.moves.map(m => (
                <div key={m.move.name} style={{ background: 'var(--surface)', border: '1px solid var(--border-c)', borderRadius: '6px', padding: '6px 12px', fontSize: '13px', color: 'var(--text)', fontWeight: 500 }}>
                  {formatName(m.move.name)}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'evolutions' && (
          <div>
            <h3 style={sectionHead}>Evolution Chain</h3>
            {evoChain
              ? <EvolutionChainView chain={evoChain.chain} onSelect={onSelect} currentName={name} />
              : <div style={{ color: 'var(--text2)', fontSize: '13px' }}>Loading evolution chain...</div>
            }
          </div>
        )}
      </div>
    </div>
  );
}
