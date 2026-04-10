import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { StoriesCarousel } from './StoriesCarousel'

describe('StoriesCarousel', () => {
  it('renders store names', () => {
    render(<MemoryRouter><StoriesCarousel /></MemoryRouter>)

    expect(screen.getByText('Zara')).toBeInTheDocument()
    expect(screen.getByText('Nike')).toBeInTheDocument()
    expect(screen.getByText('Adidas')).toBeInTheDocument()
  })

  it('renders a card for each mock story', () => {
    render(<MemoryRouter><StoriesCarousel /></MemoryRouter>)

    const links = screen.getAllByRole('link')
    expect(links.length).toBe(7) // must match MOCK_STORIES.length in StoriesCarousel.tsx
  })

  it('each card links to the correct store slug', () => {
    render(<MemoryRouter><StoriesCarousel /></MemoryRouter>)

    const zaraLink = screen.getByRole('link', { name: /zara/i })
    expect(zaraLink).toHaveAttribute('href', '/store/zara')
  })
})
