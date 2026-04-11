# LaboralOffersSection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `LaboralOffersSection` to the buyer `HomePage` that mirrors `StoresSection` exactly, reusing `StoreCard` (with configurable link/aria-label), showing stores that publish job offers, linking to `/search-laboral-oferts`.

**Architecture:** First make `StoreCard` accept optional `to` and `ariaLabel` props (defaulting to current values, backward-compatible). Then `LaboralOffersSection` clones `StoresSection` structure, passing `to="/search-laboral-oferts"` and `ariaLabel="Ver ofertas laborales"` to each card. Same `BannerCarousel`, same responsive grid.

**Tech Stack:** React 18, TypeScript, React Router v6, Vitest, Testing Library

---

### Task 1: Make StoreCard configurable

**Files:**
- Modify: `src/buyer/components/StoreCard.tsx`
- Modify: `src/buyer/components/StoreCard.test.tsx`

- [ ] **Step 1: Update StoreCard to accept optional `to` and `ariaLabel` props**

Replace the contents of `src/buyer/components/StoreCard.tsx` with:

```tsx
import { Link } from 'react-router-dom'

interface StoreCardProps {
  image: string
  storeIcon: string
  storeName: string
  to?: string
  ariaLabel?: string
}

export function StoreCard({ image, storeIcon, storeName, to = '/search-stores', ariaLabel = 'Ver tiendas' }: StoreCardProps) {
  return (
    <Link
      to={to}
      aria-label={ariaLabel}
      style={{
        display: 'block',
        aspectRatio: '16 / 9',
        borderRadius: '14px',
        overflow: 'hidden',
        position: 'relative',
        textDecoration: 'none',
        background: '#1a1a1a',
        border: '1px solid #2a2a2a',
      }}
    >
      <img
        src={image}
        alt=""
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          border: '2px solid #646cff',
          overflow: 'hidden',
          background: '#222',
        }}
      >
        <img
          src={storeIcon}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <span
        style={{
          position: 'absolute',
          bottom: '8px',
          left: '10px',
          color: '#fff',
          fontSize: '0.75rem',
          fontWeight: 600,
          textShadow: '0 1px 3px rgba(0,0,0,0.6)',
        }}
      >
        {storeName}
      </span>
    </Link>
  )
}
```

- [ ] **Step 2: Run existing StoreCard tests to confirm backward compatibility**

```bash
npx vitest run src/buyer/components/StoreCard.test.tsx
```

Expected: PASS — 5 tests (all existing tests use default props, so defaults keep them green)

- [ ] **Step 3: Run full test suite to confirm no regressions**

```bash
npx vitest run
```

Expected: all tests PASS

- [ ] **Step 4: Commit**

```bash
git add src/buyer/components/StoreCard.tsx
git commit -m "feat: make StoreCard link and aria-label configurable"
```

---

### Task 2: LaboralOffersSection — test first

**Files:**
- Create: `src/buyer/components/LaboralOffersSection.test.tsx`

- [ ] **Step 1: Write the failing tests**

Create `src/buyer/components/LaboralOffersSection.test.tsx`:

```tsx
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LaboralOffersSection } from './LaboralOffersSection'

describe('LaboralOffersSection', () => {
  it('renders the section title', () => {
    render(<MemoryRouter><LaboralOffersSection /></MemoryRouter>)
    expect(
      screen.getByText('Encuentra tu próxima oportunidad laboral')
    ).toBeInTheDocument()
  })

  it('renders the section description', () => {
    render(<MemoryRouter><LaboralOffersSection /></MemoryRouter>)
    expect(
      screen.getByText('Las mejores tiendas buscan talento como el tuyo.')
    ).toBeInTheDocument()
  })

  it('renders 5 links to /search-laboral-oferts on mobile/desktop (1 CTA + 4 cards)', () => {
    // jsdom default: window.innerWidth = 0 (treated as mobile → 4 cards shown)
    // Both the CTA button and each StoreCard share aria-label "Ver ofertas laborales"
    render(<MemoryRouter><LaboralOffersSection /></MemoryRouter>)
    const links = screen.getAllByRole('link', { name: /ver ofertas laborales/i })
    expect(links.length).toBe(5) // 1 CTA + 4 store cards
    links.forEach(link => {
      expect(link).toHaveAttribute('href', '/search-laboral-oferts')
    })
  })

  describe('tablet layout', () => {
    const originalWidth = window.innerWidth

    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 768 })
    })

    afterEach(() => {
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: originalWidth })
    })

    it('renders 4 links to /search-laboral-oferts at tablet width (1 CTA + 3 cards)', async () => {
      render(<MemoryRouter><LaboralOffersSection /></MemoryRouter>)
      await act(async () => {
        window.dispatchEvent(new Event('resize'))
      })
      const links = screen.getAllByRole('link', { name: /ver ofertas laborales/i })
      expect(links.length).toBe(4) // 1 CTA + 3 store cards
    })
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run src/buyer/components/LaboralOffersSection.test.tsx
```

Expected: FAIL — `Cannot find module './LaboralOffersSection'`

---

### Task 3: LaboralOffersSection — implement

**Files:**
- Create: `src/buyer/components/LaboralOffersSection.tsx`

- [ ] **Step 1: Create the component**

