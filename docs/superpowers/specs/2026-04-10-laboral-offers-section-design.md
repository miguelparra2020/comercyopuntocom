# LaboralOffersSection — Design Spec

**Date:** 2026-04-10

## Overview

Add a `LaboralOffersSection` to the buyer `HomePage`, below `ServicesSection`. It mirrors `StoresSection` exactly in structure and style, reusing `StoreCard` as-is. Cards show the store that is publishing the job offer (cover image, store icon, store name). All card and CTA links point to `/search-laboral-oferts`.

## Pieces

| Piece | Location |
|---|---|
| `LaboralOffersSection` | `src/buyer/components/LaboralOffersSection.tsx` |
| `LaboralOffersSection` tests | `src/buyer/components/LaboralOffersSection.test.tsx` |
| `SearchLaboralOfertsPage` | `src/buyer/pages/SearchLaboralOfertsPage.tsx` |
| Router update | `src/core/router/index.tsx` |
| `HomePage` update | `src/buyer/pages/HomePage.tsx` |

## LaboralOffersSection

**Structure** (identical to `StoresSection`):
- Outer dark container `background: #111`, full width
- Inner container `maxWidth: 1240px`, centered, responsive padding
- Header row:
  - Title: *"Encuentra tu próxima oportunidad laboral"*
  - Subtitle: *"Las mejores tiendas buscan talento como el tuyo."*
  - CTA button → `/search-laboral-oferts`, label: *"Ver ofertas laborales"*
- `BannerCarousel` (reused as-is)
- Responsive grid of `StoreCard` (reused directly — no new card component):
  - Desktop (≥1024px): 4 columns, 4 cards
  - Tablet (640–1023px): 3 columns, 3 cards
  - Mobile (<640px): 2 columns, 4 cards

**Mock data:** 4 items with `id`, `image`, `storeIcon`, `storeName` using picsum seeds.

## SearchLaboralOfertsPage

Stub page matching `SearchStoresPage` style — centered layout, white title, grey "Próximamente" subtitle.

## Router

Add `{ path: 'search-laboral-oferts', element: <SearchLaboralOfertsPage /> }` in the public buyer routes block, after `search-services`.

## HomePage

Render `<LaboralOffersSection />` immediately below `<ServicesSection />`. Order:
1. `<StoriesCarousel />`
2. `<ProductsSection />`
3. `<StoresSection />`
4. `<ServicesSection />`
5. `<LaboralOffersSection />`

## Tests

### LaboralOffersSection
- Renders section title
- Renders section subtitle
- Renders "Ver ofertas laborales" link → `/search-laboral-oferts`
- Renders 4 store card links on mobile/desktop (aria-label "Ver tiendas")
- Renders 3 store card links on tablet (768px)
