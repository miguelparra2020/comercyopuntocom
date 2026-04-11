# Products Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `ProductsSection` below `StoriesCarousel` on `HomePage` that draws users to `/search-products`, using mock data, a banner carousel, and a responsive product card grid.

**Architecture:** Three new components (`ProductCard`, `BannerCarousel`, `ProductsSection`) in `src/buyer/components/`, a shared `useWindowWidth` hook in `src/shared/hooks/`, a stub `SearchProductsPage`, and router + HomePage wiring. All data is hardcoded. All interactive elements navigate to `/search-products`.

**Tech Stack:** React 18, TypeScript, react-router-dom v7, Vitest + @testing-library/react, inline styles (no CSS files).

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Create | `src/shared/hooks/useWindowWidth.ts` | Returns current window width, updates on resize |
| Create | `src/shared/hooks/useWindowWidth.test.ts` | Tests for the hook |
| Create | `src/buyer/components/ProductCard.tsx` | Single product card: image + store icon, links to /search-products |
| Create | `src/buyer/components/ProductCard.test.tsx` | Tests for ProductCard |
| Create | `src/buyer/components/BannerCarousel.tsx` | Horizontal banner carousel, arrows on desktop, swipe on mobile |
| Create | `src/buyer/components/BannerCarousel.test.tsx` | Tests for BannerCarousel |
| Create | `src/buyer/components/ProductsSection.tsx` | Container: header + BannerCarousel + card grid (responsive) |
| Create | `src/buyer/components/ProductsSection.test.tsx` | Tests for ProductsSection |
| Create | `src/buyer/pages/SearchProductsPage.tsx` | Stub page for /search-products |
| Modify | `src/core/router/index.tsx` | Add `search-products` public route |
| Modify | `src/buyer/pages/HomePage.tsx` | Mount `<ProductsSection />` below `<StoriesCarousel />` |

---

## Task 1: useWindowWidth hook

**Files:**
- Create: `src/shared/hooks/useWindowWidth.ts`
- Create: `src/shared/hooks/useWindowWidth.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// src/shared/hooks/useWindowWidth.test.ts
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useWindowWidth } from './useWindowWidth'

describe('useWindowWidth', () => {
  it('returns the current window.innerWidth', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 1280 })
    const { result } = renderHook(() => useWindowWidth())
    expect(result.current).toBe(1280)
  })

  it('updates when the window is resized', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 800 })
    const { result } = renderHook(() => useWindowWidth())
    act(() => {
      Object.defineProperty(window, 'innerWidth', { writable: true, value: 400 })
      window.dispatchEvent(new Event('resize'))
    })
    expect(result.current).toBe(400)
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npx vitest run src/shared/hooks/useWindowWidth.test.ts
```

Expected: `Error: Cannot find module './useWindowWidth'`

- [ ] **Step 3: Implement the hook**

```typescript
// src/shared/hooks/useWindowWidth.ts
import { useState, useEffect } from 'react'

export function useWindowWidth(): number {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return width
}
```

- [ ] **Step 4: Run test — expect PASS**

```bash
npx vitest run src/shared/hooks/useWindowWidth.test.ts
```

Expected: `2 tests passed`

- [ ] **Step 5: Commit**

```bash
git add src/shared/hooks/useWindowWidth.ts src/shared/hooks/useWindowWidth.test.ts
git commit -m "feat: add useWindowWidth hook"
```

---

## Task 2: ProductCard component

**Files:**
- Create: `src/buyer/components/ProductCard.tsx`
- Create: `src/buyer/components/ProductCard.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// src/buyer/components/ProductCard.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ProductCard } from './ProductCard'

describe('ProductCard', () => {
  const defaultProps = {
    image: 'https://picsum.photos/seed/prod1/300/345',
    storeIcon: 'https://picsum.photos/seed/s1/40/40',
  }

  it('renders a link to /search-products', () => {
    render(<MemoryRouter><ProductCard {...defaultProps} /></MemoryRouter>)
    const link = screen.getByRole('link', { name: /ver productos/i })
    expect(link).toHaveAttribute('href', '/search-products')
  })

  it('renders the product image with the correct src', () => {
    const { container } = render(
      <MemoryRouter><ProductCard {...defaultProps} /></MemoryRouter>
    )
    const images = container.querySelectorAll('img')
    const productImg = images[0]
    expect(productImg).toHaveAttribute('src', defaultProps.image)
  })

  it('renders the store icon with the correct src', () => {
    const { container } = render(
      <MemoryRouter><ProductCard {...defaultProps} /></MemoryRouter>
    )
    const images = container.querySelectorAll('img')
    const storeImg = images[1]
    expect(storeImg).toHaveAttribute('src', defaultProps.storeIcon)
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npx vitest run src/buyer/components/ProductCard.test.tsx
```

