import { useWindowWidth } from '../../shared/hooks/useWindowWidth'
import type { StoreFilters } from '../hooks/useStoreSearch'

interface StoreSearchBarProps {
  filters: StoreFilters
  setFilter: (key: keyof StoreFilters, value: string) => void
  activeFilterCount: number
  onOpenFilterDrawer: () => void
  clearFilters: () => void
  availableCategories: string[]
  availableRegions: string[]
  availableCities: string[]
}

const selectStyle: React.CSSProperties = {
  background: '#1a1a1a',
  border: '1px solid #2a2a2a',
  color: '#fff',
  borderRadius: '8px',
  padding: '0.45rem 0.6rem',
  fontSize: '0.82rem',
  cursor: 'pointer',
  minWidth: '120px',
}

const inputStyle: React.CSSProperties = {
  background: '#1a1a1a',
  border: '1px solid #2a2a2a',
  color: '#fff',
  borderRadius: '8px',
  padding: '0.45rem 0.75rem',
  fontSize: '0.85rem',
  outline: 'none',
  flex: 1,
  minWidth: 0,
}

export function StoreSearchBar({
  filters, setFilter, activeFilterCount, onOpenFilterDrawer,
  clearFilters, availableCategories, availableRegions, availableCities,
}: StoreSearchBarProps) {
  const width = useWindowWidth()
  const isMobile = width < 640
  const showClear = activeFilterCount > 0 || filters.name !== ''

  if (isMobile) {
    return (
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem' }}>
        <input
          style={inputStyle}
          placeholder="Buscar por nombre..."
          value={filters.name}
          onChange={e => setFilter('name', e.target.value)}
        />
        <button
          aria-label={`Filtros${activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}`}
          onClick={onOpenFilterDrawer}
          style={{
            background: '#1a1a1a',
            border: '1px solid #2a2a2a',
            color: '#fff',
            borderRadius: '8px',
            padding: '0.45rem 0.75rem',
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            flexShrink: 0,
          }}
        >
          ⚙ Filtros
          {activeFilterCount > 0 && (
            <span
              style={{
                background: '#646cff',
                color: '#fff',
                borderRadius: '999px',
                fontSize: '0.65rem',
                fontWeight: 700,
                minWidth: '16px',
                height: '16px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 4px',
              }}
            >
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
      <input
        style={inputStyle}
        placeholder="Buscar por nombre..."
        value={filters.name}
        onChange={e => setFilter('name', e.target.value)}
      />

      <select
        aria-label="Categoría"
        style={selectStyle}
        value={filters.category}
        onChange={e => setFilter('category', e.target.value)}
      >
        <option value="">Todas las categorías</option>
        {availableCategories.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      <select
        aria-label="Región"
        style={selectStyle}
        value={filters.region}
        onChange={e => setFilter('region', e.target.value)}
      >
        <option value="">Todas las regiones</option>
        {availableRegions.map(r => <option key={r} value={r}>{r}</option>)}
      </select>

      <select
        aria-label="Ciudad"
        style={selectStyle}
        value={filters.city}
        onChange={e => setFilter('city', e.target.value)}
        disabled={!filters.region}
      >
        <option value="">Todas las ciudades</option>
        {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      {showClear && (
        <button
          aria-label="Limpiar filtros"
          onClick={clearFilters}
          style={{
            background: 'none',
            border: '1px solid #444',
            color: '#aaa',
            borderRadius: '8px',
            padding: '0.45rem 0.75rem',
            fontSize: '0.82rem',
            cursor: 'pointer',
          }}
        >
          Limpiar
        </button>
      )}
    </div>
  )
}
