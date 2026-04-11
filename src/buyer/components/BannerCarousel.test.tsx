import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { BannerCarousel } from './BannerCarousel'

// jsdom does not implement scrollIntoView — stub it globally for all tests in this file
beforeEach(() => {
  window.HTMLElement.prototype.scrollIntoView = vi.fn()
})

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

  it('clicking the second dot makes it active and deactivates the first', async () => {
    const user = userEvent.setup()
    const { container } = render(<MemoryRouter><BannerCarousel /></MemoryRouter>)
    const dots = container.querySelectorAll('[data-testid="banner-dot"]')
    await user.click(dots[1] as HTMLElement)
    expect((dots[1] as HTMLElement).dataset.active).toBe('true')
    expect((dots[0] as HTMLElement).dataset.active).toBe('false')
  })

  describe('desktop arrows', () => {
    const originalWidth = window.innerWidth

    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1280 })
    })

    afterEach(() => {
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: originalWidth })
    })

    it('shows previous and next arrow buttons at desktop width', async () => {
      render(<MemoryRouter><BannerCarousel /></MemoryRouter>)
      await act(async () => {
        window.dispatchEvent(new Event('resize'))
      })
      expect(screen.getByRole('button', { name: 'Banner anterior' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Banner siguiente' })).toBeInTheDocument()
    })
  })
})
