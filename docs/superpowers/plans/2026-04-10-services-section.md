# ServicesSection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `ServicesSection` to the buyer `HomePage` that mirrors `ProductsSection` exactly, reusing `ProductCard`, with services-specific copy and a CTA linking to `/search-services`.

**Architecture:** `ServicesSection` is a direct structural clone of `ProductsSection` — same imports, same responsive logic, same `BannerCarousel`, same `ProductCard`. The only differences are the mock data seeds, the header copy, and the CTA link target. No new card component is needed. `ProductCard` cards link internally to `/search-products` (hardcoded inside the card) — the section-level CTA button links to `/search-services`.

**Tech Stack:** React 18, TypeScript, React Router v6, Vitest, Testing Library

---

### Task 1: ServicesSection — test first

**Files:**
- Create: `src/buyer/components/ServicesSection.test.tsx`

- [ ] **Step 1: Write the failing tests**

Create `src/buyer/components/ServicesSection.test.tsx`:

```tsx
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ServicesSection } from './ServicesSection'

describe('ServicesSection', () => {
  it('renders the section title', () => {
    render(<MemoryRouter><ServicesSection /></MemoryRouter>)
    expect(
      screen.getByText('Los servicios que necesitas, cuando los necesitas')
    ).toBeInTheDocument()
  })

  it('renders the section description', () => {
    render(<MemoryRouter><ServicesSection /></MemoryRouter>)
    expect(
      screen.getByText('Profesionales verificados, listos para ayudarte.')
    ).toBeInTheDocument()
  })

  it('renders an "Explorar servicios" link to /search-services', () => {
    render(<MemoryRouter><ServicesSection /></MemoryRouter>)
    const btn = screen.getByRole('link', { name: /explorar servicios/i })
    expect(btn).toHaveAttribute('href', '/search-services')
  })

  it('renders 4 product card links (mobile/desktop — not tablet)', () => {
    // jsdom default: window.innerWidth = 0 (treated as mobile → 4 cards shown)
    render(<MemoryRouter><ServicesSection /></MemoryRouter>)
    const cardLinks = screen.getAllByRole('link', { name: /ver productos/i })
    expect(cardLinks.length).toBe(4)
  })

  describe('tablet layout', () => {
    const originalWidth = window.innerWidth

    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 768 })
    })

    afterEach(() => {
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: originalWidth })
    })

    it('renders only 3 product card links at tablet width', async () => {
      render(<MemoryRouter><ServicesSection /></MemoryRouter>)
      await act(async () => {
        window.dispatchEvent(new Event('resize'))
      })
      const cardLinks = screen.getAllByRole('link', { name: /ver productos/i })
      expect(cardLinks.length).toBe(3)
    })
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run src/buyer/components/ServicesSection.test.tsx
```

Expected: FAIL — `Cannot find module './ServicesSection'`

---

### Task 2: ServicesSection — implement

**Files:**
- Create: `src/buyer/components/ServicesSection.tsx`

- [ ] **Step 1: Create the component**

Create `src/buyer/components/ServicesSection.tsx`:

