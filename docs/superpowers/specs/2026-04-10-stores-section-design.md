# StoresSection — Design Spec

**Date:** 2026-04-10

## Overview

Add a `StoresSection` to the buyer `HomePage`, mirroring `ProductsSection` in structure but displaying store cards instead of product cards. Each store card has a horizontal cover image, a circular store icon top-left, and the store name at the bottom.

## Pieces

| Piece | Location |
|---|---|
| `StoreCard` | `src/buyer/components/StoreCard.tsx` |
| `StoreCard` tests | `src/buyer/components/StoreCard.test.tsx` |
| `StoresSection` | `src/buyer/components/StoresSection.tsx` |
| `StoresSection` tests | `src/buyer/components/StoresSection.test.tsx` |
| `SearchStoresPage` | `src/buyer/pages/SearchStoresPage.tsx` |
| Router update | `src/core/router/index.tsx` |
| `HomePage` update | `src/buyer/pages/HomePage.tsx` |

## StoreCard

**Props:** `image: string`, `storeIcon: string`, `storeName: string`

**Visual:**
- Link wrapping the whole card → `/search-stores`
- `aria-label="Ver tiendas"`
- Aspect ratio `16 / 9` (horizontal/landscape)
- Border radius `14px`, dark background `#1a1a1a`, border `1px solid #2a2a2a`
- Cover image fills 100% width and height (`objectFit: cover`)
- Gradient overlay: `linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)`
- Circular store icon top-left (28×28px, border `2px solid #646cff`, background `#222`)
- Store name text bottom-left, white, ~0.75rem, fontWeight 600, over the gradient

## StoresSection

**Structure** (identical to `ProductsSection`):
- Outer dark container `background: #111`, full width
- Inner container `maxWidth: 1240px`, centered, responsive padding
- Header row:
  - Title: *"Las tiendas más cerca de lo que buscas"*
  - Subtitle: *"Las mejores tiendas, verificadas y listas para ti."*
  - CTA button → `/search-stores`, label: *"Explorar tiendas"*
- `BannerCarousel` (reused as-is)
- Responsive grid of `StoreCard`:
  - Desktop (≥1024px): 4 columns, 4 stores
  - Tablet (640–1023px): 3 columns, 3 stores
  - Mobile (<640px): 2 columns, 4 stores

**Mock data:** 4 items with `id`, `image`, `storeIcon`, `storeName` using picsum seeds.

## SearchStoresPage

Stub page identical in pattern to `SearchProductsPage` — renders a placeholder heading.

## Router

Add `{ path: 'search-stores', element: <SearchStoresPage /> }` alongside the existing `search-products` route.

## HomePage

Render `<StoresSection />` immediately below `<ProductsSection />`.

## Tests

### StoreCard
- Renders a link with `aria-label="Ver tiendas"` pointing to `/search-stores`
- Renders the cover image
- Renders the store icon image
- Renders the store name text

### StoresSection
- Renders section title
- Renders section subtitle
- Renders "Explorar tiendas" link → `/search-stores`
- Renders 4 store card links on mobile/desktop
- Renders 3 store card links on tablet (768px)