Expected: `Error: Cannot find module './ProductCard'`

- [ ] **Step 3: Implement ProductCard**

```tsx
// src/buyer/components/ProductCard.tsx
import { Link } from 'react-router-dom'

interface ProductCardProps {
  image: string
  storeIcon: string
}

export function ProductCard({ image, storeIcon }: ProductCardProps) {
  return (
    <Link
      to="/search-products"
      aria-label="Ver productos"
      style={{
        display: 'block',
        aspectRatio: '1 / 1.15',
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
          background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 45%)',
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
    </Link>
  )
}
```

- [ ] **Step 4: Run test — expect PASS**

```bash
npx vitest run src/buyer/components/ProductCard.test.tsx
```

Expected: `3 tests passed`

- [ ] **Step 5: Commit**

```bash
git add src/buyer/components/ProductCard.tsx src/buyer/components/ProductCard.test.tsx
git commit -m "feat: add ProductCard component"
```

---

## Task 3: BannerCarousel component

**Files:**
- Create: `src/buyer/components/BannerCarousel.tsx`
- Create: `src/buyer/components/BannerCarousel.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// src/buyer/components/BannerCarousel.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { BannerCarousel } from './BannerCarousel'

describe('BannerCarousel', () => {
  it('renders 3 banner links all pointing to /search-products', () => {
    render(<MemoryRouter><BannerCarousel /></MemoryRouter>)
    const links = screen.getAllByRole('link')
    expect(links.length).toBe(3)
    links.forEach(link => {
      expect(link).toHaveAttribute('href', '/search-products')
    })
  })

  it('renders 3 dot indicators', () => {
    const { container } = render(<MemoryRouter><BannerCarousel /></MemoryRouter>)
    // dots have data-testid="banner-dot"
    const dots = container.querySelectorAll('[data-testid="banner-dot"]')
    expect(dots.length).toBe(3)
  })

  it('first dot is active on initial render', () => {
    const { container } = render(<MemoryRouter><BannerCarousel /></MemoryRouter>)
    const dots = container.querySelectorAll('[data-testid="banner-dot"]')
    expect((dots[0] as HTMLElement).dataset.active).toBe('true')
    expect((dots[1] as HTMLElement).dataset.active).toBe('false')
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npx vitest run src/buyer/components/BannerCarousel.test.tsx
```

Expected: `Error: Cannot find module './BannerCarousel'`

- [ ] **Step 3: Implement BannerCarousel**

```tsx
// src/buyer/components/BannerCarousel.tsx
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useWindowWidth } from '../../shared/hooks/useWindowWidth'

interface BannerItem {
  id: string
  label: string
  image: string
}

const MOCK_BANNERS: BannerItem[] = [
  {
    id: '1',
    label: '✦ Nuevas tiendas esta semana — Explóralas ahora ✦',
    image: 'https://picsum.photos/seed/banner1/1240/200',
  },
  {
    id: '2',
    label: '✦ Los mejores productos al mejor precio ✦',
    image: 'https://picsum.photos/seed/banner2/1240/200',
  },
  {
    id: '3',
    label: '✦ Descuentos exclusivos en tiendas seleccionadas ✦',
    image: 'https://picsum.photos/seed/banner3/1240/200',
  },
]

export function BannerCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const width = useWindowWidth()
  const isDesktop = width >= 1024

  function goTo(index: number) {
    const next = Math.max(0, Math.min(MOCK_BANNERS.length - 1, index))
    setActiveIndex(next)
    if (scrollRef.current) {
      const child = scrollRef.current.children[next] as HTMLElement
      child?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
    }
  }

  return (
    <div style={{ width: '100%', position: 'relative', marginBottom: '0.5rem' }}>
      {/* Arrow left — desktop only */}
      {isDesktop && (
        <button
          aria-label="Banner anterior"
          onClick={() => goTo(activeIndex - 1)}
          style={{
            position: 'absolute',
            left: '10px',
            top: '45%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: '1px solid #555',
            background: 'rgba(255,255,255,0.12)',
            color: '#fff',
            fontSize: '1.1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ‹
        </button>
      )}

      {/* Scrollable banner track */}
      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          borderRadius: '14px',
        }}
      >
        {MOCK_BANNERS.map((banner) => (
          <Link
            key={banner.id}
            to="/search-products"
            aria-label={banner.label}
            style={{
              flexShrink: 0,
              width: '100%',
              height: '130px',
              scrollSnapAlign: 'start',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textDecoration: 'none',
              borderRadius: '14px',
              overflow: 'hidden',
              background: 'linear-gradient(120deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
              border: '1px solid #333',
            }}
          >
            <img
              src={banner.image}
              alt=""
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.2,
              }}
            />
            <span
              style={{
                position: 'relative',
                zIndex: 1,
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: 500,
                letterSpacing: '0.04em',
                textAlign: 'center',
                padding: '0 3rem',
              }}
            >
              {banner.label}
            </span>
          </Link>
        ))}
      </div>

      {/* Arrow right — desktop only */}
      {isDesktop && (
        <button
          aria-label="Banner siguiente"
          onClick={() => goTo(activeIndex + 1)}
          style={{
            position: 'absolute',
            right: '10px',
            top: '45%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: '1px solid #555',
            background: 'rgba(255,255,255,0.12)',
            color: '#fff',
            fontSize: '1.1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ›
        </button>
      )}

      {/* Dot indicators */}
      <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', marginTop: '6px' }}>
        {MOCK_BANNERS.map((banner, i) => (
          <button
            key={banner.id}
            data-testid="banner-dot"
            data-active={i === activeIndex ? 'true' : 'false'}
            aria-label={`Ir al banner ${i + 1}`}
            onClick={() => goTo(i)}
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              background: i === activeIndex ? '#646cff' : '#444',
            }}
          />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run test — expect PASS**

```bash
npx vitest run src/buyer/components/BannerCarousel.test.tsx
```

Expected: `3 tests passed`

- [ ] **Step 5: Commit**

```bash
git add src/buyer/components/BannerCarousel.tsx src/buyer/components/BannerCarousel.test.tsx
git commit -m "feat: add BannerCarousel component"
```

---

## Task 4: ProductsSection component

**Files:**
- Create: `src/buyer/components/ProductsSection.tsx`
- Create: `src/buyer/components/ProductsSection.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// src/buyer/components/ProductsSection.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ProductsSection } from './ProductsSection'