```tsx
import { Link } from 'react-router-dom'
import { useWindowWidth } from '../../shared/hooks/useWindowWidth'
import { BannerCarousel } from './BannerCarousel'
import { ProductCard } from './ProductCard'

interface ServiceItem {
  id: string
  image: string
  storeIcon: string
}

const MOCK_SERVICES: ServiceItem[] = [
  { id: '1', image: 'https://picsum.photos/seed/svc1/300/345', storeIcon: 'https://picsum.photos/seed/sv1/40/40' },
  { id: '2', image: 'https://picsum.photos/seed/svc2/300/345', storeIcon: 'https://picsum.photos/seed/sv2/40/40' },
  { id: '3', image: 'https://picsum.photos/seed/svc3/300/345', storeIcon: 'https://picsum.photos/seed/sv3/40/40' },
  { id: '4', image: 'https://picsum.photos/seed/svc4/300/345', storeIcon: 'https://picsum.photos/seed/sv4/40/40' },
]

export function ServicesSection() {
  const width = useWindowWidth()
  const isTablet = width >= 640 && width < 1024
  const isMobile = width < 640
  const isDesktop = width >= 1024

  const visibleServices = isTablet ? MOCK_SERVICES.slice(0, 3) : MOCK_SERVICES

  const gridColumns = isDesktop ? 4 : isTablet ? 3 : 2

  return (
    <div style={{ width: '100%', backgroundColor: '#111' }}>
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: isMobile ? '0.75rem 1rem 1rem' : '1rem 1.5rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Header row */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.75rem',
            gap: '0.75rem',
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: isMobile ? '0.9rem' : '1rem',
                fontWeight: 700,
                color: '#fff',
              }}
            >
              Los servicios que necesitas, cuando los necesitas
            </h2>
            <p
              style={{
                margin: '0.2rem 0 0',
                fontSize: isMobile ? '0.72rem' : '0.78rem',
                color: '#aaa',
              }}
            >
              Profesionales verificados, listos para ayudarte.
            </p>
          </div>
          <Link
            to="/search-services"
            style={{
              flexShrink: 0,
              background: 'transparent',
              border: '1.5px solid #646cff',
              color: '#646cff',
              borderRadius: '20px',
              padding: isMobile ? '0.35rem 0.75rem' : '0.4rem 1rem',
              fontSize: isMobile ? '0.72rem' : '0.78rem',
              fontWeight: 600,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Explorar servicios
          </Link>
        </div>

        {/* Banner carousel */}
        <BannerCarousel />

        {/* Service cards grid */}
        <div
          style={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
            gap: '0.75rem',
            marginTop: '0.25rem',
          }}
        >
          {visibleServices.map((service) => (
            <ProductCard
              key={service.id}
              image={service.image}
              storeIcon={service.storeIcon}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Run tests to verify they pass**

```bash
npx vitest run src/buyer/components/ServicesSection.test.tsx
```

Expected: PASS — 5 tests

- [ ] **Step 3: Commit**

```bash
git add src/buyer/components/ServicesSection.tsx src/buyer/components/ServicesSection.test.tsx
git commit -m "feat: add ServicesSection component"
```

---

### Task 3: SearchServicesPage + route + HomePage

**Files:**
- Create: `src/buyer/pages/SearchServicesPage.tsx`
- Modify: `src/core/router/index.tsx`
- Modify: `src/buyer/pages/HomePage.tsx`

- [ ] **Step 1: Create SearchServicesPage**

Create `src/buyer/pages/SearchServicesPage.tsx`:

```tsx
export function SearchServicesPage() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center', color: '#fff' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        Buscar Servicios
      </h1>
      <p style={{ color: '#aaa', fontSize: '0.9rem' }}>
        Próximamente — aquí podrás encontrar todos los servicios disponibles.
      </p>
    </div>
  )
}
```

- [ ] **Step 2: Add route to router**

In `src/core/router/index.tsx`, add the import after the `SearchStoresPage` import:

```tsx
import { SearchServicesPage } from '../../buyer/pages/SearchServicesPage'
```

Then add the route after `{ path: 'search-stores', element: <SearchStoresPage /> }`:

```tsx
{ path: 'search-services', element: <SearchServicesPage /> },
```

The public routes block should look like:

```tsx
// Public buyer routes
{ index: true, element: <HomePage /> },
{ path: 'search-products', element: <SearchProductsPage /> },
{ path: 'search-stores', element: <SearchStoresPage /> },
{ path: 'search-services', element: <SearchServicesPage /> },
```

- [ ] **Step 3: Add ServicesSection to HomePage**

Replace the contents of `src/buyer/pages/HomePage.tsx` with:

```tsx
import { StoriesCarousel } from '../components/StoriesCarousel'
import { ProductsSection } from '../components/ProductsSection'
import { StoresSection } from '../components/StoresSection'
import { ServicesSection } from '../components/ServicesSection'

export function HomePage() {
  return (
    <div>
      <StoriesCarousel />
      <ProductsSection />
      <StoresSection />
      <ServicesSection />
    </div>
  )
}
```

- [ ] **Step 4: Run full test suite**

```bash
npx vitest run
```

Expected: all tests PASS

- [ ] **Step 5: Build check**

```bash
npm run build
```

Expected: no TypeScript errors, build succeeds

- [ ] **Step 6: Commit**

```bash
git add src/buyer/pages/SearchServicesPage.tsx src/core/router/index.tsx src/buyer/pages/HomePage.tsx
git commit -m "feat: wire ServicesSection and search-services route to HomePage"
```
