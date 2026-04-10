# Stories Carousel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a horizontal stories carousel to the buyer home page showing store stories with logo, background image, and store name.

**Architecture:** A self-contained `StoriesCarousel` component renders a horizontally scrollable row of story cards using CSS scroll-snap. Hardcoded mock data drives the UI for now. `HomePage` mounts the carousel at the top.

**Tech Stack:** React 18, TypeScript, React Router v6, Vitest + React Testing Library

---

### Task 1: StoriesCarousel component (TDD)

**Files:**
- Create: `src/buyer/components/StoriesCarousel.test.tsx`
- Create: `src/buyer/components/StoriesCarousel.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/buyer/components/StoriesCarousel.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { StoriesCarousel } from './StoriesCarousel'

describe('StoriesCarousel', () => {
  it('renders all store names', () => {
    render(<MemoryRouter><StoriesCarousel /></MemoryRouter>)

    expect(screen.getByText('Zara')).toBeInTheDocument()
    expect(screen.getByText('Nike')).toBeInTheDocument()
    expect(screen.getByText('Adidas')).toBeInTheDocument()
  })

  it('renders a card for each mock story', () => {
    render(<MemoryRouter><StoriesCarousel /></MemoryRouter>)

    const links = screen.getAllByRole('link')
    expect(links.length).toBe(7)
  })

  it('each card links to the correct store slug', () => {
    render(<MemoryRouter><StoriesCarousel /></MemoryRouter>)

    const zaraLink = screen.getByRole('link', { name: /zara/i })
    expect(zaraLink).toHaveAttribute('href', '/store/zara')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test -- StoriesCarousel --run
```

Expected: FAIL — "Cannot find module './StoriesCarousel'"

- [ ] **Step 3: Implement the component**

Create `src/buyer/components/StoriesCarousel.tsx`:

```tsx
import { Link } from 'react-router-dom'

interface StoryItem {
  slug: string
  name: string
  logo: string
  bgImage: string
}

const MOCK_STORIES: StoryItem[] = [
  { slug: 'zara',        name: 'Zara',        logo: 'https://picsum.photos/seed/zara/40/40',        bgImage: 'https://picsum.photos/seed/zarabg/200/300' },
  { slug: 'nike',        name: 'Nike',        logo: 'https://picsum.photos/seed/nike/40/40',        bgImage: 'https://picsum.photos/seed/nikebg/200/300' },
  { slug: 'adidas',      name: 'Adidas',      logo: 'https://picsum.photos/seed/adidas/40/40',      bgImage: 'https://picsum.photos/seed/adidasbg/200/300' },
  { slug: 'levis',       name: "Levi's",      logo: 'https://picsum.photos/seed/levis/40/40',       bgImage: 'https://picsum.photos/seed/levisbg/200/300' },
  { slug: 'mango',       name: 'Mango',       logo: 'https://picsum.photos/seed/mango/40/40',       bgImage: 'https://picsum.photos/seed/mangobg/200/300' },
  { slug: 'hm',          name: 'H&M',         logo: 'https://picsum.photos/seed/hm/40/40',          bgImage: 'https://picsum.photos/seed/hmbg/200/300' },
  { slug: 'pull-bear',   name: 'Pull&Bear',   logo: 'https://picsum.photos/seed/pullbear/40/40',    bgImage: 'https://picsum.photos/seed/pullbearbg/200/300' },
]

export function StoriesCarousel() {
  return (
    <div
      style={{
        display: 'flex',
        gap: '0.6rem',
        overflowX: 'auto',
        scrollSnapType: 'x mandatory',
        padding: '0.75rem 1rem',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      {MOCK_STORIES.map((story) => (
        <Link
          key={story.slug}
          to={`/store/${story.slug}`}
          aria-label={story.name}
          style={{
            flexShrink: 0,
            scrollSnapAlign: 'start',
            width: '80px',
            height: '130px',
            borderRadius: '12px',
            overflow: 'hidden',
            position: 'relative',
            display: 'block',
            textDecoration: 'none',
            backgroundImage: `url(${story.bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Store logo */}
          <img
            src={story.logo}
            alt={story.name}
            style={{
              position: 'absolute',
              top: '6px',
              left: '6px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: '2px solid #646cff',
              objectFit: 'cover',
            }}
          />

          {/* Gradient overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '50px',
              background: 'linear-gradient(to top, rgba(0,0,0,0.75), transparent)',
            }}
          />

          {/* Store name */}
          <span
            style={{
              position: 'absolute',
              bottom: '6px',
              left: 0,
              right: 0,
              textAlign: 'center',
              color: '#fff',
              fontSize: '0.65rem',
              fontWeight: 'bold',
              padding: '0 4px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {story.name}
          </span>
        </Link>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm run test -- StoriesCarousel --run
```

Expected: PASS — 3 tests passing

- [ ] **Step 5: Commit**

```bash
git add src/buyer/components/StoriesCarousel.tsx src/buyer/components/StoriesCarousel.test.tsx
git commit -m "feat: add StoriesCarousel component with mock data"
```

---

### Task 2: Mount carousel in HomePage

**Files:**
- Modify: `src/buyer/pages/HomePage.tsx`

- [ ] **Step 1: Update HomePage**

Replace the contents of `src/buyer/pages/HomePage.tsx`:

```tsx
import { StoriesCarousel } from '../components/StoriesCarousel'

export function HomePage() {
  return (
    <div>
      <StoriesCarousel />
    </div>
  )
}
```

- [ ] **Step 2: Verify in browser**

```bash
npm run dev
```

Open `http://localhost:5173` — the home page should show the horizontal stories carousel with 7 store cards.

- [ ] **Step 3: Commit**

```bash
git add src/buyer/pages/HomePage.tsx
git commit -m "feat: mount StoriesCarousel on home page"
```
