import type { StoreFilters } from '../hooks/useStoreSearch'

interface StoreFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  filters: StoreFilters
  setFilter: (key: keyof StoreFilters, value: string) => void
  clearFilters: () => void
  availableCategories: string[]
  availableRegions: string[]
  availableCities: string[]
}

const selectStyle: React.CSSProperties = {
  width: '100%',
  background: '#1a1a1a',
  border: '1px solid #2a2a2a',
  color: '#fff',
  borderRadius: '8px',
  padding: '0.55rem 0.75rem',
  fontSize: '0.85rem',
}

export function StoreFilterDrawer({
  isOpen, onClose, filters, setFilter, clearFilters,
  availableCategories, availableRegions, availableCities,
}: StoreFilterDrawerProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        data-testid="store-filter-drawer-backdrop"
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 150,
          display: isOpen ? 'block' : 'none',
        }}
      />

      {/* Panel */}
      <div
        data-testid="store-filter-drawer"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 151,
          background: '#1e1e1e',
          borderTop: '1px solid #2a2a2a',
          borderRadius: '16px 16px 0 0',
          maxHeight: '80vh',
          overflowY: 'auto',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.25s ease',
        }}
      >
        <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#fff' }}>Filtros</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.78rem', color: '#aaa' }}>
            Categoría
            <select
              aria-label="Categoría"
              style={selectStyle}
              value={filters.category}
              onChange={e => setFilter('category', e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {availableCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>

          <label style={{ fontSize: '0.78rem', color: '#aaa' }}>
            Región
            <select
              aria-label="Región"
              style={selectStyle}
              value={filters.region}
              onChange={e => setFilter('region', e.target.value)}
            >
              <option value="">Todas las regiones</option>
              {availableRegions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </label>

          <label style={{ fontSize: '0.78rem', color: '#aaa' }}>
            Ciudad
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
          </label>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <button
            aria-label="Limpiar todo"
            onClick={clearFilters}
            style={{
              flex: 1,
              background: 'none',
              border: '1px solid #444',
              color: '#aaa',
              borderRadius: '8px',
              padding: '0.6rem',
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            Limpiar todo
          </button>
          <button
            aria-label="Aplicar filtros"
            onClick={onClose}
            style={{
              flex: 1,
              background: '#646cff',
              border: 'none',
              color: '#fff',
              borderRadius: '8px',
              padding: '0.6rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Aplicar
          </button>
        </div>
      </div>
    </>
  )
}