describe('ProductsSection', () => {
  it('renders the section title', () => {
    render(<MemoryRouter><ProductsSection /></MemoryRouter>)
    expect(
      screen.getByText('Descubre lo que el mundo tiene para ti')
    ).toBeInTheDocument()
  })

  it('renders the section description', () => {
    render(<MemoryRouter><ProductsSection /></MemoryRouter>)
    expect(
      screen.getByText('Miles de productos de las mejores tiendas, en un solo lugar.')
    ).toBeInTheDocument()
  })

  it('renders a "Buscar productos" link to /search-products', () => {
    render(<MemoryRouter><ProductsSection /></MemoryRouter>)
    const btn = screen.getByRole('link', { name: /buscar productos/i })
    expect(btn).toHaveAttribute('href', '/search-products')
  })

  it('renders 4 product card links to /search-products (mobile/desktop — not tablet)', () => {
    // jsdom default: window.innerWidth = 0 (treated as mobile → 4 cards shown)
    render(<MemoryRouter><ProductsSection /></MemoryRouter>)
    const productLinks = screen.getAllByRole('link', { name: /ver productos/i })
    expect(productLinks.length).toBe(4)
    productLinks.forEach(link => {
      expect(link).toHaveAttribute('href', '/search-products')
    })
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
npx vitest run src/buyer/components/ProductsSection.test.tsx
```

Expected: `Error: Cannot find module './ProductsSection'`

- [ ] **Step 3: Implement ProductsSection**

```tsx
// src/buyer/components/ProductsSection.tsx
import { Link } from 'react-router-dom'
import { useWindowWidth } from '../../shared/hooks/useWindowWidth'
import { BannerCarousel } from './BannerCarousel'
import { ProductCard } from './ProductCard'

interface ProductItem {
  id: string
  image: string
  storeIcon: string
}

const MOCK_PRODUCTS: ProductItem[] = [
  { id: '1', image: 'https://picsum.photos/seed/prod1/300/345', storeIcon: 'https://picsum.photos/seed/s1/40/40' },
  { id: '2', image: 'https://picsum.photos/seed/prod2/300/345', storeIcon: 'https://picsum.photos/seed/s2/40/40' },
  { id: '3', image: 'https://picsum.photos/seed/prod3/300/345', storeIcon: 'https://picsum.photos/seed/s3/40/40' },
  { id: '4', image: 'https://picsum.photos/seed/prod4/300/345', storeIcon: 'https://picsum.photos/seed/s4/40/40' },
]

export function ProductsSection() {
  const width = useWindowWidth()
  const isTablet = width >= 640 && width < 1024
  const isMobile = width < 640
  const isDesktop = width >= 1024

  const visibleProducts = isTablet ? MOCK_PRODUCTS.slice(0, 3) : MOCK_PRODUCTS

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
              Descubre lo que el mundo tiene para ti
            </h2>
            <p
              style={{
                margin: '0.2rem 0 0',
                fontSize: isMobile ? '0.72rem' : '0.78rem',
                color: '#aaa',
              }}
            >
              Miles de productos de las mejores tiendas, en un solo lugar.
            </p>
          </div>
          <Link
            to="/search-products"
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
            Buscar productos
          </Link>
        </div>

        {/* Banner carousel */}
        <BannerCarousel />

        {/* Product cards grid */}
        <div
          style={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
            gap: '0.75rem',
            marginTop: '0.25rem',
          }}
        >
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              image={product.image}
              storeIcon={product.storeIcon}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run test — expect PASS**

```bash
npx vitest run src/buyer/components/ProductsSection.test.tsx
```

Expected: `4 tests passed`

- [ ] **Step 5: Run all buyer component tests together**

```bash
npx vitest run src/buyer/components/
```

Expected: all tests pass (ProductCard, BannerCarousel, ProductsSection, StoriesCarousel)

- [ ] **Step 6: Commit**

```bash
git add src/buyer/components/ProductsSection.tsx src/buyer/components/ProductsSection.test.tsx
git commit -m "feat: add ProductsSection component"
```

---

## Task 5: SearchProductsPage stub

**Files:**
- Create: `src/buyer/pages/SearchProductsPage.tsx`

- [ ] **Step 1: Create the stub page**

```tsx
// src/buyer/pages/SearchProductsPage.tsx
export function SearchProductsPage() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center', color: '#fff' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        Buscar Productos
      </h1>
      <p style={{ color: '#aaa', fontSize: '0.9rem' }}>
        Próximamente — aquí podrás encontrar todos los productos disponibles.
      </p>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/buyer/pages/SearchProductsPage.tsx
git commit -m "feat: add SearchProductsPage stub"
```

---

## Task 6: Wire router and HomePage

**Files:**
- Modify: `src/core/router/index.tsx`
- Modify: `src/buyer/pages/HomePage.tsx`

- [ ] **Step 1: Add route to router**

In `src/core/router/index.tsx`, add the `search-products` route inside the public buyer routes block, after `{ index: true, element: <HomePage /> }`:

```tsx
import { SearchProductsPage } from '../../buyer/pages/SearchProductsPage'

// inside the children array, after the index route:
{ path: 'search-products', element: <SearchProductsPage /> },
```

Full updated file:

```tsx
import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '../layout/AppShell'
import { AuthGuard } from '../auth/AuthGuard'
import { LoginPage } from '../auth/LoginPage'
import { HomePage } from '../../buyer/pages/HomePage'
import { ProfilePage } from '../../buyer/pages/ProfilePage'
import { CartPage } from '../../buyer/pages/CartPage'
import { OrdersPage } from '../../buyer/pages/OrdersPage'
import { NotificationsPage } from '../../buyer/pages/NotificationsPage'
import { ChatPage } from '../../buyer/pages/ChatPage'
import { ProjectsPage } from '../../saas/pages/ProjectsPage'
import { SearchProductsPage } from '../../buyer/pages/SearchProductsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      // Public buyer routes
      { index: true, element: <HomePage /> },
      { path: 'search-products', element: <SearchProductsPage /> },

      // Auth
      { path: 'login', element: <LoginPage /> },

      // Protected routes
      {
        element: <AuthGuard />,
        children: [
          { path: 'profile', element: <ProfilePage /> },
          { path: 'cart', element: <CartPage /> },
          { path: 'orders', element: <OrdersPage /> },
          { path: 'notifications', element: <NotificationsPage /> },
          { path: 'chat', element: <ChatPage /> },
          { path: 'saas/projects', element: <ProjectsPage /> },
        ],
      },
    ],
  },
])
```

- [ ] **Step 2: Mount ProductsSection in HomePage**

Replace the contents of `src/buyer/pages/HomePage.tsx`:

```tsx
import { StoriesCarousel } from '../components/StoriesCarousel'
import { ProductsSection } from '../components/ProductsSection'

export function HomePage() {
  return (
    <div>
      <StoriesCarousel />
      <ProductsSection />
    </div>
  )
}
```

- [ ] **Step 3: Run all tests**

```bash
npx vitest run
```

Expected: all tests pass with no errors.

- [ ] **Step 4: Run the dev server and verify visually**

```bash
npm run dev
```

Open `http://localhost:5173` and verify:
- `ProductsSection` appears below `StoriesCarousel`
- Header shows title and "Buscar productos" button
- Banner carousel renders with arrows on desktop, swipe-only on mobile
- 4 product cards on desktop/mobile, 3 on tablet
- Clicking any element navigates to `/search-products`
- `/search-products` page shows the stub content

- [ ] **Step 5: Final commit**

```bash
git add src/core/router/index.tsx src/buyer/pages/HomePage.tsx
git commit -m "feat: wire ProductsSection and search-products route to HomePage"
```
