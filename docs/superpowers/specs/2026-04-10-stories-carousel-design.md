# Stories Carousel — Design Spec
**Date:** 2026-04-10

## Overview

A horizontal stories carousel on the buyer home page (`/`) showing store stories, similar to Facebook's stories UI. Each card represents a store and taps through to that store's page. Data is hardcoded for now; will be replaced by an API call later.

## Components

### `src/buyer/components/StoriesCarousel.tsx`
- Self-contained component, no external dependencies
- Renders a horizontally scrollable row of `StoryCard` items
- Uses `overflow-x: auto` + `scroll-snap-type: x mandatory` for smooth snapping
- Hides scrollbar via CSS for a clean look

### `StoryCard` (inline inside StoriesCarousel)
- Size: ~80px wide × 130px tall
- Background: full-cover image (vertical/portrait)
- Store logo: circular image (32px) in top-left corner with a colored border ring
- Store name: white bold text pinned to the bottom with a gradient overlay for legibility
- On click: `navigate('/store/:slug')` (route does not exist yet — click is wired but destination is a future route)

## Data Shape

```ts
interface StoryItem {
  slug: string
  name: string
  logo: string      // URL
  bgImage: string   // URL
}
```

Mock array of 6–7 stores using `picsum.photos` or similar placeholder URLs.

## Placement

`HomePage` renders `<StoriesCarousel />` at the top, above any future content sections.

## Out of Scope

- "Crear historia" card — stories are created from the SaaS panel, not the buyer app
- Seen/unseen ring animation (future)
- Real API integration (future)
- Story viewer/modal (future)
