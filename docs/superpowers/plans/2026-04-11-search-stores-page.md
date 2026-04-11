# Search Stores Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar el stub `/search-stores` con una página de búsqueda de tiendas completa: StoriesCarousel, filtros (nombre, categoría, región, ciudad), grid de cards ricas y paginación arriba y abajo del grid.

**Architecture:** El hook `useStoreSearch` gestiona todo el estado de filtros y paginación sobre 10 tiendas mock. `SearchStoresPage` orquesta: `StoreSearchBar` (desktop con selects / mobile con botón Filtros), `StoreFilterDrawer` (panel desde abajo mobile), `StoreCardFull` (card rica) y `PaginationBar` (dos veces). Sin filtro de precio ni de tienda.

**Tech Stack:** React 18 + TypeScript, Vite, Vitest + Testing Library, React Router v6, hook `useWindowWidth` en `src/shared/hooks/useWindowWidth.ts`.

---

## File Map

| Acción  | Archivo | Responsabilidad |
|---------|---------|-----------------|
| Create  | `src/buyer/data/storesMock.ts` | Tipo `StoreFull` + 10 tiendas mock |
| Create  | `src/buyer/hooks/useStoreSearch.ts` | Filtrado, paginación, listas disponibles |
| Create  | `src/buyer/hooks/useStoreSearch.test.ts` | Tests del hook |
| Create  | `src/buyer/components/StoreCardFull.tsx` | Card rica: portada, logo, badge, nombre, descripción, ubicación, rating, botón |
| Create  | `src/buyer/components/StoreCardFull.test.tsx` | Tests de la card |
| Create  | `src/buyer/components/StoreFilterDrawer.tsx` | Panel de filtros mobile (3 selects) |
| Create  | `src/buyer/components/StoreFilterDrawer.test.tsx` | Tests del drawer |
| Create  | `src/buyer/components/StoreSearchBar.tsx` | Barra de filtros desktop / mobile |
| Create  | `src/buyer/components/StoreSearchBar.test.tsx` | Tests de la barra |
| Modify  | `src/buyer/pages/SearchStoresPage.tsx` | Página completa que orquesta todo |
| Create  | `src/buyer/pages/SearchStoresPage.test.tsx` | Tests de integración |

---

## Task 1: Mock data y tipo `StoreFull`

**Files:**
- Create: `src/buyer/data/storesMock.ts`

- [ ] **Step 1: Crear el archivo con el tipo y las 10 tiendas**

