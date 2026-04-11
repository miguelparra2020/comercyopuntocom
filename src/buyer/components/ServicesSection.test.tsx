import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ServicesSection } from './ServicesSection'

describe('ServicesSection', () => {
  it('renders the section title', () => {
    render(<MemoryRouter><ServicesSection /></MemoryRouter>)
    expect(
      screen.getByText('Los servicios que necesitas, cuando los necesitas')
    ).toBeInTheDocument()
  })

  it('renders the section description', () => {
    render(<MemoryRouter><ServicesSection /></MemoryRouter>)
    expect(
      screen.getByText('Profesionales verificados, listos para ayudarte.')
    ).toBeInTheDocument()
  })

  it('renders an "Explorar servicios" link to /search-services', () => {
    render(<MemoryRouter><ServicesSection /></MemoryRouter>)
    const btn = screen.getByRole('link', { name: /explorar servicios/i })
    expect(btn).toHaveAttribute('href', '/search-services')
  })

  it('renders 4 product card links (mobile/desktop — not tablet)', () => {
    // jsdom default: window.innerWidth = 0 (treated as mobile → 4 cards shown)
    render(<MemoryRouter><ServicesSection /></MemoryRouter>)
    const cardLinks = screen.getAllByRole('link', { name: /ver productos/i })
    expect(cardLinks.length).toBe(4)
  })

  describe('tablet layout', () => {
    const originalWidth = window.innerWidth

    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 768 })
    })

    afterEach(() => {
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: originalWidth })
    })

    it('renders only 3 product card links at tablet width', async () => {
      render(<MemoryRouter><ServicesSection /></MemoryRouter>)
      await act(async () => {
        window.dispatchEvent(new Event('resize'))
      })
      const cardLinks = screen.getAllByRole('link', { name: /ver productos/i })
      expect(cardLinks.length).toBe(3)
    })
  })
})
