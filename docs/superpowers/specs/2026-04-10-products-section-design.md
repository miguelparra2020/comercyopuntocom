# Products Section — Design Spec

**Date:** 2026-04-10  
**Status:** Approved

---

## Overview

A new section added to `HomePage` below `StoriesCarousel`. Its sole purpose is to attract users to visit `/search-products`. All interactive elements (banner, cards, button) navigate to that route. Data is hardcoded mock data.

---

## Architecture

Three new components under `src/buyer/components/`, plus one new page and one new route:

| File | Responsibility |
|---|---|
| `ProductsSection.tsx` | Container — composes header, BannerCarousel, and product cards grid |
| `BannerCarousel.tsx` | Horizontal banner carousel with prev/next arrows (desktop) and swipe (mobile/tablet) |
| `ProductCard.tsx` | Single square-ish card: product image + store icon overlay |
| `src/buyer/pages/SearchProductsPage.tsx` | Stub page for `/search-products` route |

---

## Components

### ProductsSection

- Full-width wrapper with dark background
- Inner container: `max-width: 1240px`, `margin: 0 auto`, centered
- Stacks vertically: Header → BannerCarousel → product cards grid
- All items centered within the container

#### Header row
- Left: title (`h2`) + short description (`p`)
  - Title: *"Descubre lo que el mundo tiene para ti"*
  - Description: *"Miles de productos de las mejores tiendas, en un solo lugar."*
- Right: outlined button "Buscar productos" → navigates to `/search-products`
- Flex row, `justify-content: space-between`, `align-items: center`

#### Product cards grid
Always renders exactly 4 `ProductCard` items. Column count changes per breakpoint:

| Breakpoint | Columns | Visible cards |
|---|---|---|
| Desktop (`≥ 1024px`) | 4 | 4 (one row) |
| Tablet (`≥ 640px < 1024px`) | 3 | 3 — 4th card hidden via CSS (`display: none`) |
| Mobile (`< 640px`) | 2 | 4 (2×2 grid) |

Each card → `Link` to `/search-products`.

---

### BannerCarousel

- Full width within the container
- Shows one banner at a time (scroll snap)
- **Desktop:** prev/next arrow buttons visible on left and right edges
- **Tablet/Mobile:** arrows hidden; swipe-to-scroll only
- Dot indicators below (active dot highlighted in brand color `#646cff`)
- Each banner → `Link` to `/search-products`
- Mock banners: 3 items, each with a background image from picsum + overlay text

---

### ProductCard

- Aspect ratio: `1 / 1.15` (slightly taller than square)
- Border radius: `14px`
- Background image (product photo) covers the full card
- Subtle gradient overlay (bottom-to-top, dark) for depth
- Store icon: circular avatar, `28px`, top-left corner, bordered with `#646cff`
- No product name text on the card — image + store icon only
- Entire card is a `Link` to `/search-products`

#### Mock data (exactly 4 items)
```ts
const MOCK_PRODUCTS = [
  { id: '1', image: 'https://picsum.photos/seed/prod1/300/345', storeIcon: 'https://picsum.photos/seed/s1/28/28' },
  { id: '2', image: 'https://picsum.photos/seed/prod2/300/345', storeIcon: 'https://picsum.photos/seed/s2/28/28' },
  { id: '3', image: 'https://picsum.photos/seed/prod3/300/345', storeIcon: 'https://picsum.photos/seed/s3/28/28' },
  { id: '4', image: 'https://picsum.photos/seed/prod4/300/345', storeIcon: 'https://picsum.photos/seed/s4/28/28' },
]
```
The 4th card carries a CSS class (e.g. `hide-on-tablet`) that applies `display: none` at the tablet breakpoint.

---

### SearchProductsPage

- Stub page at `/search-products`
- Simple centered layout: heading "Buscar Productos" + placeholder text
- Protected or public route: **public** (no auth required)

---

## Routing

Add to `src/core/router/index.tsx` under public buyer routes:

```tsx
{ path: 'search-products', element: <SearchProductsPage /> }
```

---

## Styling approach

- Inline styles (same pattern as `StoriesCarousel`) — no new CSS files
- Responsive breakpoints via `window` media queries or CSS Grid `auto-fill` — use CSS Grid with fixed column counts per breakpoint via inline style or a small `useWindowWidth` hook if needed
- Brand color: `#646cff`
- Background: `#000` or `#111` for the section wrapper

---

## What this is NOT

- Not a real product listing — no API calls, no search logic
- Not a product detail page — cards are purely decorative anchors
- The `/search-products` page is a stub only — full search functionality is out of scope for this spec