```typescript
// src/buyer/data/storesMock.ts

export interface StoreFull {
  id: string
  name: string
  description: string
  coverImage: string
  logo: string
  badge: 'VERIFICADA' | 'NUEVA' | null
  category: string
  region: string
  city: string
  rating: number
  reviewCount: number
}

export const MOCK_STORES: StoreFull[] = [
  {
    id: '1',
    name: 'ModaUrbana',
    description: 'Ropa contemporánea para hombres y mujeres. Colecciones locales con diseñadores emergentes colombianos.',
    coverImage: 'https://picsum.photos/seed/store-moda/400/225',
    logo: 'https://picsum.photos/seed/logo-moda/40/40',
    badge: 'VERIFICADA',
    category: 'Ropa',
    region: 'Antioquia',
    city: 'Medellín',
    rating: 4.7,
    reviewCount: 312,
  },
  {
    id: '2',
    name: 'TechStore',
    description: 'Electrónica de consumo, accesorios y gadgets tecnológicos. Garantía oficial y soporte técnico en sitio.',
    coverImage: 'https://picsum.photos/seed/store-tech/400/225',
    logo: 'https://picsum.photos/seed/logo-tech/40/40',
    badge: 'VERIFICADA',
    category: 'Electrónica',
    region: 'Cundinamarca',
    city: 'Bogotá',
    rating: 4.9,
    reviewCount: 541,
  },
  {
    id: '3',
    name: 'CasaViva',
    description: 'Decoración, muebles y artículos para el hogar. Diseño moderno con materiales sostenibles.',
    coverImage: 'https://picsum.photos/seed/store-casa/400/225',
    logo: 'https://picsum.photos/seed/logo-casa/40/40',
    badge: 'VERIFICADA',
    category: 'Hogar',
    region: 'Valle del Cauca',
    city: 'Cali',
    rating: 4.5,
    reviewCount: 198,
  },
  {
    id: '4',
    name: 'SportMax',
    description: 'Equipamiento deportivo profesional y ropa técnica para atletismo, ciclismo y artes marciales.',
    coverImage: 'https://picsum.photos/seed/store-sport/400/225',
    logo: 'https://picsum.photos/seed/logo-sport/40/40',
    badge: 'NUEVA',
    category: 'Deportes',
    region: 'Antioquia',
    city: 'Medellín',
    rating: 4.3,
    reviewCount: 87,
  },
  {
    id: '5',
    name: 'GlowShop',
    description: 'Cosméticos, skincare y fragancias de marcas internacionales y locales. Asesoría personalizada.',
    coverImage: 'https://picsum.photos/seed/store-glow/400/225',
    logo: 'https://picsum.photos/seed/logo-glow/40/40',
    badge: 'VERIFICADA',
    category: 'Belleza',
    region: 'Cundinamarca',
    city: 'Bogotá',
    rating: 4.8,
    reviewCount: 427,
  },
  {
    id: '6',
    name: 'TechZone',
    description: 'Componentes de PC, periféricos gaming y soluciones de networking para hogar y empresa.',
    coverImage: 'https://picsum.photos/seed/store-zone/400/225',
    logo: 'https://picsum.photos/seed/logo-zone/40/40',
    badge: 'NUEVA',
    category: 'Electrónica',
    region: 'Antioquia',
    city: 'Envigado',
    rating: 4.1,
    reviewCount: 63,
  },
  {
    id: '7',
    name: 'EcoModa',
    description: 'Moda sostenible elaborada con fibras naturales y procesos de producción responsable.',
    coverImage: 'https://picsum.photos/seed/store-eco/400/225',
    logo: 'https://picsum.photos/seed/logo-eco/40/40',
    badge: 'VERIFICADA',
    category: 'Ropa',
    region: 'Valle del Cauca',
    city: 'Cali',
    rating: 4.6,
    reviewCount: 253,
  },
  {
    id: '8',
    name: 'HomePlus',
    description: 'Electrodomésticos, iluminación y soluciones de almacenamiento para optimizar tu espacio.',
    coverImage: 'https://picsum.photos/seed/store-home/400/225',
    logo: 'https://picsum.photos/seed/logo-home/40/40',
    badge: null,
    category: 'Hogar',
    region: 'Cundinamarca',
    city: 'Bogotá',
    rating: 4.2,
    reviewCount: 134,
  },
  {
    id: '9',
    name: 'RunnerPro',
    description: 'Especialistas en running y trail. Calzado técnico, nutrición deportiva y accesorios de entrenamiento.',
    coverImage: 'https://picsum.photos/seed/store-runner/400/225',
    logo: 'https://picsum.photos/seed/logo-runner/40/40',
    badge: 'VERIFICADA',
    category: 'Deportes',
    region: 'Valle del Cauca',
    city: 'Cali',
    rating: 4.4,
    reviewCount: 176,
  },
  {
    id: '10',
    name: 'BeautyLab',
    description: 'Tratamientos capilares, maquillaje profesional y cuidado de la piel con tecnología de punta.',
    coverImage: 'https://picsum.photos/seed/store-beauty/400/225',
    logo: 'https://picsum.photos/seed/logo-beauty/40/40',
    badge: null,
    category: 'Belleza',
    region: 'Antioquia',
    city: 'Medellín',
    rating: 4.7,
    reviewCount: 289,
  },
]
```

- [ ] **Step 2: Verificar TypeScript**

```bash
npx tsc --noEmit
```

Expected: sin errores.

- [ ] **Step 3: Commit**

```bash
git add src/buyer/data/storesMock.ts
git commit -m "feat: add StoreFull type and 10 mock stores"
```

---

## Task 2: Hook `useStoreSearch`

**Files:**
- Create: `src/buyer/hooks/useStoreSearch.ts`
- Create: `src/buyer/hooks/useStoreSearch.test.ts`

- [ ] **Step 1: Escribir los tests del hook**

