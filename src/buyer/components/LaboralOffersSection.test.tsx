import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LaboralOffersSection } from './LaboralOffersSection'

describe('LaboralOffersSection', () => {
  it('renders the section title', () => {
    render(<MemoryRouter><LaboralOffersSection /></MemoryRouter>)
    expect(
      screen.getByText('Encuentra tu próxima oportunidad laboral')
    ).toBeInTheDocument()
  })

  it('renders the section description', () => {
    render(<MemoryRouter><LaboralOffersSection /></MemoryRouter>)
    expect(
      screen.getByText('Las mejores tiendas buscan talento como el tuyo.')
    ).toBeInTheDocument()
  })

  it('renders 5 links to /search-laboral-oferts on mobile/desktop (1 CTA + 4 cards)', () => {
    // jsdom default: window.innerWidth = 0 (treated as mobile → 4 cards shown)
    // Both the CTA button and each StoreCard share aria-label "Ver ofertas laborales"
    render(<MemoryRouter><LaboralOffersSection /></MemoryRouter>)
    const links = screen.getAllByRole('link', { name: /ver ofertas laborales/i })
    expect(links.length).toBe(5) // 1 CTA + 4 store cards
    links.forEach(link => {
      expect(link).toHaveAttribute('href', '/search-laboral-oferts')
    })
  })

  describe('tablet layout', () => {
    const originalWidth = window.innerWidth

    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 768 })
    })

    afterEach(() => {
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: originalWidth })
    })

    it('renders 4 links to /search-laboral-oferts at tablet width (1 CTA + 3 cards)', async () => {
      render(<MemoryRouter><LaboralOffersSection /></MemoryRouter>)
      await act(async () => {
        window.dispatchEvent(new Event('resize'))
      })
      const links = screen.getAllByRole('link', { name: /ver ofertas laborales/i })
      expect(links.length).toBe(4) // 1 CTA + 3 store cards
      links.forEach(link => {
        expect(link).toHaveAttribute('href', '/search-laboral-oferts')
      })
    })
  })
})
