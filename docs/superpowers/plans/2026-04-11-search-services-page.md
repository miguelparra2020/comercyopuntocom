# Search Services Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar el stub `/search-services` con una página de búsqueda de servicios completa: StoriesCarousel, filtros (nombre, categoría, región, ciudad, precio, tienda), grid de cards ricas y paginación arriba y abajo del grid.

**Architecture:** Mirror exacto del patrón `/search-products`. El hook `useServiceSearch` gestiona todo el estado de filtros y paginación sobre 10 servicios mock. `SearchServicesPage` orquesta: `ServiceSearchBar`, `ServiceFilterDrawer`, `ServiceCardFull` y `PaginationBar` (dos veces). La única diferencia visual con productos es el botón "Contratar" y las categorías de servicio.

**Tech Stack:** React 18 + TypeScript, Vite, Vitest + Testing Library, React Router v6, hook `useWindowWidth` en `src/shared/hooks/useWindowWidth.ts`.

---

## File Map

| Acción  | Archivo | Responsabilidad |
|---------|---------|-----------------|
| Create  | `src/buyer/data/servicesMock.ts` | Tipo `ServiceFull` + 10 servicios mock |
| Create  | `src/buyer/hooks/useServiceSearch.ts` | Filtrado, paginación, listas disponibles |
| Create  | `src/buyer/hooks/useServiceSearch.test.ts` | Tests del hook |
| Create  | `src/buyer/components/ServiceCardFull.tsx` | Card rica: imagen 1:1, badge, precio, tienda, ubicación, rating, botón "Contratar" |
| Create  | `src/buyer/components/ServiceCardFull.test.tsx` | Tests de la card |
| Create  | `src/buyer/components/ServiceFilterDrawer.tsx` | Panel de filtros mobile desde abajo (5 selects) |
| Create  | `src/buyer/components/ServiceFilterDrawer.test.tsx` | Tests del drawer |
| Create  | `src/buyer/components/ServiceSearchBar.tsx` | Barra de filtros desktop / mobile |
| Create  | `src/buyer/components/ServiceSearchBar.test.tsx` | Tests de la barra |
| Modify  | `src/buyer/pages/SearchServicesPage.tsx` | Página completa que orquesta todo |
| Create  | `src/buyer/pages/SearchServicesPage.test.tsx` | Tests de integración |

---

## Task 1: Mock data y tipo `ServiceFull`

**Files:**
- Create: `src/buyer/data/servicesMock.ts`

- [ ] **Step 1: Crear el archivo con el tipo y los 10 servicios**