```typescript
// src/buyer/hooks/useStoreSearch.test.ts
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useStoreSearch } from './useStoreSearch'

describe('useStoreSearch', () => {
  it('returns all 10 stores with no filters', () => {
    const { result } = renderHook(() => useStoreSearch())
    expect(result.current.filteredStores).toHaveLength(10)
  })

  it('filters by name (case insensitive)', () => {
    const { result } = renderHook(() => useStoreSearch())
    act(() => { result.current.setFilter('name', 'tech') })
    expect(result.current.filteredStores).toHaveLength(2)
    expect(result.current.filteredStores.every(s => s.name.toLowerCase().includes('tech'))).toBe(true)
  })

  it('filters by category', () => {
    const { result } = renderHook(() => useStoreSearch())
    act(() => { result.current.setFilter('category', 'Belleza') })
    expect(result.current.filteredStores).toHaveLength(2)
    expect(result.current.filteredStores.every(s => s.category === 'Belleza')).toBe(true)
  })

  it('filters by region', () => {
    const { result } = renderHook(() => useStoreSearch())
    act(() => { result.current.setFilter('region', 'Antioquia') })
    expect(result.current.filteredStores).toHaveLength(4)
  })

  it('filters by city', () => {
    const { result } = renderHook(() => useStoreSearch())
    act(() => { result.current.setFilter('city', 'Cali') })
    expect(result.current.filteredStores).toHaveLength(3)
  })

  it('resets city when region changes', () => {
    const { result } = renderHook(() => useStoreSearch())
    act(() => {
      result.current.setFilter('region', 'Antioquia')
      result.current.setFilter('city', 'Medellín')
    })
    act(() => { result.current.setFilter('region', 'Cundinamarca') })
    expect(result.current.filters.city).toBe('')
  })

  it('resets currentPage to 1 when filter changes', () => {
    const { result } = renderHook(() => useStoreSearch())
    act(() => { result.current.setPage(2) })
    act(() => { result.current.setFilter('category', 'Ropa') })
    expect(result.current.currentPage).toBe(1)
  })

  it('paginates correctly with pageSize 5', () => {
    const { result } = renderHook(() => useStoreSearch())
    act(() => { result.current.setPageSize(5) })
    expect(result.current.paginatedStores).toHaveLength(5)
    expect(result.current.totalPages).toBe(2)
  })

  it('activeFilterCount counts only category, region and city', () => {
    const { result } = renderHook(() => useStoreSearch())
    act(() => {
      result.current.setFilter('name', 'algo')       // no cuenta
      result.current.setFilter('category', 'Ropa')   // cuenta
      result.current.setFilter('region', 'Antioquia') // cuenta
    })
    expect(result.current.activeFilterCount).toBe(2)
  })

  it('clearFilters resets everything', () => {
    const { result } = renderHook(() => useStoreSearch())
    act(() => {
      result.current.setFilter('category', 'Ropa')
      result.current.setFilter('region', 'Antioquia')
    })
    act(() => { result.current.clearFilters() })
    expect(result.current.filteredStores).toHaveLength(10)
    expect(result.current.activeFilterCount).toBe(0)
    expect(result.current.filters.name).toBe('')
  })

  it('availableCategories returns unique sorted categories', () => {
    const { result } = renderHook(() => useStoreSearch())
    expect(result.current.availableCategories).toEqual([
      'Belleza', 'Deportes', 'Electrónica', 'Hogar', 'Ropa',
    ])
  })

  it('availableCities is filtered by active region', () => {
    const { result } = renderHook(() => useStoreSearch())
    act(() => { result.current.setFilter('region', 'Antioquia') })
    expect(result.current.availableCities).toEqual(['Envigado', 'Medellín'])
  })
})
```

- [ ] **Step 2: Ejecutar los tests — deben fallar**

```bash
npx vitest run src/buyer/hooks/useStoreSearch.test.ts
```

Expected: todos fallan con "Cannot find module".

- [ ] **Step 3: Implementar el hook**

