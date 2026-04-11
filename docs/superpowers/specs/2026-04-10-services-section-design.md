# ServicesSection — Design Spec

**Date:** 2026-04-10

## Overview

Add a `ServicesSection` to the buyer `HomePage`, below `StoresSection`. It is a direct clone of `ProductsSection` in structure and style, reusing `ProductCard` as-is. Only the texts and link target differ.

## Pieces

| Piece | Location |
|---|---|
| `ServicesSection` | `src/buyer/components/ServicesSection.tsx` |
| `ServicesSection` tests | `src/buyer/components/ServicesSection.test.tsx` |
| `SearchServicesPage` | `src/buyer/pages/SearchServicesPage.tsx` |
| Router update | `src/core/router/index.tsx` |
| `HomePage` update | `src/buyer/pages/HomePage.tsx` |

## ServicesSection

**Structure** (identical to `ProductsSection`):
- Outer dark container `background: #111`, full width
- Inner container `maxWidth: 1240px`, centered, responsive padding
- Header row:
  - Title: *"Los servicios que necesitas, cuando los necesitas"*
  - Subtitle: *"Profesionales verificados, listos para ayudarte."*
  - CTA button → `/search-services`, label: *"Explorar servicios"*
- `BannerCarousel` (reused as-is)
- Responsive grid of `ProductCard` (reused directly — no new card component):
  - Desktop (≥1024px): 4 columns, 4 cards
  - Tablet (640–1023px): 3 columns, 3 cards
  - Mobile (<640px): 2 columns, 4 cards

**Mock data:** 4 items with `id`, `image`, `storeIcon` using picsum seeds (same shape as `ProductItem` in `ProductsSection`).

## SearchServicesPage

Stub page matching `SearchProductsPage` style — centered layout, white text, "Próximamente" subtitle.

## Router

Add `{ path: 'search-services', element: <SearchServicesPage /> }` in the public buyer routes block, after `search-stores`.

## HomePage

Render `<ServicesSection />` immediately below `<StoresSection />`. Order:
1. `<StoriesCarousel />`
2. `<ProductsSection />`
3. `<StoresSection />`
4. `<ServicesSection />`

## Tests

### ServicesSection
- Renders section title
- Renders section subtitle
- Renders "Explorar servicios" link → `/search-services`
- Renders 4 product card links on mobile/desktop (aria-label "Ver productos")
- Renders 3 product card links on tablet (768px)
