import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ProductsSection } from './ProductsSection'

describe('ProductsSection', () => {
  it('renders the section title', () => {
    render(<MemoryRouter><ProductsSection /></MemoryRouter>)
    expect(
      screen.getByText('Descubre lo que el mundo tiene para ti')
    ).toBeInTheDocument()
  })

  it('renders the section description', () => {
    render(<MemoryRouter><ProductsSection /></MemoryRouter>)
    expect(
      screen.getByText('Miles de productos de las mejores tiendas, en un solo lugar.')
    ).toBeInTheDocument()
  })

  it('renders a "Buscar productos" link to /search-products', () => {
    render(<MemoryRouter><ProductsSection /></MemoryRouter>)
    const btn = screen.getByRole('link', { name: /buscar productos/i })
    expect(btn).toHaveAttribute('href', '/search-products')
  })

  it('renders 4 product card links to /search-products (mobile/desktop — not tablet)', () => {
    // jsdom default: window.innerWidth = 0 (treated as mobile → 4 cards shown)
    render(<MemoryRouter><ProductsSection /></MemoryRouter>)
    const productLinks = screen.getAllByRole('link', { name: /ver productos/i })
    expect(productLinks.length).toBe(4)
    productLinks.forEach(link => {
      expect(link).toHaveAttribute('href', '/search-products')
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

    it('renders only 3 product card links at tablet width', async () => {
      render(<MemoryRouter><ProductsSection /></MemoryRouter>)
      await act(async () => {
        window.dispatchEvent(new Event('resize'))
      })
      const productLinks = screen.getAllByRole('link', { name: /ver productos/i })
      expect(productLinks.length).toBe(3)
    })
  })
})