```typescript
// src/buyer/hooks/useStoreSearch.ts
import { useState, useMemo } from 'react'
import { MOCK_STORES, type StoreFull } from '../data/storesMock'

export interface StoreFilters {
  name: string
  category: string
  region: string
  city: string
}

const INITIAL_FILTERS: StoreFilters = {
  name: '',
  category: '',
  region: '',
  city: '',
}

export function useStoreSearch() {
  const [filters, setFilters] = useState<StoreFilters>(INITIAL_FILTERS)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSizeState] = useState(10)

  function setFilter(key: keyof StoreFilters, value: string) {
    setFilters(prev => {
      const next = { ...prev, [key]: value }
      if (key === 'region') next.city = ''
      return next
    })
    setCurrentPage(1)
  }

  function setPage(page: number) {
    setCurrentPage(page)
  }

  function setPageSize(size: number) {
    setPageSizeState(size)
    setCurrentPage(1)
  }

  function clearFilters() {
    setFilters(INITIAL_FILTERS)
    setCurrentPage(1)
  }

  const filteredStores = useMemo(() => {
    let result: StoreFull[] = [...MOCK_STORES]

    if (filters.name.trim()) {
      const term = filters.name.trim().toLowerCase()
      result = result.filter(s => s.name.toLowerCase().includes(term))
    }
    if (filters.category) {
      result = result.filter(s => s.category === filters.category)
    }
    if (filters.region) {
      result = result.filter(s => s.region === filters.region)
    }
    if (filters.city) {
      result = result.filter(s => s.city === filters.city)
    }

    return result
  }, [filters])

  const totalPages = Math.max(1, Math.ceil(filteredStores.length / pageSize))

  const paginatedStores = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredStores.slice(start, start + pageSize)
  }, [filteredStores, currentPage, pageSize])

  const activeFilterCount = useMemo(() => {
    return (['category', 'region', 'city'] as const)
      .filter(k => filters[k] !== '').length
  }, [filters])

  const availableCategories = useMemo(() =>
    [...new Set(MOCK_STORES.map(s => s.category))].sort(), [])

  const availableRegions = useMemo(() =>
    [...new Set(MOCK_STORES.map(s => s.region))].sort(), [])

  const availableCities = useMemo(() => {
    const source = filters.region
      ? MOCK_STORES.filter(s => s.region === filters.region)
      : MOCK_STORES
    return [...new Set(source.map(s => s.city))].sort()
  }, [filters.region])

  return {
    filters,
    setFilter,
    filteredStores,
    paginatedStores,
    totalPages,
    currentPage,
    pageSize,
    setPage,
    setPageSize,
    activeFilterCount,
    clearFilters,
    availableCategories,
    availableRegions,
    availableCities,
  }
}
```

- [ ] **Step 4: Ejecutar los tests — deben pasar**

```bash
npx vitest run src/buyer/hooks/useStoreSearch.test.ts
```

Expected: 12 tests passed.

- [ ] **Step 5: Commit**

```bash
git add src/buyer/hooks/useStoreSearch.ts src/buyer/hooks/useStoreSearch.test.ts
git commit -m "feat: add useStoreSearch hook with filtering and pagination"
```

---

## Task 3: Componente `StoreCardFull`

**Files:**
- Create: `src/buyer/components/StoreCardFull.tsx`
- Create: `src/buyer/components/StoreCardFull.test.tsx`

- [ ] **Step 1: Escribir los tests**

```typescript
// src/buyer/components/StoreCardFull.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StoreCardFull } from './StoreCardFull'
import type { StoreFull } from '../data/storesMock'

const BASE_STORE: StoreFull = {
  id: '1',
  name: 'ModaUrbana',
  description: 'Ropa contemporánea para todos los estilos.',
  coverImage: 'https://picsum.photos/seed/test-cover/400/225',
  logo: 'https://picsum.photos/seed/test-logo/40/40',
  badge: 'VERIFICADA',
  category: 'Ropa',
  region: 'Antioquia',
  city: 'Medellín',
  rating: 4.7,
  reviewCount: 312,
}

describe('StoreCardFull', () => {
  it('renders store name', () => {
    render(<StoreCardFull {...BASE_STORE} />)
    expect(screen.getByText('ModaUrbana')).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<StoreCardFull {...BASE_STORE} />)
    expect(screen.getByText('Ropa contemporánea para todos los estilos.')).toBeInTheDocument()
  })

  it('renders city and region', () => {
    render(<StoreCardFull {...BASE_STORE} />)
    expect(screen.getByText(/Medellín/)).toBeInTheDocument()
    expect(screen.getByText(/Antioquia/)).toBeInTheDocument()
  })

  it('renders rating and review count', () => {
    render(<StoreCardFull {...BASE_STORE} />)
    expect(screen.getByText(/4\.7/)).toBeInTheDocument()
    expect(screen.getByText(/312/)).toBeInTheDocument()
  })

  it('renders "Ver tienda" button', () => {
    render(<StoreCardFull {...BASE_STORE} />)
    expect(screen.getByRole('button', { name: /ver tienda/i })).toBeInTheDocument()
  })

  it('renders VERIFICADA badge when badge is VERIFICADA', () => {
    render(<StoreCardFull {...BASE_STORE} badge="VERIFICADA" />)
    expect(screen.getByText('VERIFICADA')).toBeInTheDocument()
  })

  it('renders NUEVA badge when badge is NUEVA', () => {
    render(<StoreCardFull {...BASE_STORE} badge="NUEVA" />)
    expect(screen.getByText('NUEVA')).toBeInTheDocument()
  })

  it('does not render badge when badge is null', () => {
    render(<StoreCardFull {...BASE_STORE} badge={null} />)
    expect(screen.queryByText('VERIFICADA')).not.toBeInTheDocument()
    expect(screen.queryByText('NUEVA')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Ejecutar los tests — deben fallar**

```bash
npx vitest run src/buyer/components/StoreCardFull.test.tsx
```

Expected: todos fallan con "Cannot find module".

- [ ] **Step 3: Implementar el componente**

```tsx
// src/buyer/components/StoreCardFull.tsx
import type { StoreFull } from '../data/storesMock'