```typescript
// src/buyer/data/servicesMock.ts

export interface ServiceFull {
  id: string
  name: string
  description: string
  price: number
  image: string
  badge: 'NUEVO' | 'OFERTA' | null
  category: string
  region: string
  city: string
  store: {
    name: string
    icon: string
  }
  rating: number
  reviewCount: number
}

export const MOCK_SERVICES: ServiceFull[] = [
  {
    id: '1',
    name: 'Diseño de Logo Profesional',
    description: 'Creación de logotipo vectorial con manual de marca, paleta de colores y tipografías.',
    price: 450000,
    image: 'https://picsum.photos/seed/svc-logo/300/300',
    badge: 'NUEVO',
    category: 'Diseño',
    region: 'Antioquia',
    city: 'Medellín',
    store: { name: 'DesignHub', icon: 'https://picsum.photos/seed/icon-designhub/40/40' },
    rating: 4.8,
    reviewCount: 94,
  },
  {
    id: '2',
    name: 'Sesión Fotográfica de Producto',
    description: 'Fotografía profesional de productos para e-commerce, fondo blanco y edición incluida.',
    price: 350000,
    image: 'https://picsum.photos/seed/svc-photo/300/300',
    badge: null,
    category: 'Fotografía',
    region: 'Cundinamarca',
    city: 'Bogotá',
    store: { name: 'PhotoPro', icon: 'https://picsum.photos/seed/icon-photopro/40/40' },
    rating: 4.6,
    reviewCount: 132,
  },
  {
    id: '3',
    name: 'Desarrollo Web React',
    description: 'Desarrollo de aplicaciones web modernas con React, TypeScript y backend en Node.js.',
    price: 2500000,
    image: 'https://picsum.photos/seed/svc-web/300/300',
    badge: 'OFERTA',
    category: 'Programación',
    region: 'Cundinamarca',
    city: 'Bogotá',
    store: { name: 'TechSolutions', icon: 'https://picsum.photos/seed/icon-techsol/40/40' },
    rating: 4.9,
    reviewCount: 217,
  },
  {
    id: '4',
    name: 'Limpieza de Hogar 4 Horas',
    description: 'Servicio de limpieza residencial profunda: sala, habitaciones, cocina y baños.',
    price: 120000,
    image: 'https://picsum.photos/seed/svc-clean/300/300',
    badge: null,
    category: 'Limpieza',
    region: 'Valle del Cauca',
    city: 'Cali',
    store: { name: 'CleanCo', icon: 'https://picsum.photos/seed/icon-cleanco/40/40' },
    rating: 4.4,
    reviewCount: 308,
  },
  {
    id: '5',
    name: 'Reparación de Tuberías',
    description: 'Diagnóstico y reparación de fugas, instalación de llaves y mantenimiento preventivo.',
    price: 180000,
    image: 'https://picsum.photos/seed/svc-plumb/300/300',
    badge: 'NUEVO',
    category: 'Plomería',
    region: 'Antioquia',
    city: 'Medellín',
    store: { name: 'FixIt', icon: 'https://picsum.photos/seed/icon-fixit/40/40' },
    rating: 4.3,
    reviewCount: 76,
  },
  {
    id: '6',
    name: 'Diseño de Identidad Corporativa',
    description: 'Branding completo: logo, papelería, guía de estilos y plantillas digitales.',
    price: 1200000,
    image: 'https://picsum.photos/seed/svc-brand/300/300',
    badge: null,
    category: 'Diseño',
    region: 'Antioquia',
    city: 'Envigado',
    store: { name: 'DesignHub', icon: 'https://picsum.photos/seed/icon-designhub/40/40' },
    rating: 4.7,
    reviewCount: 58,
  },
  {
    id: '7',
    name: 'Fotografía de Eventos',
    description: 'Cobertura fotográfica de eventos corporativos, bodas y celebraciones. 6 horas mínimo.',
    price: 800000,
    image: 'https://picsum.photos/seed/svc-event/300/300',
    badge: 'OFERTA',
    category: 'Fotografía',
    region: 'Valle del Cauca',
    city: 'Cali',
    store: { name: 'PhotoPro', icon: 'https://picsum.photos/seed/icon-photopro/40/40' },
    rating: 4.8,
    reviewCount: 185,
  },
  {
    id: '8',
    name: 'App Mobile Android e iOS',
    description: 'Desarrollo de aplicación móvil multiplataforma con React Native, diseño UI/UX incluido.',
    price: 4500000,
    image: 'https://picsum.photos/seed/svc-app/300/300',
    badge: null,
    category: 'Programación',
    region: 'Cundinamarca',
    city: 'Bogotá',
    store: { name: 'TechSolutions', icon: 'https://picsum.photos/seed/icon-techsol/40/40' },
    rating: 4.9,
    reviewCount: 143,
  },
  {
    id: '9',
    name: 'Limpieza Post-Obra',
    description: 'Limpieza especializada tras remodelación: remoción de escombros, polvo y acabados.',
    price: 250000,
    image: 'https://picsum.photos/seed/svc-postwork/300/300',
    badge: 'OFERTA',
    category: 'Limpieza',
    region: 'Antioquia',
    city: 'Medellín',
    store: { name: 'CleanCo', icon: 'https://picsum.photos/seed/icon-cleanco/40/40' },
    rating: 4.5,
    reviewCount: 221,
  },
  {
    id: '10',
    name: 'Instalación Sanitaria Completa',
    description: 'Instalación de sanitarios, lavamanos, duchas y sistema de desagüe para baños nuevos.',
    price: 320000,
    image: 'https://picsum.photos/seed/svc-sanit/300/300',
    badge: null,
    category: 'Plomería',
    region: 'Valle del Cauca',
    city: 'Cali',
    store: { name: 'FixIt', icon: 'https://picsum.photos/seed/icon-fixit/40/40' },
    rating: 4.2,
    reviewCount: 89,
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
git add src/buyer/data/servicesMock.ts
git commit -m "feat: add ServiceFull type and 10 mock services"
```

---

## Task 2: Hook `useServiceSearch`

**Files:**
- Create: `src/buyer/hooks/useServiceSearch.ts`
- Create: `src/buyer/hooks/useServiceSearch.test.ts`

- [ ] **Step 1: Escribir los tests del hook**

