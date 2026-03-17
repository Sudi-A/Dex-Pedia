import { useState, useEffect, useCallback, useRef } from 'react';
import type { PokemonListResponse, PokemonListItem, Pokemon } from '../types/pokemon';
import PokemonCard from '../components/PokemonCard';
import SearchBar from '../components/SearchBar';
import TypeFilter from '../components/TypeFilter';
import { useFetch } from '../hooks/usePokeApi';

const PAGE_SIZE = 48;
const ALL_URL = `https://pokeapi.co/api/v2/pokemon?limit=1302&offset=0`;

interface Props {
  onSelect: (name: string) => void;
}

export default function PokedexPage({ onSelect }: Props) {
  const { data: allData, loading: allLoading } = useFetch<PokemonListResponse>(ALL_URL);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [typeMap, setTypeMap] = useState<Record<string, string[]>>({});

  const allPokemon: PokemonListItem[] = allData?.results ?? [];

  const filtered = allPokemon.filter(p => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    const numMatch = q.match(/^#?(\d+)$/);
    if (numMatch) {
      const id = parseInt(numMatch[1]);
      const urlId = parseInt(p.url.split('/').filter(Boolean).pop() ?? '0');
      return urlId === id;
    }
    return p.name.includes(q.replace(/\s+/g, '-'));
  });

  const registerTypes = useCallback((name: string, types: string[]) => {
    setTypeMap(prev => ({ ...prev, [name]: types }));
  }, []);

  const typeFiltered = typeFilter
    ? filtered.filter(p => {
        const types = typeMap[p.name];
        if (!types) return true;
        return types.includes(typeFilter);
      })
    : filtered;

  const displayed = typeFiltered.slice(0, page * PAGE_SIZE);
  const hasMore = displayed.length < typeFiltered.length;

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) setPage(p => p + 1);
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore]);

  useEffect(() => { setPage(1); }, [search, typeFilter]);

  return (
    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

      {/* Search + filter toolbar */}
      <div style={{ padding: '14px 28px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Name or Pokédex Number" />
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border-c)',
            borderRadius: '6px',
            padding: '0 14px',
            fontSize: '12px',
            color: 'var(--text2)',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            fontVariantNumeric: 'tabular-nums',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
          }}>
            {typeFiltered.length.toLocaleString()} Results
          </div>
        </div>

        {/* Divider + type filters */}
        <div style={{ borderTop: '1px solid var(--border-c)', paddingTop: '10px' }}>
          <TypeFilter selected={typeFilter} onChange={setTypeFilter} />
        </div>
      </div>

      {allLoading && (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text2)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div className="pokeball-loader" />
          <span style={{ fontSize: '13px' }}>Loading Pokédex data...</span>
        </div>
      )}

      {/* Grid */}
      <div style={{ padding: '14px 28px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: '12px' }}>
          {displayed.map(p => (
            <PokemonCardWrapper
              key={p.name}
              name={p.name}
              url={p.url}
              onClick={onSelect}
              typeFilter={typeFilter}
              onTypesLoaded={registerTypes}
            />
          ))}
        </div>

        {hasMore && (
          <div ref={loaderRef} style={{ textAlign: 'center', padding: '32px', display: 'flex', justifyContent: 'center' }}>
            <div className="pokeball-loader" />
          </div>
        )}
      </div>
    </div>
  );
}

function PokemonCardWrapper({
  name, url, onClick, typeFilter, onTypesLoaded,
}: {
  name: string; url: string; onClick: (name: string) => void;
  typeFilter: string | null; onTypesLoaded: (name: string, types: string[]) => void;
}) {
  const { data } = useFetch<Pokemon>(url);

  useEffect(() => {
    if (data) onTypesLoaded(name, data.types.map(t => t.type.name));
  }, [data, name, onTypesLoaded]);

  if (typeFilter && data) {
    if (!data.types.map(t => t.type.name).includes(typeFilter)) return null;
  }

  return <PokemonCard name={name} url={url} onClick={onClick} />;
}
