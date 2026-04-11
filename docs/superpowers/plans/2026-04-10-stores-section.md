# StoresSection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `StoresSection` to the buyer `HomePage` that mirrors `ProductsSection` but shows horizontal store cards with a cover image, store icon, and store name.

**Architecture:** Three new files (`StoreCard`, `StoresSection`, `SearchStoresPage`) follow the exact same patterns as their product counterparts. `StoreCard` uses a `16/9` aspect ratio and renders the store name as overlaid text. `StoresSection` reuses `BannerCarousel` and `useWindowWidth` with identical responsive grid logic.

**Tech Stack:** React 18, TypeScript, React Router v6, Vitest, Testing Library

---

### Task 1: StoreCard — test first

**Files:**
- Create: `src/buyer/components/StoreCard.test.tsx`

- [ ] **Step 1: Write the failing tests**

Create `src/buyer/components/StoreCard.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { StoreCard } from './StoreCard'

const defaultProps = {
  image: 'https://picsum.photos/seed/store1/400/225',
  storeIcon: 'https://picsum.photos/seed/si1/40/40',
  storeName: 'Tienda Uno',
}

describe('StoreCard', () => {
  it('renders a link with aria-label "Ver tiendas" pointing to /search-stores', () => {
    render(<MemoryRouter><StoreCard {...defaultProps} /></MemoryRouter>)
    const link = screen.getByRole('link', { name: /ver tiendas/i })
    expect(link).toHaveAttribute('href', '/search-stores')
  })

  it('renders the store name', () => {
    render(<MemoryRouter><StoreCard {...defaultProps} /></MemoryRouter>)
    expect(screen.getByText('Tienda Uno')).toBeInTheDocument()
  })

  it('renders two images (cover and store icon)', () => {
    render(<MemoryRouter><StoreCard {...defaultProps} /></MemoryRouter>)
    const images = screen.getAllByRole('img')
    expect(images.length).toBe(2)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run src/buyer/components/StoreCard.test.tsx
```

Expected: FAIL — `Cannot find module './StoreCard'`

---

### Task 2: StoreCard — implement

**Files:**
- Create: `src/buyer/components/StoreCard.tsx`

- [ ] **Step 1: Create the component**

Create `src/buyer/components/StoreCard.tsx`:

```tsx
import { Link } from 'react-router-dom'

interface StoreCardProps {
  image: string
  storeIcon: string
  storeName: string
}

export function StoreCard({ image, storeIcon, storeName }: StoreCardProps) {
  return (
    <Link
      to="/search-stores"
      aria-label="Ver tiendas"
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

- [ ] **Step 2: Run tests to verify they pass**

```bash
npx vitest run src/buyer/components/StoreCard.test.tsx
```

Expected: PASS — 3 tests

- [ ] **Step 3: Commit**

```bash
git add src/buyer/components/StoreCard.tsx src/buyer/components/StoreCard.test.tsx
git commit -m "feat: add StoreCard component"
```

---

### Task 3: StoresSection — test first

**Files:**
- Create: `src/buyer/components/StoresSection.test.tsx`

- [ ] **Step 1: Write the failing tests**

Create `src/buyer/components/StoresSection.test.tsx`:

```tsx
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { StoresSection } from './StoresSection'

