import type { PokemonTypeName } from '../types/pokemon';

// bg  = badge background, text = badge label, pill = transparent pill variant color
export const TYPE_COLORS: Record<PokemonTypeName | string, { bg: string; text: string; glow: string; pill: string }> = {
  normal:   { bg: '#a8a878', text: '#fff',    glow: 'transparent', pill: '#a8a87820' },
  fire:     { bg: '#f08030', text: '#fff',    glow: 'transparent', pill: '#f0803020' },
  water:    { bg: '#6890f0', text: '#fff',    glow: 'transparent', pill: '#6890f020' },
  electric: { bg: '#f8c800', text: '#1e293b', glow: 'transparent', pill: '#f8c80020' },
  grass:    { bg: '#78c850', text: '#fff',    glow: 'transparent', pill: '#78c85020' },
  ice:      { bg: '#98d8d8', text: '#1e293b', glow: 'transparent', pill: '#98d8d820' },
  fighting: { bg: '#c03028', text: '#fff',    glow: 'transparent', pill: '#c0302820' },
  poison:   { bg: '#a040a0', text: '#fff',    glow: 'transparent', pill: '#a040a020' },
  ground:   { bg: '#e0c068', text: '#1e293b', glow: 'transparent', pill: '#e0c06820' },
  flying:   { bg: '#a890f0', text: '#fff',    glow: 'transparent', pill: '#a890f020' },
  psychic:  { bg: '#f85888', text: '#fff',    glow: 'transparent', pill: '#f8588820' },
  bug:      { bg: '#a8b820', text: '#fff',    glow: 'transparent', pill: '#a8b82020' },
  rock:     { bg: '#b8a038', text: '#fff',    glow: 'transparent', pill: '#b8a03820' },
  ghost:    { bg: '#705898', text: '#fff',    glow: 'transparent', pill: '#70589820' },
  dragon:   { bg: '#7038f8', text: '#fff',    glow: 'transparent', pill: '#7038f820' },
  dark:     { bg: '#705848', text: '#fff',    glow: 'transparent', pill: '#70584820' },
  steel:    { bg: '#b8b8d0', text: '#1e293b', glow: 'transparent', pill: '#b8b8d020' },
  fairy:    { bg: '#ee99ac', text: '#fff',    glow: 'transparent', pill: '#ee99ac20' },
  stellar:  { bg: '#40b5a8', text: '#fff',    glow: 'transparent', pill: '#40b5a820' },
  unknown:  { bg: '#68a090', text: '#fff',    glow: 'transparent', pill: '#68a09020' },
};

export const STAT_COLORS: Record<string, string> = {
  hp:               '#ef4444',
  attack:           '#f97316',
  defense:          '#eab308',
  'special-attack': '#3b82f6',
  'special-defense':'#22c55e',
  speed:            '#ec4899',
};

export const STAT_LABELS: Record<string, string> = {
  hp:               'HP',
  attack:           'ATK',
  defense:          'DEF',
  'special-attack': 'SP.ATK',
  'special-defense':'SP.DEF',
  speed:            'SPD',
};

export function getTypeColor(type: string) {
  return TYPE_COLORS[type] ?? TYPE_COLORS['unknown'];
}

export function formatName(name: string): string {
  return name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function padId(id: number): string {
  return `#${String(id).padStart(4, '0')}`;
}

export function extractIdFromUrl(url: string): number {
  const parts = url.split('/').filter(Boolean);
  return parseInt(parts[parts.length - 1], 10);
}