const BADGE_COLORS: Record<'VERIFICADA' | 'NUEVA', { bg: string; color: string }> = {
  VERIFICADA: { bg: '#a3e635', color: '#1a1a1a' },
  NUEVA:      { bg: '#646cff', color: '#fff' },
}

export function StoreCardFull({
  name, description, coverImage, logo, badge,
  region, city, rating, reviewCount,
}: StoreFull) {
  return (
    <div
      style={{
        background: '#1e1e1e',
        borderRadius: '12px',
        border: '1px solid #2a2a2a',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Portada */}
      <div style={{ aspectRatio: '16/9', overflow: 'hidden', background: '#111', position: 'relative' }}>
        <img
          src={coverImage}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />

        {/* Logo */}
        <img
          src={logo}
          alt=""
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: '2px solid #646cff',
            objectFit: 'cover',
            background: '#222',
          }}
        />

        {/* Badge */}
        {badge && (
          <span
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: BADGE_COLORS[badge].bg,
              color: BADGE_COLORS[badge].color,
              fontWeight: 700,
              fontSize: '0.65rem',
              padding: '0.2rem 0.5rem',
              borderRadius: '999px',
            }}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Contenido */}
      <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
        {/* Nombre */}
        <p
          style={{
            margin: 0,
            fontWeight: 700,
            fontSize: '0.9rem',
            color: '#fff',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {name}
        </p>

        {/* Descripción */}
        <p
          style={{
            margin: 0,
            fontSize: '0.75rem',
            color: '#aaa',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {description}
        </p>

        {/* Ubicación */}
        <p style={{ margin: 0, fontSize: '0.73rem', color: '#888' }}>
          📍 {city}, {region}
        </p>

        {/* Rating */}
        <p style={{ margin: 0, fontSize: '0.75rem', color: '#f59e0b' }}>
          ⭐ {rating} <span style={{ color: '#888' }}>({reviewCount} reseñas)</span>
        </p>

        {/* Botón */}
        <button
          style={{
            marginTop: 'auto',
            width: '100%',
            padding: '0.5rem',
            background: '#646cff',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
        >
          Ver tienda
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Ejecutar los tests — deben pasar**

```bash
npx vitest run src/buyer/components/StoreCardFull.test.tsx
```

Expected: 8 tests passed.

- [ ] **Step 5: Commit**

```bash
git add src/buyer/components/StoreCardFull.tsx src/buyer/components/StoreCardFull.test.tsx
git commit -m "feat: add StoreCardFull component with badge, logo, rating"
```

---

## Task 4: Componente `StoreFilterDrawer`

**Files:**
- Create: `src/buyer/components/StoreFilterDrawer.tsx`
- Create: `src/buyer/components/StoreFilterDrawer.test.tsx`

- [ ] **Step 1: Escribir los tests**

```typescript
// src/buyer/components/StoreFilterDrawer.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StoreFilterDrawer } from './StoreFilterDrawer'
import type { StoreFilters } from '../hooks/useStoreSearch'

const BASE_FILTERS: StoreFilters = {
  name: '', category: '', region: '', city: '',
}

const BASE_PROPS = {
  isOpen: true,
  onClose: vi.fn(),
  filters: BASE_FILTERS,
  setFilter: vi.fn(),
  clearFilters: vi.fn(),
  availableCategories: ['Belleza', 'Ropa'],
  availableRegions: ['Antioquia', 'Cundinamarca'],
  availableCities: ['Bogotá', 'Medellín'],
}

describe('StoreFilterDrawer', () => {
  it('is hidden when isOpen is false', () => {
    render(<StoreFilterDrawer {...BASE_PROPS} isOpen={false} />)
    expect(screen.getByTestId('store-filter-drawer')).toHaveStyle({ transform: 'translateY(100%)' })
  })

  it('is visible when isOpen is true', () => {
    render(<StoreFilterDrawer {...BASE_PROPS} isOpen={true} />)
    expect(screen.getByTestId('store-filter-drawer')).toHaveStyle({ transform: 'translateY(0)' })
  })

  it('renders Filtros title', () => {
    render(<StoreFilterDrawer {...BASE_PROPS} />)
    expect(screen.getByText('Filtros')).toBeInTheDocument()
  })

  it('renders 3 selects: categoría, región, ciudad', () => {
    render(<StoreFilterDrawer {...BASE_PROPS} />)
    expect(screen.getByRole('combobox', { name: /categoría/i })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /región/i })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /ciudad/i })).toBeInTheDocument()
  })

  it('calls onClose when backdrop is clicked', async () => {
    const onClose = vi.fn()
    render(<StoreFilterDrawer {...BASE_PROPS} onClose={onClose} />)
    await userEvent.click(screen.getByTestId('store-filter-drawer-backdrop'))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when Aplicar button is clicked', async () => {
    const onClose = vi.fn()
    render(<StoreFilterDrawer {...BASE_PROPS} onClose={onClose} />)
    await userEvent.click(screen.getByRole('button', { name: /aplicar/i }))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls clearFilters when Limpiar todo is clicked', async () => {
    const clearFilters = vi.fn()
    render(<StoreFilterDrawer {...BASE_PROPS} clearFilters={clearFilters} />)
    await userEvent.click(screen.getByRole('button', { name: /limpiar todo/i }))
    expect(clearFilters).toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Ejecutar los tests — deben fallar**

```bash
npx vitest run src/buyer/components/StoreFilterDrawer.test.tsx
```

Expected: todos fallan con "Cannot find module".

- [ ] **Step 3: Implementar el componente**

```tsx
// src/buyer/components/StoreFilterDrawer.tsx
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
```

- [ ] **Step 4: Ejecutar los tests — deben pasar**

```bash
npx vitest run src/buyer/components/StoreFilterDrawer.test.tsx
```

Expected: 7 tests passed.

- [ ] **Step 5: Commit**

```bash
git add src/buyer/components/StoreFilterDrawer.tsx src/buyer/components/StoreFilterDrawer.test.tsx
git commit -m "feat: add StoreFilterDrawer component for mobile filters"
```

---

## Task 5: Componente `StoreSearchBar`

**Files:**
- Create: `src/buyer/components/StoreSearchBar.tsx`
- Create: `src/buyer/components/StoreSearchBar.test.tsx`

- [ ] **Step 1: Escribir los tests**

```typescript
// src/buyer/components/StoreSearchBar.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StoreSearchBar } from './StoreSearchBar'
import type { StoreFilters } from '../hooks/useStoreSearch'

const BASE_FILTERS: StoreFilters = {
  name: '', category: '', region: '', city: '',
}

const BASE_PROPS = {
  filters: BASE_FILTERS,
  setFilter: vi.fn(),
  activeFilterCount: 0,
  onOpenFilterDrawer: vi.fn(),
  clearFilters: vi.fn(),
  availableCategories: ['Belleza', 'Ropa'],
  availableRegions: ['Antioquia', 'Cundinamarca'],
  availableCities: ['Bogotá', 'Medellín'],
}

describe('StoreSearchBar - desktop', () => {
  const originalWidth = window.innerWidth

  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 800 })
  })

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: originalWidth })
    vi.clearAllMocks()
  })

  it('renders name input on desktop', () => {
    render(<StoreSearchBar {...BASE_PROPS} />)
    expect(screen.getByPlaceholderText(/buscar por nombre/i)).toBeInTheDocument()
  })

  it('renders category select on desktop', () => {
    render(<StoreSearchBar {...BASE_PROPS} />)
    expect(screen.getByRole('combobox', { name: /categoría/i })).toBeInTheDocument()
  })

  it('renders region select on desktop', () => {
    render(<StoreSearchBar {...BASE_PROPS} />)
    expect(screen.getByRole('combobox', { name: /región/i })).toBeInTheDocument()
  })

  it('does not render Filtros button on desktop', () => {
    render(<StoreSearchBar {...BASE_PROPS} />)
    expect(screen.queryByRole('button', { name: /filtros/i })).not.toBeInTheDocument()
  })

  it('calls setFilter with name value on input change', async () => {
    const setFilter = vi.fn()
    render(<StoreSearchBar {...BASE_PROPS} setFilter={setFilter} />)
    await userEvent.type(screen.getByPlaceholderText(/buscar por nombre/i), 'tec')
    expect(setFilter).toHaveBeenCalledWith('name', expect.stringContaining('t'))
  })

  it('shows Limpiar button when activeFilterCount > 0', () => {
    render(<StoreSearchBar {...BASE_PROPS} activeFilterCount={2} />)
    expect(screen.getByRole('button', { name: /limpiar/i })).toBeInTheDocument()
  })

  it('hides Limpiar button when no active filters and name is empty', () => {
    render(<StoreSearchBar {...BASE_PROPS} activeFilterCount={0} filters={{ ...BASE_FILTERS, name: '' }} />)
    expect(screen.queryByRole('button', { name: /limpiar/i })).not.toBeInTheDocument()
  })
})