```typescript
// src/buyer/hooks/useServiceSearch.test.ts
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useServiceSearch } from './useServiceSearch'

describe('useServiceSearch', () => {
  it('returns all 10 services with no filters', () => {
    const { result } = renderHook(() => useServiceSearch())
    expect(result.current.filteredServices).toHaveLength(10)
  })

  it('filters by name (case insensitive)', () => {
    const { result } = renderHook(() => useServiceSearch())
    act(() => { result.current.setFilter('name', 'diseño') })
    expect(result.current.filteredServices).toHaveLength(2)
    expect(result.current.filteredServices.every(s => s.name.toLowerCase().includes('diseño'))).toBe(true)
  })

  it('filters by category', () => {
    const { result } = renderHook(() => useServiceSearch())
    act(() => { result.current.setFilter('category', 'Fotografía') })
    expect(result.current.filteredServices).toHaveLength(2)
    expect(result.current.filteredServices.every(s => s.category === 'Fotografía')).toBe(true)
  })

  it('filters by region', () => {
    const { result } = renderHook(() => useServiceSearch())
    act(() => { result.current.setFilter('region', 'Antioquia') })
    expect(result.current.filteredServices).toHaveLength(4)
  })

  it('filters by city', () => {
    const { result } = renderHook(() => useServiceSearch())
    act(() => { result.current.setFilter('city', 'Cali') })
    expect(result.current.filteredServices).toHaveLength(3)
  })

  it('filters by store', () => {
    const { result } = renderHook(() => useServiceSearch())
    act(() => { result.current.setFilter('store', 'TechSolutions') })
    expect(result.current.filteredServices).toHaveLength(2)
  })

  it('sorts by price asc', () => {
    const { result } = renderHook(() => useServiceSearch())
    act(() => { result.current.setFilter('priceSort', 'asc') })
    const prices = result.current.filteredServices.map(s => s.price)
    expect(prices).toEqual([...prices].sort((a, b) => a - b))
  })

  it('sorts by price desc', () => {
    const { result } = renderHook(() => useServiceSearch())
    act(() => { result.current.setFilter('priceSort', 'desc') })
    const prices = result.current.filteredServices.map(s => s.price)
    expect(prices).toEqual([...prices].sort((a, b) => b - a))
  })

  it('resets city when region changes', () => {
    const { result } = renderHook(() => useServiceSearch())
    act(() => {
      result.current.setFilter('region', 'Antioquia')
      result.current.setFilter('city', 'Medellín')
    })
    act(() => { result.current.setFilter('region', 'Cundinamarca') })
    expect(result.current.filters.city).toBe('')
  })

  it('resets currentPage to 1 when filter changes', () => {
    const { result } = renderHook(() => useServiceSearch())
    act(() => { result.current.setPage(2) })
    act(() => { result.current.setFilter('category', 'Diseño') })
    expect(result.current.currentPage).toBe(1)
  })

  it('paginates correctly with pageSize 5', () => {
    const { result } = renderHook(() => useServiceSearch())
    act(() => { result.current.setPageSize(5) })
    expect(result.current.paginatedServices).toHaveLength(5)
    expect(result.current.totalPages).toBe(2)
  })

  it('activeFilterCount counts non-name active filters', () => {
    const { result } = renderHook(() => useServiceSearch())
    act(() => {
      result.current.setFilter('name', 'algo')
      result.current.setFilter('category', 'Diseño')
      result.current.setFilter('region', 'Antioquia')
    })
    expect(result.current.activeFilterCount).toBe(2)
  })

  it('clearFilters resets everything', () => {
    const { result } = renderHook(() => useServiceSearch())
    act(() => { result.current.setPageSize(5) })
    act(() => { result.current.setPage(2) })
    act(() => {
      result.current.setFilter('category', 'Diseño')
      result.current.setFilter('region', 'Antioquia')
    })
    act(() => { result.current.clearFilters() })
    expect(result.current.filteredServices).toHaveLength(10)
    expect(result.current.activeFilterCount).toBe(0)
    expect(result.current.filters.name).toBe('')
    expect(result.current.currentPage).toBe(1)
  })

  it('availableCategories returns unique sorted categories', () => {
    const { result } = renderHook(() => useServiceSearch())
    expect(result.current.availableCategories).toEqual([
      'Diseño', 'Fotografía', 'Limpieza', 'Plomería', 'Programación',
    ])
  })

  it('availableCities is filtered by active region', () => {
    const { result } = renderHook(() => useServiceSearch())
    act(() => { result.current.setFilter('region', 'Antioquia') })
    expect(result.current.availableCities).toEqual(['Envigado', 'Medellín'])
  })
})
```

- [ ] **Step 2: Ejecutar los tests — deben fallar**

```bash
npx vitest run src/buyer/hooks/useServiceSearch.test.ts
```

Expected: todos fallan con "Cannot find module".

- [ ] **Step 3: Implementar el hook**