describe('StoresSection', () => {
  it('renders the section title', () => {
    render(<MemoryRouter><StoresSection /></MemoryRouter>)
    expect(
      screen.getByText('Las tiendas más cerca de lo que buscas')
    ).toBeInTheDocument()
  })

  it('renders the section description', () => {
    render(<MemoryRouter><StoresSection /></MemoryRouter>)
    expect(
      screen.getByText('Las mejores tiendas, verificadas y listas para ti.')
    ).toBeInTheDocument()
  })

  it('renders an "Explorar tiendas" link to /search-stores', () => {
    render(<MemoryRouter><StoresSection /></MemoryRouter>)
    const btn = screen.getByRole('link', { name: /explorar tiendas/i })
    expect(btn).toHaveAttribute('href', '/search-stores')
  })

  it('renders 4 store card links to /search-stores (mobile/desktop — not tablet)', () => {
    render(<MemoryRouter><StoresSection /></MemoryRouter>)
    const storeLinks = screen.getAllByRole('link', { name: /ver tiendas/i })
    expect(storeLinks.length).toBe(4)
    storeLinks.forEach(link => {
      expect(link).toHaveAttribute('href', '/search-stores')
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

    it('renders only 3 store card links at tablet width', async () => {
      render(<MemoryRouter><StoresSection /></MemoryRouter>)
      await act(async () => {
        window.dispatchEvent(new Event('resize'))
      })
      const storeLinks = screen.getAllByRole('link', { name: /ver tiendas/i })
      expect(storeLinks.length).toBe(3)
    })
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run src/buyer/components/StoresSection.test.tsx
```

Expected: FAIL — `Cannot find module './StoresSection'`

---

### Task 4: StoresSection — implement

**Files:**
- Create: `src/buyer/components/StoresSection.tsx`

- [ ] **Step 1: Create the component**

Create `src/buyer/components/StoresSection.tsx`:

```tsx
import { Link } from 'react-router-dom'
import { useWindowWidth } from '../../shared/hooks/useWindowWidth'
import { BannerCarousel } from './BannerCarousel'
import { StoreCard } from './StoreCard'

interface StoreItem {
  id: string
  image: string
  storeIcon: string
  storeName: string
}

const MOCK_STORES: StoreItem[] = [
  { id: '1', image: 'https://picsum.photos/seed/store1/400/225', storeIcon: 'https://picsum.photos/seed/si1/40/40', storeName: 'Tienda Uno' },
  { id: '2', image: 'https://picsum.photos/seed/store2/400/225', storeIcon: 'https://picsum.photos/seed/si2/40/40', storeName: 'Tienda Dos' },
  { id: '3', image: 'https://picsum.photos/seed/store3/400/225', storeIcon: 'https://picsum.photos/seed/si3/40/40', storeName: 'Tienda Tres' },
  { id: '4', image: 'https://picsum.photos/seed/store4/400/225', storeIcon: 'https://picsum.photos/seed/si4/40/40', storeName: 'Tienda Cuatro' },
]

export function StoresSection() {
  const width = useWindowWidth()
  const isTablet = width >= 640 && width < 1024
  const isMobile = width < 640
  const isDesktop = width >= 1024

  const visibleStores = isTablet ? MOCK_STORES.slice(0, 3) : MOCK_STORES

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
              Las tiendas más cerca de lo que buscas
            </h2>
            <p
              style={{
                margin: '0.2rem 0 0',
                fontSize: isMobile ? '0.72rem' : '0.78rem',
                color: '#aaa',
              }}
            >
              Las mejores tiendas, verificadas y listas para ti.
            </p>
          </div>
          <Link
            to="/search-stores"
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
            Explorar tiendas
          </Link>
        </div>

        {/* Banner carousel */}
        <BannerCarousel />

        {/* Store cards grid */}
        <div
          style={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
            gap: '0.75rem',
            marginTop: '0.25rem',
          }}
        >
          {visibleStores.map((store) => (
            <StoreCard
              key={store.id}
              image={store.image}
              storeIcon={store.storeIcon}
              storeName={store.storeName}
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
npx vitest run src/buyer/components/StoresSection.test.tsx
```

Expected: PASS — 5 tests

- [ ] **Step 3: Commit**

```bash
git add src/buyer/components/StoresSection.tsx src/buyer/components/StoresSection.test.tsx
git commit -m "feat: add StoresSection component"
```

---

### Task 5: SearchStoresPage + route + HomePage

**Files:**
- Create: `src/buyer/pages/SearchStoresPage.tsx`
- Modify: `src/core/router/index.tsx`
- Modify: `src/buyer/pages/HomePage.tsx`

- [ ] **Step 1: Create SearchStoresPage**

Create `src/buyer/pages/SearchStoresPage.tsx`:

```tsx
export function SearchStoresPage() {
  return (
    <div>
      <h1>Buscar tiendas</h1>
    </div>
  )
}
```

- [ ] **Step 2: Add route to router**

In `src/core/router/index.tsx`, add the import after the `SearchProductsPage` import:

```tsx
import { SearchStoresPage } from '../../buyer/pages/SearchStoresPage'
```

Then add the route after `{ path: 'search-products', element: <SearchProductsPage /> }`:

```tsx
{ path: 'search-stores', element: <SearchStoresPage /> },
```

The public routes block should look like:

```tsx
// Public buyer routes
{ index: true, element: <HomePage /> },
{ path: 'search-products', element: <SearchProductsPage /> },
{ path: 'search-stores', element: <SearchStoresPage /> },
```

- [ ] **Step 3: Add StoresSection to HomePage**

Replace the contents of `src/buyer/pages/HomePage.tsx` with:

```tsx
import { StoriesCarousel } from '../components/StoriesCarousel'
import { ProductsSection } from '../components/ProductsSection'
import { StoresSection } from '../components/StoresSection'

export function HomePage() {
  return (
    <div>
      <StoriesCarousel />
      <ProductsSection />
      <StoresSection />
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
git add src/buyer/pages/SearchStoresPage.tsx src/core/router/index.tsx src/buyer/pages/HomePage.tsx
git commit -m "feat: wire StoresSection and search-stores route to HomePage"
```
