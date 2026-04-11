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