```typescript
// src/buyer/hooks/useServiceSearch.ts
import { useState, useMemo } from 'react'
import { MOCK_SERVICES, type ServiceFull } from '../data/servicesMock'

export interface ServiceFilters {
  name: string
  category: string
  region: string
  city: string
  priceSort: 'asc' | 'desc' | ''
  store: string
}

const INITIAL_FILTERS: ServiceFilters = {
  name: '',
  category: '',
  region: '',
  city: '',
  priceSort: '',
  store: '',
}

export function useServiceSearch() {
  const [filters, setFilters] = useState<ServiceFilters>(INITIAL_FILTERS)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSizeState] = useState(10)

  function setFilter(key: keyof ServiceFilters, value: string) {
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

  const filteredServices = useMemo(() => {
    let result: ServiceFull[] = [...MOCK_SERVICES]

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
    if (filters.store) {
      result = result.filter(s => s.store.name === filters.store)
    }
    if (filters.priceSort === 'asc') {
      result = [...result].sort((a, b) => a.price - b.price)
    } else if (filters.priceSort === 'desc') {
      result = [...result].sort((a, b) => b.price - a.price)
    }

    return result
  }, [filters])

  const totalPages = Math.max(1, Math.ceil(filteredServices.length / pageSize))

  const paginatedServices = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredServices.slice(start, start + pageSize)
  }, [filteredServices, currentPage, pageSize])

  const activeFilterCount = useMemo(() => {
    return (['category', 'region', 'city', 'priceSort', 'store'] as const)
      .filter(k => filters[k] !== '').length
  }, [filters])

  const availableCategories = useMemo(() =>
    [...new Set(MOCK_SERVICES.map(s => s.category))].sort(), [])

  const availableRegions = useMemo(() =>
    [...new Set(MOCK_SERVICES.map(s => s.region))].sort(), [])

  const availableCities = useMemo(() => {
    const source = filters.region
      ? MOCK_SERVICES.filter(s => s.region === filters.region)
      : MOCK_SERVICES
    return [...new Set(source.map(s => s.city))].sort()
  }, [filters.region])

  const availableStores = useMemo(() =>
    [...new Set(MOCK_SERVICES.map(s => s.store.name))].sort(), [])

  return {
    filters,
    setFilter,
    filteredServices,
    paginatedServices,
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
    availableStores,
  }
}
```

- [ ] **Step 4: Ejecutar los tests — deben pasar**

```bash
npx vitest run src/buyer/hooks/useServiceSearch.test.ts
```

Expected: 15 tests passed.

- [ ] **Step 5: Commit**

```bash
git add src/buyer/hooks/useServiceSearch.ts src/buyer/hooks/useServiceSearch.test.ts
git commit -m "feat: add useServiceSearch hook with filtering and pagination"
```

---

## Task 3: Componente `ServiceCardFull`

**Files:**
- Create: `src/buyer/components/ServiceCardFull.tsx`
- Create: `src/buyer/components/ServiceCardFull.test.tsx`

- [ ] **Step 1: Escribir los tests**

```typescript
// src/buyer/components/ServiceCardFull.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ServiceCardFull } from './ServiceCardFull'
import type { ServiceFull } from '../data/servicesMock'

const BASE_SERVICE: ServiceFull = {
  id: '1',
  name: 'Diseño de Logo Profesional',
  description: 'Creación de logotipo vectorial con manual de marca.',
  price: 450000,
  image: 'https://picsum.photos/seed/test/300/300',
  badge: 'NUEVO',
  category: 'Diseño',
  region: 'Antioquia',
  city: 'Medellín',
  store: { name: 'DesignHub', icon: 'https://picsum.photos/seed/dh/40/40' },
  rating: 4.8,
  reviewCount: 94,
}

describe('ServiceCardFull', () => {
  it('renders service name', () => {
    render(<ServiceCardFull {...BASE_SERVICE} />)
    expect(screen.getByText('Diseño de Logo Profesional')).toBeInTheDocument()
  })

  it('renders formatted price in COP', () => {
    render(<ServiceCardFull {...BASE_SERVICE} />)
    expect(screen.getByText(/450.000/)).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<ServiceCardFull {...BASE_SERVICE} />)
    expect(screen.getByText('Creación de logotipo vectorial con manual de marca.')).toBeInTheDocument()
  })

  it('renders store name', () => {
    render(<ServiceCardFull {...BASE_SERVICE} />)
    expect(screen.getByText('DesignHub')).toBeInTheDocument()
  })

  it('renders city and region', () => {
    render(<ServiceCardFull {...BASE_SERVICE} />)
    expect(screen.getByText(/Medellín/)).toBeInTheDocument()
    expect(screen.getByText(/Antioquia/)).toBeInTheDocument()
  })

  it('renders rating and review count', () => {
    render(<ServiceCardFull {...BASE_SERVICE} />)
    expect(screen.getByText(/4\.8/)).toBeInTheDocument()
    expect(screen.getByText(/94/)).toBeInTheDocument()
  })

  it('renders "Contratar" button', () => {
    render(<ServiceCardFull {...BASE_SERVICE} />)
    expect(screen.getByRole('button', { name: /contratar/i })).toBeInTheDocument()
  })

  it('renders NUEVO badge when badge is NUEVO', () => {
    render(<ServiceCardFull {...BASE_SERVICE} badge="NUEVO" />)
    expect(screen.getByText('NUEVO')).toBeInTheDocument()
  })

  it('renders OFERTA badge when badge is OFERTA', () => {
    render(<ServiceCardFull {...BASE_SERVICE} badge="OFERTA" />)
    expect(screen.getByText('OFERTA')).toBeInTheDocument()
  })

  it('does not render badge when badge is null', () => {
    render(<ServiceCardFull {...BASE_SERVICE} badge={null} />)
    expect(screen.queryByText('NUEVO')).not.toBeInTheDocument()
    expect(screen.queryByText('OFERTA')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Ejecutar los tests — deben fallar**

```bash
npx vitest run src/buyer/components/ServiceCardFull.test.tsx
```

Expected: todos fallan con "Cannot find module".

- [ ] **Step 3: Implementar el componente**

```tsx
// src/buyer/components/ServiceCardFull.tsx
import type { ServiceFull } from '../data/servicesMock'