Create `src/buyer/components/LaboralOffersSection.tsx`:

```tsx
import { Link } from 'react-router-dom'
import { useWindowWidth } from '../../shared/hooks/useWindowWidth'
import { BannerCarousel } from './BannerCarousel'
import { StoreCard } from './StoreCard'

interface LaboralOfferItem {
  id: string
  image: string
  storeIcon: string
  storeName: string
}

const MOCK_OFFERS: LaboralOfferItem[] = [
  { id: '1', image: 'https://picsum.photos/seed/job1/400/225', storeIcon: 'https://picsum.photos/seed/jb1/40/40', storeName: 'Tienda Empleo Uno' },
  { id: '2', image: 'https://picsum.photos/seed/job2/400/225', storeIcon: 'https://picsum.photos/seed/jb2/40/40', storeName: 'Tienda Empleo Dos' },
  { id: '3', image: 'https://picsum.photos/seed/job3/400/225', storeIcon: 'https://picsum.photos/seed/jb3/40/40', storeName: 'Tienda Empleo Tres' },
  { id: '4', image: 'https://picsum.photos/seed/job4/400/225', storeIcon: 'https://picsum.photos/seed/jb4/40/40', storeName: 'Tienda Empleo Cuatro' },
]

export function LaboralOffersSection() {
  const width = useWindowWidth()
  const isTablet = width >= 640 && width < 1024
  const isMobile = width < 640
  const isDesktop = width >= 1024

  const visibleOffers = isTablet ? MOCK_OFFERS.slice(0, 3) : MOCK_OFFERS

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
              Encuentra tu próxima oportunidad laboral
            </h2>
            <p
              style={{
                margin: '0.2rem 0 0',
                fontSize: isMobile ? '0.72rem' : '0.78rem',
                color: '#aaa',
              }}
            >
              Las mejores tiendas buscan talento como el tuyo.
            </p>
          </div>
          <Link
            to="/search-laboral-oferts"
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
            Ver ofertas laborales
          </Link>
        </div>

        {/* Banner carousel */}
        <BannerCarousel />

        {/* Offer cards grid */}
        <div
          style={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
            gap: '0.75rem',
            marginTop: '0.25rem',
          }}
        >
          {visibleOffers.map((offer) => (
            <StoreCard
              key={offer.id}
              image={offer.image}
              storeIcon={offer.storeIcon}
              storeName={offer.storeName}
              to="/search-laboral-oferts"
              ariaLabel="Ver ofertas laborales"
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
npx vitest run src/buyer/components/LaboralOffersSection.test.tsx
```

Expected: PASS — 6 tests

- [ ] **Step 3: Commit**

```bash
git add src/buyer/components/LaboralOffersSection.tsx src/buyer/components/LaboralOffersSection.test.tsx
git commit -m "feat: add LaboralOffersSection component"
```

---

### Task 4: SearchLaboralOfertsPage + route + HomePage

**Files:**
- Create: `src/buyer/pages/SearchLaboralOfertsPage.tsx`
- Modify: `src/core/router/index.tsx`
- Modify: `src/buyer/pages/HomePage.tsx`

- [ ] **Step 1: Create SearchLaboralOfertsPage**

Create `src/buyer/pages/SearchLaboralOfertsPage.tsx`:

```tsx
export function SearchLaboralOfertsPage() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center', color: '#fff' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        Ofertas Laborales
      </h1>
      <p style={{ color: '#aaa', fontSize: '0.9rem' }}>
        Próximamente — aquí podrás encontrar todas las ofertas laborales disponibles.
      </p>
    </div>
  )
}
```

- [ ] **Step 2: Add route to router**

In `src/core/router/index.tsx`, add the import after the `SearchServicesPage` import:

```tsx
import { SearchLaboralOfertsPage } from '../../buyer/pages/SearchLaboralOfertsPage'
```

Then add the route after `{ path: 'search-services', element: <SearchServicesPage /> }`:

```tsx
{ path: 'search-laboral-oferts', element: <SearchLaboralOfertsPage /> },
```

The public routes block should look like:

```tsx
// Public buyer routes
{ index: true, element: <HomePage /> },
{ path: 'search-products', element: <SearchProductsPage /> },
{ path: 'search-stores', element: <SearchStoresPage /> },
{ path: 'search-services', element: <SearchServicesPage /> },
{ path: 'search-laboral-oferts', element: <SearchLaboralOfertsPage /> },
```

- [ ] **Step 3: Add LaboralOffersSection to HomePage**

Replace the contents of `src/buyer/pages/HomePage.tsx` with:

```tsx
import { StoriesCarousel } from '../components/StoriesCarousel'
import { ProductsSection } from '../components/ProductsSection'
import { StoresSection } from '../components/StoresSection'
import { ServicesSection } from '../components/ServicesSection'
import { LaboralOffersSection } from '../components/LaboralOffersSection'

export function HomePage() {
  return (
    <div>
      <StoriesCarousel />
      <ProductsSection />
      <StoresSection />
      <ServicesSection />
      <LaboralOffersSection />
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
git add src/buyer/pages/SearchLaboralOfertsPage.tsx src/core/router/index.tsx src/buyer/pages/HomePage.tsx
git commit -m "feat: wire LaboralOffersSection and search-laboral-oferts route to HomePage"
```