describe('StoreSearchBar - mobile', () => {
  const originalWidth = window.innerWidth

  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 375 })
  })

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: originalWidth })
    vi.clearAllMocks()
  })

  it('renders Filtros button on mobile', () => {
    render(<StoreSearchBar {...BASE_PROPS} />)
    expect(screen.getByRole('button', { name: /filtros/i })).toBeInTheDocument()
  })

  it('does not render category select on mobile', () => {
    render(<StoreSearchBar {...BASE_PROPS} />)
    expect(screen.queryByRole('combobox', { name: /categoría/i })).not.toBeInTheDocument()
  })

  it('calls onOpenFilterDrawer when Filtros button clicked', async () => {
    const onOpenFilterDrawer = vi.fn()
    render(<StoreSearchBar {...BASE_PROPS} onOpenFilterDrawer={onOpenFilterDrawer} />)
    await userEvent.click(screen.getByRole('button', { name: /filtros/i }))
    expect(onOpenFilterDrawer).toHaveBeenCalled()
  })

  it('shows badge count on Filtros button when activeFilterCount > 0', () => {
    render(<StoreSearchBar {...BASE_PROPS} activeFilterCount={3} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Ejecutar los tests — deben fallar**

```bash
npx vitest run src/buyer/components/StoreSearchBar.test.tsx
```

Expected: todos fallan con "Cannot find module".

- [ ] **Step 3: Implementar el componente**

```tsx
// src/buyer/components/StoreSearchBar.tsx
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
```

- [ ] **Step 4: Ejecutar los tests — deben pasar**

```bash
npx vitest run src/buyer/components/StoreSearchBar.test.tsx
```

Expected: 11 tests passed.

- [ ] **Step 5: Commit**

```bash
git add src/buyer/components/StoreSearchBar.tsx src/buyer/components/StoreSearchBar.test.tsx
git commit -m "feat: add StoreSearchBar component (desktop + mobile)"
```

---

## Task 6: `SearchStoresPage` — página completa

**Files:**
- Modify: `src/buyer/pages/SearchStoresPage.tsx`
- Create: `src/buyer/pages/SearchStoresPage.test.tsx`

- [ ] **Step 1: Escribir los tests de la página**

```typescript
// src/buyer/pages/SearchStoresPage.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { SearchStoresPage } from './SearchStoresPage'

describe('SearchStoresPage', () => {
  it('renders the welcome title', () => {
    render(<MemoryRouter><SearchStoresPage /></MemoryRouter>)
    expect(
      screen.getByRole('heading', { name: /bienvenido al área de búsqueda de tiendas/i })
    ).toBeInTheDocument()
  })

  it('renders store cards (10 by default)', () => {
    render(<MemoryRouter><SearchStoresPage /></MemoryRouter>)
    const buttons = screen.getAllByRole('button', { name: /ver tienda/i })
    expect(buttons.length).toBe(10)
  })

  it('renders two PaginationBar elements', () => {
    render(<MemoryRouter><SearchStoresPage /></MemoryRouter>)
    expect(screen.getAllByTestId('pagination-bar')).toHaveLength(2)
  })

  it('does not show empty state initially', () => {
    render(<MemoryRouter><SearchStoresPage /></MemoryRouter>)
    expect(screen.queryByText(/no encontramos tiendas/i)).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Ejecutar los tests — deben fallar**

```bash
npx vitest run src/buyer/pages/SearchStoresPage.test.tsx
```

Expected: fallan porque `SearchStoresPage` sigue siendo el stub.

- [ ] **Step 3: Reemplazar `SearchStoresPage` con la implementación completa**

```tsx
// src/buyer/pages/SearchStoresPage.tsx
import { useState } from 'react'
import { StoriesCarousel } from '../components/StoriesCarousel'
import { StoreSearchBar } from '../components/StoreSearchBar'
import { StoreFilterDrawer } from '../components/StoreFilterDrawer'
import { StoreCardFull } from '../components/StoreCardFull'
import { PaginationBar } from '../components/PaginationBar'
import { useStoreSearch } from '../hooks/useStoreSearch'
import { useWindowWidth } from '../../shared/hooks/useWindowWidth'

export function SearchStoresPage() {
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)
  const width = useWindowWidth()
  const isMobile = width < 640
  const isTablet = width >= 640 && width < 1024
  const gridColumns = width >= 1024 ? 4 : isTablet ? 3 : 2

  const {
    filters, setFilter, filteredStores, paginatedStores,
    totalPages, currentPage, pageSize, setPage, setPageSize,
    activeFilterCount, clearFilters,
    availableCategories, availableRegions, availableCities,
  } = useStoreSearch()

  return (
    <>
      <StoriesCarousel />

      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: isMobile ? '1rem' : '1.5rem',
        }}
      >
        <h1
          style={{
            fontSize: isMobile ? '1.2rem' : '1.5rem',
            fontWeight: 700,
            color: '#fff',
            margin: '0 0 0.4rem',
          }}
        >
          Bienvenido al área de búsqueda de tiendas
        </h1>
        <p style={{ color: '#aaa', fontSize: '0.85rem', margin: '0 0 1rem' }}>
          Encuentra las mejores tiendas verificadas cerca de ti.
        </p>

        <StoreSearchBar
          filters={filters}
          setFilter={setFilter}
          activeFilterCount={activeFilterCount}
          onOpenFilterDrawer={() => setIsFilterDrawerOpen(true)}
          clearFilters={clearFilters}
          availableCategories={availableCategories}
          availableRegions={availableRegions}
          availableCities={availableCities}
        />

        {filteredStores.length === 0 ? (
          <p style={{ color: '#aaa', textAlign: 'center', padding: '2rem 0' }}>
            No encontramos tiendas con esos filtros.
          </p>
        ) : (
          <>
            <PaginationBar
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
                gap: '0.75rem',
                margin: '0.5rem 0',
              }}
            >
              {paginatedStores.map(store => (
                <StoreCardFull key={store.id} {...store} />
              ))}
            </div>

            <PaginationBar
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </>
        )}
      </div>

      <StoreFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        setFilter={setFilter}
        clearFilters={clearFilters}
        availableCategories={availableCategories}
        availableRegions={availableRegions}
        availableCities={availableCities}
      />
    </>
  )
}
```

- [ ] **Step 4: Ejecutar los tests de la página — deben pasar**

```bash
npx vitest run src/buyer/pages/SearchStoresPage.test.tsx
```

Expected: 4 tests passed.

- [ ] **Step 5: Ejecutar toda la suite**

```bash
npx vitest run
```

Expected: todos los tests pasan sin regresiones.

- [ ] **Step 6: Verificar build TypeScript**

```bash
npx tsc --noEmit
```

Expected: sin errores.

- [ ] **Step 7: Commit final**

```bash
git add src/buyer/pages/SearchStoresPage.tsx src/buyer/pages/SearchStoresPage.test.tsx
git commit -m "feat: implement SearchStoresPage with filters, cards and pagination"
```