function formatPrice(price: number): string {
  return '$' + price.toLocaleString('es-CO')
}

export function ServiceCardFull(props: ServiceFull) {
  const { name, description, price, image, badge, region, city, store, rating, reviewCount } = props
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
      {/* Badge */}
      {badge && (
        <span
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            zIndex: 1,
            background: '#a3e635',
            color: '#1a1a1a',
            fontWeight: 700,
            fontSize: '0.68rem',
            padding: '0.2rem 0.5rem',
            borderRadius: '999px',
          }}
        >
          {badge}
        </span>
      )}

      {/* Imagen */}
      <div style={{ aspectRatio: '1/1', overflow: 'hidden', background: '#f5f5f5' }}>
        <img
          src={image}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
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
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {name}
        </p>

        {/* Precio */}
        <p style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: '#fff' }}>
          {formatPrice(price)}
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

        {/* Tienda */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <img
            src={store.icon}
            alt=""
            style={{ width: '20px', height: '20px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <span style={{ fontSize: '0.75rem', color: '#888' }}>{store.name}</span>
        </div>

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
          Contratar
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Ejecutar los tests — deben pasar**

```bash
npx vitest run src/buyer/components/ServiceCardFull.test.tsx
```

Expected: 10 tests passed.

- [ ] **Step 5: Commit**

```bash
git add src/buyer/components/ServiceCardFull.tsx src/buyer/components/ServiceCardFull.test.tsx
git commit -m "feat: add ServiceCardFull component with badge, price, rating"
```

---

## Task 4: Componente `ServiceFilterDrawer`

**Files:**
- Create: `src/buyer/components/ServiceFilterDrawer.tsx`
- Create: `src/buyer/components/ServiceFilterDrawer.test.tsx`

- [ ] **Step 1: Escribir los tests**

```typescript
// src/buyer/components/ServiceFilterDrawer.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ServiceFilterDrawer } from './ServiceFilterDrawer'
import type { ServiceFilters } from '../hooks/useServiceSearch'

const BASE_FILTERS: ServiceFilters = {
  name: '', category: '', region: '', city: '', priceSort: '', store: '',
}

const BASE_PROPS = {
  isOpen: true,
  onClose: vi.fn(),
  filters: BASE_FILTERS,
  setFilter: vi.fn(),
  clearFilters: vi.fn(),
  availableCategories: ['Diseño', 'Fotografía'],
  availableRegions: ['Antioquia', 'Cundinamarca'],
  availableCities: ['Bogotá', 'Medellín'],
  availableStores: ['DesignHub', 'PhotoPro'],
}

describe('ServiceFilterDrawer', () => {
  it('is hidden when isOpen is false', () => {
    render(<ServiceFilterDrawer {...BASE_PROPS} isOpen={false} />)
    expect(screen.getByTestId('service-filter-drawer')).toHaveStyle({ transform: 'translateY(100%)' })
  })

  it('is visible when isOpen is true', () => {
    render(<ServiceFilterDrawer {...BASE_PROPS} isOpen={true} />)
    expect(screen.getByTestId('service-filter-drawer')).toHaveStyle({ transform: 'translateY(0)' })
  })

  it('renders Filtros title', () => {
    render(<ServiceFilterDrawer {...BASE_PROPS} />)
    expect(screen.getByText('Filtros')).toBeInTheDocument()
  })

  it('renders all 5 selects', () => {
    render(<ServiceFilterDrawer {...BASE_PROPS} />)
    expect(screen.getByRole('combobox', { name: /categoría/i })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /región/i })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /ciudad/i })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /precio/i })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /tienda/i })).toBeInTheDocument()
  })

  it('calls onClose when backdrop is clicked', async () => {
    const onClose = vi.fn()
    render(<ServiceFilterDrawer {...BASE_PROPS} onClose={onClose} />)
    await userEvent.click(screen.getByTestId('service-filter-drawer-backdrop'))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when Aplicar button is clicked', async () => {
    const onClose = vi.fn()
    render(<ServiceFilterDrawer {...BASE_PROPS} onClose={onClose} />)
    await userEvent.click(screen.getByRole('button', { name: /aplicar/i }))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls clearFilters when Limpiar todo is clicked', async () => {
    const clearFilters = vi.fn()
    render(<ServiceFilterDrawer {...BASE_PROPS} clearFilters={clearFilters} />)
    await userEvent.click(screen.getByRole('button', { name: /limpiar todo/i }))
    expect(clearFilters).toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Ejecutar los tests — deben fallar**

```bash
npx vitest run src/buyer/components/ServiceFilterDrawer.test.tsx
```

Expected: todos fallan con "Cannot find module".

- [ ] **Step 3: Implementar el componente**

```tsx
// src/buyer/components/ServiceFilterDrawer.tsx
import type { ServiceFilters } from '../hooks/useServiceSearch'

interface ServiceFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  filters: ServiceFilters
  setFilter: (key: keyof ServiceFilters, value: string) => void
  clearFilters: () => void
  availableCategories: string[]
  availableRegions: string[]
  availableCities: string[]
  availableStores: string[]
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

export function ServiceFilterDrawer({
  isOpen, onClose, filters, setFilter, clearFilters,
  availableCategories, availableRegions, availableCities, availableStores,
}: ServiceFilterDrawerProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        data-testid="service-filter-drawer-backdrop"
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
        data-testid="service-filter-drawer"
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

          <label style={{ fontSize: '0.78rem', color: '#aaa' }}>
            Precio
            <select
              aria-label="Precio"
              style={selectStyle}
              value={filters.priceSort}
              onChange={e => setFilter('priceSort', e.target.value)}
            >
              <option value="">Sin ordenar</option>
              <option value="asc">Menor a mayor precio</option>
              <option value="desc">Mayor a menor precio</option>
            </select>
          </label>

          <label style={{ fontSize: '0.78rem', color: '#aaa' }}>
            Proveedor
            <select
              aria-label="Tienda"
              style={selectStyle}
              value={filters.store}
              onChange={e => setFilter('store', e.target.value)}
            >
              <option value="">Todos los proveedores</option>
              {availableStores.map(s => <option key={s} value={s}>{s}</option>)}
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
npx vitest run src/buyer/components/ServiceFilterDrawer.test.tsx
```

Expected: 7 tests passed.

- [ ] **Step 5: Commit**

```bash
git add src/buyer/components/ServiceFilterDrawer.tsx src/buyer/components/ServiceFilterDrawer.test.tsx
git commit -m "feat: add ServiceFilterDrawer component for mobile filters"
```

---

## Task 5: Componente `ServiceSearchBar`

**Files:**
- Create: `src/buyer/components/ServiceSearchBar.tsx`
- Create: `src/buyer/components/ServiceSearchBar.test.tsx`

- [ ] **Step 1: Escribir los tests**

```typescript
// src/buyer/components/ServiceSearchBar.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ServiceSearchBar } from './ServiceSearchBar'
import type { ServiceFilters } from '../hooks/useServiceSearch'

const BASE_FILTERS: ServiceFilters = {
  name: '', category: '', region: '', city: '', priceSort: '', store: '',
}

const BASE_PROPS = {
  filters: BASE_FILTERS,
  setFilter: vi.fn(),
  activeFilterCount: 0,
  onOpenFilterDrawer: vi.fn(),
  clearFilters: vi.fn(),
  availableCategories: ['Diseño', 'Fotografía'],
  availableRegions: ['Antioquia', 'Cundinamarca'],
  availableCities: ['Bogotá', 'Medellín'],
  availableStores: ['DesignHub', 'PhotoPro'],
}

describe('ServiceSearchBar - desktop', () => {
  const originalWidth = window.innerWidth

  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 800 })
  })

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: originalWidth })
    vi.clearAllMocks()
  })

  it('renders name input on desktop', () => {
    render(<ServiceSearchBar {...BASE_PROPS} />)
    expect(screen.getByPlaceholderText(/buscar por nombre/i)).toBeInTheDocument()
  })

  it('renders category select on desktop', () => {
    render(<ServiceSearchBar {...BASE_PROPS} />)
    expect(screen.getByRole('combobox', { name: /categoría/i })).toBeInTheDocument()
  })

  it('renders region select on desktop', () => {
    render(<ServiceSearchBar {...BASE_PROPS} />)
    expect(screen.getByRole('combobox', { name: /región/i })).toBeInTheDocument()
  })

  it('renders city select on desktop', () => {
    render(<ServiceSearchBar {...BASE_PROPS} />)
    expect(screen.getByRole('combobox', { name: /ciudad/i })).toBeInTheDocument()
  })

  it('city select is disabled when no region is selected', () => {
    render(<ServiceSearchBar {...BASE_PROPS} filters={{ ...BASE_FILTERS, region: '' }} />)
    expect(screen.getByRole('combobox', { name: /ciudad/i })).toBeDisabled()
  })

  it('city select is enabled when a region is selected', () => {
    render(<ServiceSearchBar {...BASE_PROPS} filters={{ ...BASE_FILTERS, region: 'Antioquia' }} />)
    expect(screen.getByRole('combobox', { name: /ciudad/i })).not.toBeDisabled()
  })

  it('does not render Filtros button on desktop', () => {
    render(<ServiceSearchBar {...BASE_PROPS} />)
    expect(screen.queryByRole('button', { name: /filtros/i })).not.toBeInTheDocument()
  })

  it('calls setFilter with name value on input change', async () => {
    const setFilter = vi.fn()
    render(<ServiceSearchBar {...BASE_PROPS} setFilter={setFilter} />)
    await userEvent.type(screen.getByPlaceholderText(/buscar por nombre/i), 'dis')
    expect(setFilter).toHaveBeenCalledWith('name', expect.stringContaining('d'))
  })

  it('shows Limpiar button when activeFilterCount > 0', () => {
    render(<ServiceSearchBar {...BASE_PROPS} activeFilterCount={2} />)
    expect(screen.getByRole('button', { name: /limpiar/i })).toBeInTheDocument()
  })

  it('hides Limpiar button when no active filters and name is empty', () => {
    render(<ServiceSearchBar {...BASE_PROPS} activeFilterCount={0} filters={{ ...BASE_FILTERS, name: '' }} />)
    expect(screen.queryByRole('button', { name: /limpiar/i })).not.toBeInTheDocument()
  })
})

describe('ServiceSearchBar - mobile', () => {
  const originalWidth = window.innerWidth

  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 375 })
  })

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: originalWidth })
    vi.clearAllMocks()
  })

  it('renders Filtros button on mobile', () => {
    render(<ServiceSearchBar {...BASE_PROPS} />)
    expect(screen.getByRole('button', { name: /filtros/i })).toBeInTheDocument()
  })

  it('does not render category select on mobile', () => {
    render(<ServiceSearchBar {...BASE_PROPS} />)
    expect(screen.queryByRole('combobox', { name: /categoría/i })).not.toBeInTheDocument()
  })

  it('does not render region select on mobile', () => {
    render(<ServiceSearchBar {...BASE_PROPS} />)
    expect(screen.queryByRole('combobox', { name: /región/i })).not.toBeInTheDocument()
  })

  it('calls onOpenFilterDrawer when Filtros button clicked', async () => {
    const onOpenFilterDrawer = vi.fn()
    render(<ServiceSearchBar {...BASE_PROPS} onOpenFilterDrawer={onOpenFilterDrawer} />)
    await userEvent.click(screen.getByRole('button', { name: /filtros/i }))
    expect(onOpenFilterDrawer).toHaveBeenCalled()
  })

  it('shows badge count on Filtros button when activeFilterCount > 0', () => {
    render(<ServiceSearchBar {...BASE_PROPS} activeFilterCount={3} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Ejecutar los tests — deben fallar**

```bash
npx vitest run src/buyer/components/ServiceSearchBar.test.tsx
```

Expected: todos fallan con "Cannot find module".

- [ ] **Step 3: Implementar el componente**

```tsx
// src/buyer/components/ServiceSearchBar.tsx
import { useWindowWidth } from '../../shared/hooks/useWindowWidth'
import type { ServiceFilters } from '../hooks/useServiceSearch'

interface ServiceSearchBarProps {
  filters: ServiceFilters
  setFilter: (key: keyof ServiceFilters, value: string) => void
  activeFilterCount: number
  onOpenFilterDrawer: () => void
  clearFilters: () => void
  availableCategories: string[]
  availableRegions: string[]
  availableCities: string[]
  availableStores: string[]
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

export function ServiceSearchBar({
  filters, setFilter, activeFilterCount, onOpenFilterDrawer,
  clearFilters, availableCategories, availableRegions, availableCities, availableStores,
}: ServiceSearchBarProps) {
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

      <select
        aria-label="Precio"
        style={selectStyle}
        value={filters.priceSort}
        onChange={e => setFilter('priceSort', e.target.value)}
      >
        <option value="">Sin ordenar</option>
        <option value="asc">Menor a mayor precio</option>
        <option value="desc">Mayor a menor precio</option>
      </select>

      <select
        aria-label="Tienda"
        style={selectStyle}
        value={filters.store}
        onChange={e => setFilter('store', e.target.value)}
      >
        <option value="">Todos los proveedores</option>
        {availableStores.map(s => <option key={s} value={s}>{s}</option>)}
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
npx vitest run src/buyer/components/ServiceSearchBar.test.tsx
```

Expected: 15 tests passed.

- [ ] **Step 5: Commit**

```bash
git add src/buyer/components/ServiceSearchBar.tsx src/buyer/components/ServiceSearchBar.test.tsx
git commit -m "feat: add ServiceSearchBar component (desktop + mobile)"
```

---

## Task 6: `SearchServicesPage` — página completa

**Files:**
- Modify: `src/buyer/pages/SearchServicesPage.tsx`
- Create: `src/buyer/pages/SearchServicesPage.test.tsx`

- [ ] **Step 1: Escribir los tests de la página**

```typescript
// src/buyer/pages/SearchServicesPage.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { SearchServicesPage } from './SearchServicesPage'

describe('SearchServicesPage', () => {
  it('renders the welcome title', () => {
    render(<MemoryRouter><SearchServicesPage /></MemoryRouter>)
    expect(
      screen.getByRole('heading', { name: /bienvenido al área de búsqueda de servicios/i })
    ).toBeInTheDocument()
  })

  it('renders service cards (10 by default) with Contratar button', () => {
    render(<MemoryRouter><SearchServicesPage /></MemoryRouter>)
    const buttons = screen.getAllByRole('button', { name: /contratar/i })
    expect(buttons.length).toBe(10)
  })

  it('renders two PaginationBar elements', () => {
    render(<MemoryRouter><SearchServicesPage /></MemoryRouter>)
    expect(screen.getAllByTestId('pagination-bar')).toHaveLength(2)
  })

  it('does not show empty state initially', () => {
    render(<MemoryRouter><SearchServicesPage /></MemoryRouter>)
    expect(screen.queryByText(/no encontramos servicios/i)).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Ejecutar los tests — deben fallar**

```bash
npx vitest run src/buyer/pages/SearchServicesPage.test.tsx
```

Expected: fallan porque `SearchServicesPage` sigue siendo el stub.

- [ ] **Step 3: Reemplazar `SearchServicesPage` con la implementación completa**

```tsx
// src/buyer/pages/SearchServicesPage.tsx
import { useState } from 'react'
import { StoriesCarousel } from '../components/StoriesCarousel'
import { ServiceSearchBar } from '../components/ServiceSearchBar'
import { ServiceFilterDrawer } from '../components/ServiceFilterDrawer'
import { ServiceCardFull } from '../components/ServiceCardFull'
import { PaginationBar } from '../components/PaginationBar'
import { useServiceSearch } from '../hooks/useServiceSearch'
import { useWindowWidth } from '../../shared/hooks/useWindowWidth'

export function SearchServicesPage() {
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)
  const width = useWindowWidth()
  const isMobile = width < 640
  const isTablet = width >= 640 && width < 1024
  const gridColumns = width >= 1024 ? 4 : isTablet ? 3 : 2

  const {
    filters, setFilter, filteredServices, paginatedServices,
    totalPages, currentPage, pageSize, setPage, setPageSize,
    activeFilterCount, clearFilters,
    availableCategories, availableRegions, availableCities, availableStores,
  } = useServiceSearch()

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
        {/* Bienvenida */}
        <h1
          style={{
            fontSize: isMobile ? '1.2rem' : '1.5rem',
            fontWeight: 700,
            color: '#fff',
            margin: '0 0 0.4rem',
          }}
        >
          Bienvenido al área de búsqueda de servicios
        </h1>
        <p style={{ color: '#aaa', fontSize: '0.85rem', margin: '0 0 1rem' }}>
          Encuentra los mejores profesionales verificados cerca de ti.
        </p>

        {/* Barra de filtros */}
        <ServiceSearchBar
          filters={filters}
          setFilter={setFilter}
          activeFilterCount={activeFilterCount}
          onOpenFilterDrawer={() => setIsFilterDrawerOpen(true)}
          clearFilters={clearFilters}
          availableCategories={availableCategories}
          availableRegions={availableRegions}
          availableCities={availableCities}
          availableStores={availableStores}
        />

        {filteredServices.length === 0 ? (
          <p style={{ color: '#aaa', textAlign: 'center', padding: '2rem 0' }}>
            No encontramos servicios con esos filtros.
          </p>
        ) : (
          <>
            {/* Paginación arriba */}
            <PaginationBar
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />

            {/* Grid de servicios */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
                gap: '0.75rem',
                margin: '0.5rem 0',
              }}
            >
              {paginatedServices.map(service => (
                <ServiceCardFull key={service.id} {...service} />
              ))}
            </div>

            {/* Paginación abajo */}
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

      {/* Drawer de filtros mobile */}
      <ServiceFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        setFilter={setFilter}
        clearFilters={clearFilters}
        availableCategories={availableCategories}
        availableRegions={availableRegions}
        availableCities={availableCities}
        availableStores={availableStores}
      />
    </>
  )
}
```

- [ ] **Step 4: Ejecutar los tests de la página — deben pasar**

```bash
npx vitest run src/buyer/pages/SearchServicesPage.test.tsx
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
git add src/buyer/pages/SearchServicesPage.tsx src/buyer/pages/SearchServicesPage.test.tsx
git commit -m "feat: implement SearchServicesPage with filters, cards and pagination"
```
